const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { validateDelivery, validateItems } = require('../utils/orderValidation');
const { matchesCapturedPayment, verifyWebhook } = require('../utils/paymentStatus');

test('requires delivery contact and a valid pincode', () => {
  const delivery = { name: ' Asha ', phone: '9876543210', address: '12 Market Road', city: 'Delhi', pincode: '110001' };
  assert.equal(validateDelivery(delivery).name, 'Asha');
  for (const invalid of [undefined, {}, { ...delivery, phone: '123' }, { ...delivery, pincode: '000000' }, { ...delivery, address: '' }]) {
    assert.throws(() => validateDelivery(invalid), { statusCode: 400 });
  }
});

test('combines duplicate quantities and rejects malformed carts', () => {
  const productId = 'abcdef123456abcdef123456';
  assert.equal(validateItems([{ productId, quantity: 2 }, { productId: productId.toUpperCase(), quantity: 3 }]).get(productId), 5);
  for (const items of [[], [null], [{ productId: 'bad', quantity: 1 }], [{ productId, quantity: 0 }], [{ productId, quantity: 1.5 }], [{ productId, quantity: '1' }], [{ productId, quantity: 99 }, { productId, quantity: 1 }]]) {
    assert.throws(() => validateItems(items), { statusCode: 400 });
  }
});

test('only an exact captured payment confirms an order', () => {
  const order = { razorpayOrderId: 'order_test', totalAmount: 149.5 };
  const payment = { id: 'pay_test', order_id: 'order_test', amount: 14950, currency: 'INR', status: 'captured' };
  assert.equal(matchesCapturedPayment(order, payment), true);
  for (const change of [{ status: 'authorized' }, { status: 'failed' }, { amount: 1 }, { currency: 'USD' }, { order_id: 'order_other' }]) {
    assert.equal(matchesCapturedPayment(order, { ...payment, ...change }), false);
  }
});

test('webhook signature covers exact raw bytes and rejects tampering', () => {
  const body = Buffer.from('{"event":"payment.captured"}');
  const secret = 'test-webhook-secret';
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  assert.equal(verifyWebhook(body, signature, secret), true);
  assert.equal(verifyWebhook(Buffer.from('{}'), signature, secret), false);
  assert.equal(verifyWebhook(body, signature, 'wrong-secret'), false);
  assert.equal(verifyWebhook(body, 'bad', secret), false);
  assert.equal(verifyWebhook(body, signature, ''), false);
});
