const express = require('express');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyRazorpaySignature } = require('../utils/razorpaySignature');
const router = express.Router();

const isRazorpayConfigured = () => Boolean(
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
);

const getRazorpayClient = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const orderError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const buildOrderDetails = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw orderError('Your cart is empty');
  }

  const quantities = new Map();
  for (const item of items) {
    const quantity = Number(item.quantity);
    if (!item.productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw orderError('Cart contains an invalid item or quantity');
    }
    quantities.set(String(item.productId), quantity);
  }

  const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
  if (products.length !== quantities.size) {
    throw orderError('One or more cart products are no longer available');
  }

  const orderItems = products.map((product) => ({
    productId: String(product._id),
    name: product.name,
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
    throw orderError('Invalid order amount');
  }

  return { orderItems, totalAmount, amountInPaise };
};

router.get('/config', (req, res) => {
  res.json({ configured: isRazorpayConfigured() });
});

router.post('/', protect, async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        code: 'PAYMENT_NOT_CONFIGURED',
        message: 'Razorpay is not configured. Add test keys to backend/.env and restart the backend.',
      });
    }

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
    console.error('Razorpay order creation error:', error);
    const gatewayMessage = error.error?.description;
    return res.status(error.statusCode || 502).json({
      message: gatewayMessage || 'Unable to start payment. Check the Razorpay test keys and try again.',
    });
  }
});

router.post('/cod', protect, async (req, res) => {
  try {
    const { orderItems, totalAmount } = await buildOrderDetails(req.body.items);
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
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

    const signatureMatches = verifyRazorpaySignature({
      orderId: order.razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
      secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!signatureMatches) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.paidAt = new Date();
    await order.save();
    return res.json({ success: true, paymentStatus: 'paid', orderId: order._id });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ message: 'Unable to verify payment' });
  }
});

router.get('/', protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
