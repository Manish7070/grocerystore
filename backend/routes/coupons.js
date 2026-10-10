const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const asyncHandler = require('../middleware/asyncHandler');

// Seed default real coupons if none exist
const ensureDefaultCoupons = async () => {
  const count = await Coupon.countDocuments();
  if (count === 0) {
    const defaultCoupons = [
      {
        code: 'TAAZA20',
        description: 'Flat 20% OFF on fresh fruits, vegetables & dairy',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 299,
        maxDiscount: 150,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'WELCOME50',
        description: 'Flat ₹50 OFF on your first grocery basket',
        discountType: 'flat',
        discountValue: 50,
        minOrderValue: 199,
        maxDiscount: 50,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'SAVER100',
        description: 'Save ₹100 on bulk grocery shopping above ₹999',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 999,
        maxDiscount: 100,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    ];
    await Coupon.insertMany(defaultCoupons);
  }
};

router.get('/', asyncHandler(async (req, res) => {
  await ensureDefaultCoupons();
  const coupons = await Coupon.find({ isActive: true });
  res.json(coupons);
}));

router.post('/apply', asyncHandler(async (req, res) => {
  await ensureDefaultCoupons();
  const { code, subtotal } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Enter a valid coupon code' });
  }

  const cleanCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
  if (!coupon) {
    return res.status(404).json({ message: 'Invalid or expired coupon code' });
  }

  if (coupon.expiryDate < new Date()) {
    return res.status(400).json({ message: 'This coupon has expired' });
  }

  const amount = Number(subtotal) || 0;
  if (amount < coupon.minOrderValue) {
    return res.status(400).json({
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`,
    });
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.min((amount * coupon.discountValue) / 100, coupon.maxDiscount);
  } else {
    discount = Math.min(coupon.discountValue, amount);
  }
  discount = Math.round(discount);

  res.json({
    success: true,
    code: coupon.code,
    description: coupon.description,
    discount,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount}.`,
  });
}));

module.exports = router;
