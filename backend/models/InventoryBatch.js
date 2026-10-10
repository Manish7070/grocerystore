const mongoose = require('mongoose');

const inventoryBatchSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  batchNumber: {
    type: String,
    required: true,
    unique: true,
  },
  supplier: {
    type: String,
    default: 'Kisan Cooperative Mandi, Nashik',
  },
  farmOrigin: {
    type: String,
    default: 'Nashik Valley Farms',
  },
  harvestDate: {
    type: Date,
    default: Date.now,
  },
  receivedDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  quantityReceived: {
    type: Number,
    required: true,
  },
  quantityRemaining: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'near_expiry', 'expired', 'written_off'],
    default: 'active',
  },
  markdownDiscount: {
    type: Number,
    default: 0,
  },
  markdownApplied: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('InventoryBatch', inventoryBatchSchema);
