const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  blockedReason: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'kisan', 'shopkeeper', 'distributor', 'helper'],
    default: 'customer',
  },
  partnerProfile: {
    businessName: { type: String, default: '' },
    villageOrArea: { type: String, default: '' },
    upiId: { type: String, default: '' },
    walletBalance: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    todayPriceUpdated: { type: Boolean, default: false },
    lastPriceUpdateAt: { type: Date },
    rating: { type: Number, default: 5 },
    ratingCount: { type: Number, default: 0 },
    dailySalesTotal: { type: Number, default: 0 },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  phone: {
    type: String,
    default: '',
  },
  addresses: [{
    label: { type: String, default: 'Home' },
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
  }],
  wishlist: [{
    type: String,
  }],
  savedLists: [{
    name: String,
    items: [{
      productId: String,
      name: String,
      quantity: Number,
    }],
  }],
  deliveryProfile: {
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    preferredSlot: {
      type: String,
      default: 'Morning delivery · 8 AM to 11 AM',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
