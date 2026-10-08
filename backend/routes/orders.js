const express = require('express');
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

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { userId: String(req.user._id) },
    });
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      localOrderId: order._id,
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
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
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
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();
    await order.save();
    return res.json({ success: true, paymentStatus: 'paid', orderId: order._id });
  } catch (error) {
    console.error('Payment verification failed:', error.statusCode || 500);
    return res.status(500).json({ message: 'Unable to verify payment' });
  }
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
