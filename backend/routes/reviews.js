const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/reviews/:productId
router.get('/:productId', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
}));

// POST /api/reviews/:productId
router.post('/:productId', auth.protect, asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and review comment are required' });
  }

  const review = await Review.create({
    productId: req.params.productId,
    userId: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    title: title || 'Verified Purchase Feedback',
    comment,
    isVerifiedPurchase: true,
  });

  res.status(201).json(review);
}));

module.exports = router;
