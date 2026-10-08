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
  isAdmin: user.isAdmin,
  deliveryProfile: user.deliveryProfile,
  ...(token ? { token } : {}),
});

router.post('/signup', async (req, res) => {
  try {
    const name = textValue(req.body.name);
    const email = textValue(req.body.email).toLowerCase();
    const password = req.body.password;

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json(formatUser(user, generateToken(user._id)));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Unable to create account' });
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
