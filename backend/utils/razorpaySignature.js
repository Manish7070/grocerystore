const crypto = require('crypto');

const createRazorpaySignature = (orderId, paymentId, secret) => crypto
  .createHmac('sha256', secret)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = createRazorpaySignature(orderId, paymentId, secret);
  const received = String(signature);
  return expected.length === received.length
    && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
};

module.exports = { createRazorpaySignature, verifyRazorpaySignature };
