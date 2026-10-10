const express = require('express');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyRazorpaySignature } = require('../utils/razorpaySignature');
const { badRequest, validateDelivery, validateItems } = require('../utils/orderValidation');
const { matchesCapturedPayment, verifyWebhook } = require('../utils/paymentStatus');
const router = express.Router();

const isRazorpayConfigured = () => Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

const getRazorpayClient = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const buildOrderDetails = async (items) => {
  const quantities = validateItems(items);

  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  if (products.length !== quantities.size) {
    throw badRequest('One or more cart products are no longer available');
  }

  for (const product of products) {
    if (product.stock < quantities.get(String(product._id))) {
      throw badRequest(`${product.name} has only ${product.stock} available`);
    }
    if (!Number.isFinite(product.price) || product.price <= 0) {
      throw badRequest('A product price is unavailable. Please refresh your cart.');
    }
  }

  const orderItems = products.map((product) => ({
    productId: String(product._id),
    name: product.name,
    externalId: product.externalId,
    category: product.category,
    price: product.price,
    quantity: quantities.get(String(product._id)),
    image: product.image,
  }));
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const amountInPaise = Math.round(totalAmount * 100);

  if (!Number.isSafeInteger(amountInPaise) || amountInPaise < 100) {
    throw badRequest('Invalid order amount');
  }

  return { orderItems, totalAmount, amountInPaise };
};

router.get('/config', (req, res) => {
  res.json({ configured: isRazorpayConfigured(), mode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'live' : 'test' });
});

// Raw-body HMAC is independent from the checkout signature and JWT authentication.
router.post('/webhook', async (req, res, next) => {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return res.sendStatus(503);
  if (!verifyWebhook(req.body, req.get('x-razorpay-signature'), process.env.RAZORPAY_WEBHOOK_SECRET)) {
    return res.sendStatus(400);
  }
  try {
    const event = JSON.parse(req.body.toString('utf8'));
    if (!['payment.captured', 'order.paid'].includes(event.event)) return res.sendStatus(200);
    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return res.sendStatus(400);
    const order = await Order.findOne({ razorpayOrderId: payment.order_id, paymentMethod: 'razorpay' });
    // Let the provider retry if order persistence has not completed yet.
    if (!order) return res.sendStatus(503);
    if (!matchesCapturedPayment(order, payment)) return res.sendStatus(400);
    await Order.updateOne({ _id: order._id, paymentStatus: { $ne: 'paid' } }, {
      $set: { paymentStatus: 'paid', razorpayPaymentId: payment.id, paidAt: new Date() },
    });
    return res.sendStatus(200);
  } catch (error) {
    if (error instanceof SyntaxError) return res.sendStatus(400);
    return next(error);
  }
});

router.post('/:id/sync', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ razorpayOrderId: req.params.id, userId: req.user._id, paymentMethod: 'razorpay' });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.json({ paymentStatus: 'paid' });
    if (!isRazorpayConfigured()) return res.status(503).json({ message: 'Payment status is temporarily unavailable' });
    const result = await getRazorpayClient().orders.fetchPayments(order.razorpayOrderId);
    const payment = result.items?.find((item) => matchesCapturedPayment(order, item));
    if (payment) {
      await Order.updateOne({ _id: order._id, paymentStatus: { $ne: 'paid' } }, {
        $set: { paymentStatus: 'paid', razorpayPaymentId: payment.id, paidAt: new Date() },
      });
    }
    // Read current state in case a webhook confirmed it concurrently.
    const current = await Order.findById(order._id);
    return res.json({ paymentStatus: current.paymentStatus });
  } catch {
    return res.status(502).json({ message: 'Unable to check payment status. Please try again shortly.' });
  }
});

const generateOrderNumber = () => `TD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

router.post('/', protect, async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        code: 'PAYMENT_NOT_CONFIGURED',
        message: 'Online payment is currently unavailable. Please choose Cash on Delivery.',
      });
    }

    const deliveryAddress = validateDelivery(req.body.deliveryAddress);
    const { orderItems, totalAmount, amountInPaise } = await buildOrderDetails(req.body.items);
    const orderNumber = generateOrderNumber();
    const deliveryOtp = generateOtp();
    const deliverySlot = req.body.deliverySlot || 'Express Delivery (30-45 mins)';
    const couponCode = req.body.couponCode || '';
    const couponDiscount = Number(req.body.couponDiscount) || 0;
    const finalAmount = Math.max(totalAmount - couponDiscount, 1);
    const finalAmountInPaise = Math.round(finalAmount * 100);

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { userId: String(req.user._id), orderNumber },
    });

    const order = await Order.create({
      userId: req.user._id,
      orderNumber,
      items: orderItems,
      subtotal: totalAmount,
      couponCode,
      couponDiscount,
      totalAmount: finalAmount,
      deliveryAddress,
      deliverySlot,
      deliveryOtp,
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      statusTimeline: [{
        status: 'placed',
        title: 'Order Placed',
        timestamp: new Date(),
        note: 'Order initiated with Razorpay secure gateway',
      }],
    });

    return res.status(201).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      localOrderId: order._id,
      orderNumber,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.statusCode || 502);
    return res.status(error.statusCode === 400 ? 400 : 502).json({
      message: error.statusCode === 400 && !error.error ? error.message : 'Unable to start online payment. Please try again later.',
    });
  }
});

router.post('/cod', protect, async (req, res) => {
  try {
    const deliveryAddress = validateDelivery(req.body.deliveryAddress);
    const { orderItems, totalAmount } = await buildOrderDetails(req.body.items);
    const orderNumber = generateOrderNumber();
    const deliveryOtp = generateOtp();
    const deliverySlot = req.body.deliverySlot || 'Express Delivery (30-45 mins)';
    const couponCode = req.body.couponCode || '';
    const couponDiscount = Number(req.body.couponDiscount) || 0;
    const finalAmount = Math.max(totalAmount - couponDiscount, 0);

    // Atomically decrement stock when MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      orderNumber,
      items: orderItems,
      subtotal: totalAmount,
      couponCode,
      couponDiscount,
      totalAmount: finalAmount,
      deliveryAddress,
      deliverySlot,
      deliveryOtp,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      deliveryStatus: 'confirmed',
      statusTimeline: [{
        status: 'confirmed',
        title: 'Order Confirmed',
        timestamp: new Date(),
        note: 'Cash on Delivery confirmed. Scheduled for packing.',
      }],
    });

    return res.status(201).json({
      success: true,
      message: 'Cash on Delivery order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Cash on Delivery order error:', error);
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Unable to place Cash on Delivery order',
    });
  }
});

router.post('/:id/verify', protect, async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({ message: 'Razorpay is not configured' });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Incomplete Razorpay response' });
    }

    const order = await Order.findOne({
      razorpayOrderId: req.params.id,
      userId: req.user._id,
      paymentMethod: 'razorpay',
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (razorpayOrderId && razorpayOrderId !== order.razorpayOrderId) {
      return res.status(400).json({ message: 'Payment order reference does not match' });
    }

    if (order.paymentStatus === 'paid' && order.razorpayPaymentId === razorpayPaymentId) {
      return res.json({ success: true, paymentStatus: 'paid', orderId: order._id });
    }
    if (order.paymentStatus === 'paid') {
      return res.status(409).json({ message: 'This order is already paid' });
    }

    const signatureMatches = verifyRazorpaySignature({
      orderId: order.razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!signatureMatches) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const payment = await getRazorpayClient().payments.fetch(razorpayPaymentId);
    if (payment.order_id !== order.razorpayOrderId || payment.currency !== 'INR'
      || Number(payment.amount) !== Math.round(order.totalAmount * 100)) {
      return res.status(400).json({ message: 'Payment details do not match this order' });
    }
    if (payment.status !== 'captured') {
      return res.status(409).json({ code: 'PAYMENT_PENDING', message: 'Payment confirmation is pending. Check again shortly; do not pay again.' });
    }

    order.paymentStatus = 'paid';
    order.deliveryStatus = 'confirmed';
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();
    order.statusTimeline.push({
      status: 'confirmed',
      title: 'Payment Confirmed',
      timestamp: new Date(),
      note: 'Payment successfully captured via Razorpay. Order dispatched to fulfillment center.',
    });

    // Atomically decrement stock upon verified online payment
    if (mongoose.connection.readyState === 1) {
      for (const item of order.items) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    await order.save();
    return res.json({ success: true, paymentStatus: 'paid', orderId: order._id });
  } catch (error) {
    console.error('Payment verification failed:', error.statusCode || 500);
    return res.status(500).json({ message: 'Unable to verify payment' });
  }
});

// GET /api/orders/track/:orderNumber - Visual tracking by orderNumber
router.get('/track/:orderNumber', async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) {
    return res.status(404).json({ message: 'Order number not found' });
  }
  res.json({
    orderNumber: order.orderNumber,
    deliveryStatus: order.deliveryStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    deliverySlot: order.deliverySlot,
    deliveryOtp: order.deliveryOtp,
    deliveryAddress: {
      name: order.deliveryAddress?.name,
      city: order.deliveryAddress?.city,
      pincode: order.deliveryAddress?.pincode,
    },
    items: order.items,
    totalAmount: order.totalAmount,
    statusTimeline: order.statusTimeline,
    createdAt: order.createdAt,
  });
});

// POST /api/orders/:id/cancel - Customer eligible order cancellation with stock restore
router.post('/:id/cancel', protect, async (req, res) => {
  const { reason } = req.body;
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (['shipped', 'out_for_delivery', 'delivered'].includes(order.deliveryStatus)) {
    return res.status(400).json({ message: 'Order has already been dispatched and cannot be cancelled.' });
  }

  if (order.deliveryStatus === 'cancelled') {
    return res.status(400).json({ message: 'Order is already cancelled' });
  }

  // Restore inventory
  if (mongoose.connection.readyState === 1) {
    for (const item of order.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }
  }

  order.deliveryStatus = 'cancelled';
  order.cancellationReason = reason || 'Cancelled by customer';
  order.statusTimeline.push({
    status: 'cancelled',
    title: 'Order Cancelled',
    timestamp: new Date(),
    note: order.cancellationReason,
  });

  await order.save();
  res.json({ success: true, message: 'Order cancelled successfully and inventory restored.', order });
});

router.get('/', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

