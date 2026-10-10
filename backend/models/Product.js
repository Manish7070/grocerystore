const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  externalId: {
    type: String,
    unique: true,
    sparse: true,
  },
  source: {
    type: String,
    default: 'manual',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: '1 pack',
  },
  brand: {
    type: String,
    default: 'TaazaDaily',
  },
  origin: {
    type: String,
    default: 'India',
  },
  farmSource: {
    type: String,
    default: 'Certified Organic Partner Farms',
  },
  harvestDate: {
    type: String,
    default: 'Harvested within 24h',
  },
  freshnessScore: {
    type: Number,
    default: 98,
  },
  isOrganic: {
    type: Boolean,
    default: false,
  },
  isFresh: {
    type: Boolean,
    default: true,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
  image: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 100,
  },
  lowStockThreshold: {
    type: Number,
    default: 15,
  },
  storageInstructions: {
    type: String,
    default: 'Store in a cool, dry place away from direct sunlight.',
  },
  shelfLife: {
    type: String,
    default: '3-7 days from delivery',
  },
  nutrition: {
    energy: { type: String, default: '' },
    protein: { type: String, default: '' },
    carbs: { type: String, default: '' },
    fat: { type: String, default: '' },
    fiber: { type: String, default: '' },
  },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
