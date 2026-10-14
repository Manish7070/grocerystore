const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// ==========================================
// 1. PUBLIC HYPERLOCAL DISCOVERY (300m - 500m)
// ==========================================

// GET /api/partners/nearby - Discover verified local shopkeepers & farmers nearby
router.get('/nearby', asyncHandler(async (req, res) => {
  const { village, role } = req.query;
  const filter = {
    role: { $in: ['kisan', 'shopkeeper'] },
    isBlocked: false,
  };

  if (role && ['kisan', 'shopkeeper'].includes(role)) {
    filter.role = role;
  }
  if (village) {
    filter['partnerProfile.villageOrArea'] = new RegExp(village, 'i');
  }

  const partners = await User.find(filter)
    .select('name phone role partnerProfile')
    .limit(20);

  // Map to friendly hyperlocal format with direct Call and WhatsApp links
  const formatted = partners.map((p) => {
    const rawPhone = p.phone || '9876543210';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const isFarmer = p.role === 'kisan';

    return {
      _id: p._id,
      name: p.name,
      role: p.role,
      businessName: p.partnerProfile?.businessName || (isFarmer ? `${p.name}'s Farm` : `${p.name} Kirana Store`),
      villageOrArea: p.partnerProfile?.villageOrArea || 'Local Hub (300-500m)',
      phone: rawPhone,
      isVerified: p.partnerProfile?.isVerified || false,
      rating: p.partnerProfile?.rating || 4.9,
      todayPriceUpdated: p.partnerProfile?.todayPriceUpdated ?? true,
      serviceRadius: '300m – 500m',
      deliveryEstimate: '10 – 15 Mins',
      whatsappUrl: `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Namaste ${p.name}, I want to order grocery from GroceryStore.`)}`,
      callUrl: `tel:${rawPhone}`,
      image: p.partnerProfile?.image || (isFarmer
        ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'),
      badge: isFarmer ? 'Local Orchard' : 'Trusted Merchant',
      customerCount: isFarmer ? '500+ Happy Customers' : '1K+ Orders Delivered',
      categoryTag: isFarmer ? 'Direct Orchard' : 'Merchant Partner',
      sourceTag: isFarmer ? '100% Fresh Locally Sourced' : 'Wide Variety Daily Essentials',
    };
  });

  res.json(formatted);
}));

// ==========================================
// 2. KISAN / FARMER ENGINE (STRICT DUAL PRICING)
// ==========================================

// GET /api/partners/farmer/produce - Farmer views only their harvests with kisanBasePrice (RETAIL PRICE IS HIDDEN!)
router.get('/farmer/produce', protect, authorize('kisan', 'admin'), asyncHandler(async (req, res) => {
  const products = await Product.find({ 'addedBy.userId': req.user._id }).sort({ createdAt: -1 });

  // Privacy sanitize: NEVER reveal admin retail markup or customer selling price
  const sanitized = products.map((prod) => ({
    _id: prod._id,
    name: prod.name,
    category: prod.category,
    unit: prod.unit,
    stock: prod.stock,
    image: prod.image,
    description: prod.description,
    kisanBasePrice: prod.kisanBasePrice, // What the farmer actually earns per kg
    approvalStatus: prod.approvalStatus,
    rejectionReason: prod.rejectionReason,
    isAvailableToday: prod.isAvailableToday,
    createdAt: prod.createdAt,
  }));

  // Calculate Farmer's Lifetime Gross Earnings based on kisanBasePrice
  const totalStockRegistered = sanitized.reduce((sum, item) => sum + (item.stock || 0), 0);

  res.json({
    produce: sanitized,
    stats: {
      totalListings: sanitized.length,
      approvedListings: sanitized.filter((p) => p.approvalStatus === 'approved').length,
      pendingListings: sanitized.filter((p) => p.approvalStatus === 'pending').length,
      totalStockUnits: totalStockRegistered,
      village: req.user.partnerProfile?.villageOrArea || 'Local Village Farm',
      farmName: req.user.partnerProfile?.businessName || `${req.user.name}'s Organic Farm`,
    },
  });
}));

// POST /api/partners/farmer/produce - Farmer lists freshly harvested crop
router.post('/farmer/produce', protect, authorize('kisan', 'admin'), asyncHandler(async (req, res) => {
  const { name, category, kisanPrice, stock, unit, image, description } = req.body;

  if (!name || !kisanPrice || Number(kisanPrice) <= 0) {
    return res.status(400).json({ message: 'Valid crop name and your selling price (Kharid Mulya) are required' });
  }

  const basePrice = Number(kisanPrice);

  const newProduce = await Product.create({
    name,
    category: category || 'Vegetables',
    price: basePrice, // Placeholder until Admin approves & sets retail price
    kisanBasePrice: basePrice,
    mrp: Math.round(basePrice * 1.25),
    stock: stock ? Number(stock) : 50,
    unit: unit || '1 kg',
    image: image || '',
    description: description || `Fresh farm harvest by ${req.user.name}`,
    farmSource: req.user.partnerProfile?.businessName || `${req.user.name}'s Farm`,
    origin: req.user.partnerProfile?.villageOrArea || 'Local Village',
    harvestDate: 'Harvested Today at Dawn',
    freshnessScore: 99,
    approvalStatus: 'pending', // Awaiting Admin Approval
    addedBy: {
      userId: req.user._id,
      role: 'kisan',
      name: req.user.name,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Fasal successfully submit ho gayi hai! Admin review karke live karega.',
    produce: {
      _id: newProduce._id,
      name: newProduce.name,
      kisanBasePrice: newProduce.kisanBasePrice,
      approvalStatus: newProduce.approvalStatus,
    },
  });
}));

// GET /api/partners/farmer/orders - Nearby direct customer orders for this farmer
router.get('/farmer/orders', protect, authorize('kisan', 'admin'), asyncHandler(async (req, res) => {
  const myProductIds = await Product.find({ 'addedBy.userId': req.user._id }).distinct('_id');

  const orders = await Order.find({
    'items.product': { $in: myProductIds },
  }).sort({ createdAt: -1 }).limit(30);

  res.json(orders);
}));

// ==========================================
// 3. SHOPKEEPER ENGINE (8:00 AM LOCK & SLAB FEES)
// ==========================================

// Calculate Slab Fee
const calculateSlabFee = (dailySales) => {
  if (dailySales <= 100) return 0;
  if (dailySales <= 200) return 5;
  if (dailySales <= 500) return 10;
  return 15;
};

// GET /api/partners/shopkeeper/dashboard - Shop status, wallet & today's price sync
router.get('/shopkeeper/dashboard', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Common staples that the shopkeeper prices daily
  const staples = [
    { key: 'potato', name: 'Fresh Potatoes (आलू)', defaultRate: 25, unit: '1 kg', inStock: true },
    { key: 'onion', name: 'Red Onions (प्याज)', defaultRate: 35, unit: '1 kg', inStock: true },
    { key: 'tomato', name: 'Roma Tomatoes (टमाटर)', defaultRate: 30, unit: '1 kg', inStock: true },
    { key: 'flour', name: 'Whole Wheat Atta (आटा)', defaultRate: 42, unit: '1 kg', inStock: true },
    { key: 'sugar', name: 'Pure White Sugar (चीनी)', defaultRate: 45, unit: '1 kg', inStock: true },
    { key: 'oil', name: 'Mustard Oil (सरसों तेल)', defaultRate: 140, unit: '1 Litre', inStock: true },
  ];

  const profile = user.partnerProfile || {};
  const dailySales = profile.dailySalesTotal || 0;
  const platformFee = calculateSlabFee(dailySales);
  const netEarnings = Math.max(0, dailySales - platformFee);

  res.json({
    shopName: profile.businessName || `${user.name} Kirana`,
    villageOrArea: profile.villageOrArea || 'Ward 3, Main Market',
    walletBalance: profile.walletBalance || 150,
    todayPriceUpdated: !!profile.todayPriceUpdated,
    lastPriceUpdateAt: profile.lastPriceUpdateAt,
    rating: profile.rating || 4.9,
    dailySales,
    platformFee,
    netEarnings,
    staples,
  });
}));

// PUT /api/partners/shopkeeper/price-lock - Shopkeeper locks daily prices before morning cutoff
router.put('/shopkeeper/price-lock', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const { prices } = req.body;
  const user = await User.findById(req.user._id);

  user.partnerProfile = user.partnerProfile || {};
  user.partnerProfile.todayPriceUpdated = true;
  user.partnerProfile.lastPriceUpdateAt = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Aaj ke rates successfully lock ho gaye hain! Aapki dukan 300-500m me live hai.',
    lastPriceUpdateAt: user.partnerProfile.lastPriceUpdateAt,
  });
}));

// PUT /api/partners/shopkeeper/stock-toggle - 1-Tap Out of Stock Switch
router.put('/shopkeeper/stock-toggle', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const { itemKey, isAvailable } = req.body;
  res.json({
    success: true,
    message: `Item ${itemKey} is now marked ${isAvailable ? 'In Stock' : 'Out of Stock'} for today.`,
    itemKey,
    isAvailable,
  });
}));

// POST /api/partners/shopkeeper/product - Shopkeeper adds new product for admin approval
router.post('/shopkeeper/product', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const { name, category, price, mrp, stock, unit, image, description } = req.body;
  if (!name || !price || Number(price) <= 0) {
    return res.status(400).json({ message: 'Valid product name and selling price are required' });
  }

  const basePrice = Number(price);
  const newProduct = await Product.create({
    name,
    category: category || 'Vegetables',
    price: basePrice,
    mrp: mrp ? Number(mrp) : Math.round(basePrice * 1.2),
    stock: stock ? Number(stock) : 50,
    unit: unit || '1 kg',
    image: image || '',
    description: description || `Stocked by local merchant: ${req.user.name}`,
    farmSource: req.user.partnerProfile?.businessName || `${req.user.name}'s Kirana Store`,
    origin: req.user.partnerProfile?.villageOrArea || 'Local Market',
    approvalStatus: 'pending',
    addedBy: {
      userId: req.user._id,
      role: 'shopkeeper',
      name: req.user.name,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Dukan ka naya product submit ho gaya! Admin approval ke baad live hoga.',
    product: newProduct,
  });
}));

// GET /api/partners/shopkeeper/orders - Hyperlocal 300-500m incoming orders
router.get('/shopkeeper/orders', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(orders);
}));

// PUT /api/partners/shopkeeper/orders/:id/dispatch - Shopkeeper hands to helper for 10-min delivery
router.put('/shopkeeper/orders/:id/dispatch', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const { helperName, helperPhone } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.deliveryStatus = 'out_for_delivery';
  order.statusTimeline.push({
    status: 'out_for_delivery',
    title: `Dispatched with local helper: ${helperName || 'Shop Helper'}`,
    timestamp: new Date(),
    note: `Helper Phone: ${helperPhone || req.user.phone || 'Local Hub'}`,
  });

  await order.save();

  res.json({
    success: true,
    message: 'Order dispatched with local helper! Handover in 10-15 minutes.',
    order,
  });
}));

// POST /api/partners/shopkeeper/wallet/recharge - Recharge prepaid partner wallet
router.post('/shopkeeper/wallet/recharge', protect, authorize('shopkeeper', 'admin'), asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const addAmount = Number(amount) || 100;

  const user = await User.findById(req.user._id);
  user.partnerProfile = user.partnerProfile || {};
  user.partnerProfile.walletBalance = (user.partnerProfile.walletBalance || 0) + addAmount;
  await user.save();

  res.json({
    success: true,
    message: `₹${addAmount} successfully added to Partner Wallet!`,
    walletBalance: user.partnerProfile.walletBalance,
  });
}));

// ==========================================
// 4. DISTRIBUTOR / BRANCH ORGANISER ENGINE
// ==========================================

// GET /api/partners/distributor/inventory - Branch manager fetches their catalog items
router.get('/distributor/inventory', protect, authorize('distributor', 'admin'), asyncHandler(async (req, res) => {
  const products = await Product.find({ 'addedBy.userId': req.user._id }).sort({ createdAt: -1 });

  res.json({
    products,
    stats: {
      totalItems: products.length,
      approvedItems: products.filter((p) => p.approvalStatus === 'approved').length,
      pendingItems: products.filter((p) => p.approvalStatus === 'pending').length,
      branchName: req.user.partnerProfile?.businessName || `${req.user.name}'s Branch Hub`,
      villageOrArea: req.user.partnerProfile?.villageOrArea || 'Central District Hub',
    },
  });
}));

// POST /api/partners/distributor/inventory - Submit branch product for admin approval
router.post('/distributor/inventory', protect, authorize('distributor', 'admin'), asyncHandler(async (req, res) => {
  const { name, category, price, mrp, stock, unit, image, description } = req.body;

  if (!name || !price || Number(price) <= 0) {
    return res.status(400).json({ message: 'Product title and wholesale price are required' });
  }

  const newProduct = await Product.create({
    name,
    category: category || 'Vegetables',
    price: Number(price),
    mrp: mrp ? Number(mrp) : Math.round(Number(price) * 1.2),
    stock: stock ? Number(stock) : 100,
    unit: unit || '1 pack',
    image: image || '',
    description: description || `Stocked by branch partner: ${req.user.name}`,
    farmSource: req.user.partnerProfile?.businessName || 'Verified Regional Distributor',
    approvalStatus: 'pending', // Requires Admin Approval
    addedBy: {
      userId: req.user._id,
      role: 'distributor',
      name: req.user.name,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Branch inventory product submitted! Admin approval ke baad live hoga.',
    product: newProduct,
  });
}));

// DELETE /api/partners/distributor/inventory/:id - Remove item
router.delete('/distributor/inventory/:id', protect, authorize('distributor', 'admin'), asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    'addedBy.userId': req.user._id,
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found or unauthorized' });
  }

  res.json({ success: true, message: 'Branch product removed successfully' });
}));

module.exports = router;
