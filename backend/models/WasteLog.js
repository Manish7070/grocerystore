const mongoose = require('mongoose');

const wasteLogSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryBatch',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    enum: ['expired', 'damaged', 'quality_fail', 'spoilage'],
    default: 'expired',
  },
  financialLoss: {
    type: Number,
    required: true,
  },
  loggedBy: {
    type: String,
    default: 'Store Inventory Manager',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('WasteLog', wasteLogSchema);
