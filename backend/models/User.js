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
  role: {
    type: String,
    enum: ['customer', 'admin', 'inventory_manager', 'delivery'],
    default: 'customer',
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
