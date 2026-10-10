const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/admin/metrics - Real aggregated MongoDB metrics
router.get('/metrics', asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const deliveredOrders = await Order.countDocuments({ deliveryStatus: 'delivered' });
  const pendingOrders = await Order.countDocuments({
    deliveryStatus: { $in: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery'] },
  });

  const salesAggregation = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = salesAggregation[0]?.totalRevenue || 0;

  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.find({ stock: { $lte: 20 } }).limit(10);
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  // Recent 6 orders
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

  res.json({
    totalOrders,
    deliveredOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    totalCustomers,
    recentOrders,
  });
}));

// GET /api/admin/orders - All orders with search & status filter
router.get('/orders', asyncHandler(async (req, res) => {
  const { status, paymentStatus, search } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.deliveryStatus = status;
  if (paymentStatus && paymentStatus !== 'All') filter.paymentStatus = paymentStatus;

  let query = Order.find(filter).sort({ createdAt: -1 });
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query = query.or([
      { orderNumber: searchRegex },
      { 'deliveryAddress.name': searchRegex },
      { 'deliveryAddress.phone': searchRegex },
      { 'deliveryAddress.city': searchRegex },
    ]);
  }

  const orders = await query.limit(50);
  res.json(orders);
}));

// PUT /api/admin/orders/:id/status - Update order delivery status
router.put('/orders/:id/status', asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.deliveryStatus = status;
  if (status === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
    order.paidAt = new Date();
  }

  order.statusTimeline.push({
    status,
    title: `Order marked ${status.replace(/_/g, ' ')}`,
    timestamp: new Date(),
    note: note || 'Updated by store admin',
  });

  await order.save();
  res.json({ success: true, order });
}));

// GET /api/admin/customers - List registered customers
router.get('/customers', asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' })
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(customers);
}));

module.exports = router;
