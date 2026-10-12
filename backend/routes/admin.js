const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Lock down all admin routes with authentication and admin privilege
router.use(protect, adminOnly);

// ==========================================
// 1. METRICS & STORE INTELLIGENCE
// ==========================================
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
  const pendingApprovals = await Product.countDocuments({ approvalStatus: 'pending' });
  const lowStockProducts = await Product.find({ stock: { $lte: 20 } }).limit(10);

  // User counts by role
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalKisans = await User.countDocuments({ role: 'kisan' });
  const totalShopkeepers = await User.countDocuments({ role: 'shopkeeper' });
  const totalDistributors = await User.countDocuments({ role: 'distributor' });
  const totalBlockedUsers = await User.countDocuments({ isBlocked: true });

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

  res.json({
    totalOrders,
    deliveredOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    pendingApprovals,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    totalCustomers,
    totalKisans,
    totalShopkeepers,
    totalDistributors,
    totalBlockedUsers,
    recentOrders,
  });
}));

// ==========================================
// 2. USER, STAFF & PARTNER MANAGEMENT
// ==========================================

// GET /api/admin/users - Query all users with search, role, and blocked status
router.get('/users', asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  const filter = {};

  if (role && role !== 'all') {
    filter.role = role;
  }
  if (status === 'blocked') {
    filter.isBlocked = true;
  } else if (status === 'active') {
    filter.isBlocked = false;
  }

  let query = User.find(filter).select('-password').sort({ createdAt: -1 });

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query = query.or([
      { name: searchRegex },
      { email: searchRegex },
      { 'partnerProfile.businessName': searchRegex },
      { 'partnerProfile.villageOrArea': searchRegex },
    ]);
  }

  const users = await query.limit(100);
  res.json(users);
}));

// POST /api/admin/users - Admin directly creates a new admin, manager, farmer, or user
router.post('/users', asyncHandler(async (req, res) => {
  const { name, email, password, role, partnerProfile } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role: role || 'customer',
    isAdmin: role === 'admin',
    partnerProfile: partnerProfile || {},
  });

  const responseUser = newUser.toObject();
  delete responseUser.password;
  res.status(201).json(responseUser);
}));

// PUT /api/admin/users/:id/block - Block or unblock a user/partner
router.put('/users/:id/block', asyncHandler(async (req, res) => {
  const { isBlocked, reason } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot block your own super admin account' });
  }

  user.isBlocked = !!isBlocked;
  user.blockedReason = isBlocked ? (reason || 'Account suspended by administrator') : '';
  await user.save();

  res.json({
    success: true,
    message: isBlocked ? 'User has been blocked successfully' : 'User unblocked successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      blockedReason: user.blockedReason,
    },
  });
}));

// PUT /api/admin/users/:id/role - Update user role / permissions
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ['customer', 'admin', 'kisan', 'shopkeeper', 'distributor', 'helper'];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.role = role;
  user.isAdmin = role === 'admin';
  await user.save();

  res.json({ success: true, message: `Role updated to ${role}`, user });
}));

// PUT /api/admin/users/:id/verify - Approve/verify partner (kisan, shop, distributor)
router.put('/users/:id/verify', asyncHandler(async (req, res) => {
  const { isVerified } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.partnerProfile = user.partnerProfile || {};
  user.partnerProfile.isVerified = !!isVerified;
  await user.save();

  res.json({ success: true, message: 'Partner verification status updated', user });
}));

// DELETE /api/admin/users/:id - Permanently remove a user
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot delete your own active admin account' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User removed permanently from database' });
}));

// ==========================================
// 3. PRODUCT APPROVAL WORKFLOW (KISAN & DISTRIBUTOR)
// ==========================================

// GET /api/admin/approvals - Products pending admin review
router.get('/approvals', asyncHandler(async (req, res) => {
  const pending = await Product.find({ approvalStatus: 'pending' })
    .populate('addedBy.userId', 'name email role partnerProfile')
    .sort({ createdAt: -1 });

  res.json(pending);
}));

// PUT /api/admin/approvals/:id - Approve and set retail selling price or Reject with reason
router.put('/approvals/:id', asyncHandler(async (req, res) => {
  const { action, customerPrice, mrp, rejectionReason } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (action === 'approve') {
    product.approvalStatus = 'approved';
    if (customerPrice !== undefined && Number(customerPrice) > 0) {
      product.price = Number(customerPrice);
    }
    if (mrp !== undefined && Number(mrp) > 0) {
      product.mrp = Number(mrp);
    }
    product.rejectionReason = '';
    await product.save();

    return res.json({
      success: true,
      message: 'Product approved and published to live store catalog',
      product,
    });
  } else if (action === 'reject') {
    product.approvalStatus = 'rejected';
    product.rejectionReason = rejectionReason || 'Does not meet store quality guidelines';
    await product.save();

    return res.json({
      success: true,
      message: 'Product rejected with provided reason',
      product,
    });
  }

  res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
}));

// ==========================================
// 4. GENERAL PRODUCT CATALOG MANAGEMENT
// ==========================================

// POST /api/admin/products - Add a new product directly
router.post('/products', asyncHandler(async (req, res) => {
  const { name, category, price, mrp, stock, unit, image, description } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: 'Product name, category, and price are required' });
  }

  const product = await Product.create({
    name,
    category,
    price: Number(price),
    mrp: mrp ? Number(mrp) : Number(price) * 1.15,
    stock: stock ? Number(stock) : 100,
    unit: unit || '1 pack',
    image: image || '',
    description: description || '',
    approvalStatus: 'approved',
    addedBy: {
      userId: req.user._id,
      role: 'admin',
      name: req.user.name,
    },
  });

  res.status(201).json(product);
}));

// PUT /api/admin/products/:id - Update product details
router.put('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, product });
}));

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
}));

// ==========================================
// 5. ORDERS & STATUS DISPATCH
// ==========================================

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

module.exports = router;
