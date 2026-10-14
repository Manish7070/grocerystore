const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, protect } = require('../middleware/auth');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const router = express.Router();

const textValue = (value) => typeof value === 'string' ? value.trim() : '';
const validEmail = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const formatUser = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || 'customer',
  isAdmin: user.isAdmin || user.role === 'admin',
  isBlocked: !!user.isBlocked,
  blockedReason: user.blockedReason || '',
  partnerProfile: user.partnerProfile || {},
  deliveryProfile: user.deliveryProfile,
  ...(token ? { token } : {}),
});

router.post('/signup', async (req, res) => {
  try {
    const name = textValue(req.body.name);
    const email = textValue(req.body.email).toLowerCase();
    const password = req.body.password;
    const requestedRole = textValue(req.body.role);
    const partnerData = req.body.partnerProfile || {};

    if (!name || !email || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (name.length > 100 || !validEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid name and email address' });
    }
    if (Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Password is too long (maximum 72 bytes)' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Role safety: Normal signups cannot assign 'admin' role directly
    let role = 'customer';
    if (['kisan', 'shopkeeper', 'distributor', 'helper'].includes(requestedRole)) {
      role = requestedRole;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone: textValue(req.body.phone || partnerData.phone),
      password: hashedPassword,
      role,
      partnerProfile: {
        businessName: textValue(partnerData.businessName || name),
        villageOrArea: textValue(partnerData.villageOrArea || partnerData.serviceArea),
        serviceType: textValue(partnerData.serviceType),
        serviceArea: textValue(partnerData.serviceArea || partnerData.villageOrArea),
        storeType: textValue(partnerData.storeType),
        fleetCount: Number(partnerData.fleetCount) || 1,
        helperCode: textValue(partnerData.helperCode),
        upiId: textValue(partnerData.upiId),
        walletBalance: 0,
        isVerified: false, // Admin can verify partners
        todayPriceUpdated: false,
      },
    });

    return res.status(201).json(formatUser(user, generateToken(user._id)));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Unable to create account' });
  }
});

// Create Store Helper Staff ID (Admin or Store Manager / Partner)
router.post('/create-helper', protect, async (req, res) => {
  try {
    const { name, phone, email, password, helperCode, storeLocation } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Helper name, email and password are required' });
    }

    const emailClean = textValue(email).toLowerCase();
    const existing = await User.findOne({ email: emailClean });
    if (existing) {
      return res.status(400).json({ message: 'A helper with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const helper = await User.create({
      name: textValue(name),
      email: emailClean,
      phone: textValue(phone),
      password: hashedPassword,
      role: 'helper',
      partnerProfile: {
        businessName: `Store Helper (${textValue(name)})`,
        villageOrArea: textValue(storeLocation || 'Main Store Branch'),
        helperCode: textValue(helperCode || `HLP-${Math.floor(1000 + Math.random() * 9000)}`),
        isVerified: true,
      },
    });

    return res.status(201).json({
      message: 'Store helper ID created successfully',
      helper: formatUser(helper),
    });
  } catch (err) {
    console.error('Create helper error:', err);
    return res.status(500).json({ message: 'Failed to create helper ID' });
  }
});

// List Store Helpers for store manager / admin
router.get('/helpers', protect, async (req, res) => {
  try {
    const helpers = await User.find({ role: 'helper' }).select('-password').sort({ createdAt: -1 });
    return res.json(helpers.map((h) => formatUser(h)));
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch store helpers' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const email = textValue(req.body.email).toLowerCase();
    const password = req.body.password;

    if (!validEmail(email) || typeof password !== 'string' || !password || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.isBlocked) {
        return res.status(403).json({
          code: 'ACCOUNT_BLOCKED',
          message: user.blockedReason || 'Your account has been suspended by administration. Please contact support.',
        });
      }
      return res.json(formatUser(user, generateToken(user._id)));
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Unable to sign in' });
  }
});

router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const name = req.body.name === undefined ? req.user.name : textValue(req.body.name);
  const email = req.body.email === undefined ? req.user.email : textValue(req.body.email).toLowerCase();
  if (!name || name.length > 100 || !validEmail(email)) {
    return res.status(400).json({ message: 'Enter a valid name and email address' });
  }
  let deliveryProfile;
  if (req.body.deliveryProfile !== undefined) {
    if (!req.body.deliveryProfile || typeof req.body.deliveryProfile !== 'object' || Array.isArray(req.body.deliveryProfile)) {
      return res.status(400).json({ message: 'Invalid delivery profile' });
    }
    deliveryProfile = {};
    for (const [field, limit] of Object.entries({ address: 500, city: 100, pincode: 6, preferredSlot: 100 })) {
      const value = req.body.deliveryProfile[field];
      if (value === undefined) continue;
      if (typeof value !== 'string' || value.trim().length > limit) {
        return res.status(400).json({ message: `Invalid delivery ${field}` });
      }
      deliveryProfile[field] = value.trim();
    }
    if (deliveryProfile.pincode && !/^[1-9]\d{5}$/.test(deliveryProfile.pincode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit pincode' });
    }
  }
  const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });

  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.name = name || user.name;
  user.email = email || user.email;
  if (deliveryProfile) {
    user.deliveryProfile = {
      ...(user.deliveryProfile?.toObject?.() || user.deliveryProfile),
      ...deliveryProfile,
    };
  }
  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    throw error;
  }

  res.json(formatUser(user));
}));

module.exports = router;
