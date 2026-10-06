const test = require('node:test');
const assert = require('node:assert/strict');
const { createRazorpaySignature, verifyRazorpaySignature } = require('../utils/razorpaySignature');

test('accepts a valid Razorpay HMAC signature', () => {
  const input = { orderId: 'order_greenbasket_1', paymentId: 'pay_greenbasket_1', secret: 'test_secret' };
  const signature = createRazorpaySignature(input.orderId, input.paymentId, input.secret);
  assert.equal(verifyRazorpaySignature({ ...input, signature }), true);
});

test('rejects a modified payment id or signature', () => {
  const input = { orderId: 'order_greenbasket_1', paymentId: 'pay_greenbasket_1', secret: 'test_secret' };
  const signature = createRazorpaySignature(input.orderId, input.paymentId, input.secret);
  assert.equal(verifyRazorpaySignature({ ...input, paymentId: 'pay_tampered', signature }), false);
  assert.equal(verifyRazorpaySignature({ ...input, signature: `${signature.slice(0, -1)}0` }), false);
});

test('rejects incomplete verification data', () => {
  assert.equal(verifyRazorpaySignature({}), false);
});
