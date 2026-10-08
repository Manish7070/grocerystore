const crypto = require('node:crypto');

function matchesCapturedPayment(order, payment) {
  return payment?.status === 'captured'
    && typeof payment.id === 'string'
    && payment.order_id === order.razorpayOrderId
    && payment.currency === 'INR'
    && Number(payment.amount) === Math.round(order.totalAmount * 100);
}

function verifyWebhook(body, signature, secret) {
  if (!Buffer.isBuffer(body) || !secret || typeof signature !== 'string' || !/^[a-f\d]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac('sha256', secret).update(body).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

module.exports = { matchesCapturedPayment, verifyWebhook };
