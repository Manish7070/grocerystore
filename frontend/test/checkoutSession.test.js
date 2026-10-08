import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readAddressDraft, readPendingPayment, savePendingPayment, cartFingerprint } from '../src/utils/checkoutSession.js';

const memoryStorage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};

test('receipt fingerprint distinguishes a changed basket without depending on item order', () => {
  const cart = [{ _id: 'a', quantity: 2 }, { _id: 'b', quantity: 1 }];
  assert.equal(cartFingerprint(cart), cartFingerprint([...cart].reverse()));
  assert.notEqual(cartFingerprint(cart), cartFingerprint([{ _id: 'a', quantity: 1 }]));
});

test('delivery draft survives re-login and is isolated per account', () => {
  const storage = memoryStorage();
  storage.setItem('checkout-address:alice', JSON.stringify({ name: 'Alice', city: 'Delhi', phone: {} }));
  const draft = readAddressDraft(storage, { _id: 'alice', deliveryProfile: { phone: '9999999999' } });
  assert.equal(draft.city, 'Delhi');
  assert.equal(draft.phone, '9999999999');
  assert.equal(readAddressDraft(storage, { _id: 'bob' }).city, '');
  storage.setItem('checkout-address:alice', 'broken json');
  assert.equal(readAddressDraft(storage, { _id: 'alice', name: 'Alice' }).name, 'Alice');
});

test('payment receipt survives re-login until verified without mixing accounts', () => {
  const storage = memoryStorage();
  const pending = { id: 'order_test', response: { razorpay_order_id: 'order_test', razorpay_payment_id: 'pay_test', razorpay_signature: 'test-signature' } };
  savePendingPayment(storage, 'alice', pending);
  assert.deepEqual(readPendingPayment(storage, 'alice'), pending);
  assert.equal(readPendingPayment(storage, 'bob'), null);
  savePendingPayment(storage, 'alice', null);
  assert.equal(readPendingPayment(storage, 'alice'), null);
  storage.setItem('checkout-payment:alice', JSON.stringify({ id: 'order_wrong', response: pending.response }));
  assert.equal(readPendingPayment(storage, 'alice'), null);
});

test('disabled storage does not crash checkout recovery', () => {
  const storage = { getItem() { throw new Error('Disabled'); }, setItem() { throw new Error('Disabled'); } };
  assert.equal(readPendingPayment(storage, 'alice'), null);
  assert.equal(readAddressDraft(storage, { name: 'Alice' }).name, 'Alice');
  assert.doesNotThrow(() => savePendingPayment(storage, 'alice', {}));
});
