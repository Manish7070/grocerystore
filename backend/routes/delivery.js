const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/delivery/assigned - Get orders in delivery queue
router.get('/assigned', auth.protect, asyncHandler(async (req, res) => {
  // Orders ready for dispatch or in transit
  const orders = await Order.find({
    deliveryStatus: { $in: ['confirmed', 'packed', 'shipped', 'out_for_delivery'] },
  }).sort({ createdAt: -1 });

  res.json(orders);
}));

// GET /api/delivery/completed - Delivered orders history
router.get('/completed', auth.protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryStatus: 'delivered',
  }).sort({ updatedAt: -1 }).limit(20);

  res.json(orders);
}));

// PUT /api/delivery/:id/status - Update delivery progress & verify with OTP
router.put('/:id/status', auth.protect, asyncHandler(async (req, res) => {
  const { status, otp, notes } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const validTransitions = ['packed', 'shipped', 'out_for_delivery', 'delivered'];
  if (!validTransitions.includes(status)) {
    return res.status(400).json({ message: 'Invalid delivery status transition' });
  }

  // If marking delivered, check OTP if one is set
  if (status === 'delivered') {
    if (order.deliveryOtp && order.deliveryOtp !== otp) {
      return res.status(400).json({ message: 'Invalid Delivery Verification OTP' });
    }
    if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
    }
  }

  order.deliveryStatus = status;
  order.statusTimeline.push({
    status,
    title: status === 'delivered' ? 'Order Delivered Successfully' : `Order is ${status.replace(/_/g, ' ')}`,
    timestamp: new Date(),
    note: notes || (status === 'delivered' ? 'Customer OTP verified at doorstep' : 'Status updated by delivery executive'),
  });

  await order.save();
  res.json({
    success: true,
    message: `Order updated to ${status}`,
    order,
  });
}));

module.exports = router;
