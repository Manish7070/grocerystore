const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken, protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

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
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
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
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
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

router.put('/profile', protect, async (req, res) => {
  const { name, email, deliveryProfile } = req.body;
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
      ...user.deliveryProfile,
      ...deliveryProfile,
    };
  }
  await user.save();

  res.json(formatUser(user));
});

module.exports = router;
