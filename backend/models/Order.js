const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderNumber: {
    type: String,
    index: true,
  },
  items: [{
    productId: {
      type: String,
    },
    name: String,
    externalId: String,
    category: String,
    unit: String,
    price: Number,
    mrp: Number,
    quantity: Number,
    image: String,
  }],
  subtotal: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: '',
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  totalSavings: {
    type: Number,
    default: 0,
  },
  deliveryAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String,
  },
  deliverySlot: {
    type: String,
    default: 'Express Delivery (30-45 mins)',
  },
  deliveryOtp: {
    type: String,
    default: '',
  },
  deliveryPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    default: 'razorpay',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paidAt: Date,
  deliveryStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  statusTimeline: [{
    status: String,
    title: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  cancellationReason: {
    type: String,
    default: '',
  },
}, { timestamps: true });
module.exports = mongoose.model('Order', orderSchema);
