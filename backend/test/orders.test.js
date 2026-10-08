const { test, after, before } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// In-memory stores isolate HTTP behavior from MongoDB and real gateway charges.
const productId = 'abcdef123456abcdef123456';
const records = [];
let gatewayStatus = 'captured';
let gatewayCreates = 0;
let recordSequence = 0;
const deliveryAddress = { name: 'Asha', phone: '9876543210', address: '12 Market Road', city: 'Delhi', pincode: '110001' };
process.env.RAZORPAY_KEY_ID = 'rzp_test_fixture';
process.env.RAZORPAY_KEY_SECRET = 'fixture-secret';
process.env.RAZORPAY_WEBHOOK_SECRET = 'fixture-webhook';
auth.protect = (req, res, next) => {
  if (!req.get('authorization')) return res.sendStatus(401);
  req.user = { _id: req.get('authorization') };
  next();
};
Product.find = async ({ _id }) => _id.$in.includes(productId)
  ? [{ _id: productId, name: 'Rice', category: 'Rice', price: 149.5, stock: 5, image: 'greenbasket-art://rice' }] : [];
Order.create = async (value) => {
  const record = { _id: `local_${++recordSequence}`, paymentStatus: 'pending', ...value, save: async () => {} };
  records.push(record);
  return record;
};
Order.findOne = async (query) => records.find((record) => Object.entries(query).every(([key, value]) => record[key] === value));
Order.findById = async (id) => records.find((record) => record._id === id);
Order.updateOne = async (query, update) => {
  const record = records.find((item) => item._id === query._id);
  if (record && record.paymentStatus !== 'paid') Object.assign(record, update.$set);
};
const paymentFor = (id) => ({ id: 'pay_fixture', order_id: id, amount: 14950, currency: 'INR', status: gatewayStatus });
require('razorpay');
require.cache[require.resolve('razorpay')].exports = class {
  orders = {
    create: async ({ amount }) => ({ id: `order_${++gatewayCreates}`, amount, currency: 'INR' }),
    fetchPayments: async (id) => ({ items: [paymentFor(id)] }),
  };
  payments = { fetch: async () => paymentFor(records.at(-1).razorpayOrderId) };
};
const app = express();
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use('/api/orders', require('../routes/orders'));
let server;
let base;
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  base = `http://127.0.0.1:${server.address().port}/api/orders`;
});
after(() => new Promise((resolve) => server.close(resolve)));
const post = (path, body, user = 'user_a', headers = {}) => fetch(`${base}${path}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: user, ...headers }, body: JSON.stringify(body),
});
const basket = () => ({ deliveryAddress, items: [{ productId, quantity: 1, price: 1 }] });

test('order routes validate before gateway calls and use database prices', async () => {
  let response = await post('/cod', { items: basket().items });
  assert.equal(response.status, 400);
  response = await post('', { ...basket(), items: [{ productId, quantity: 6 }] });
  assert.equal(response.status, 400);
  assert.equal(gatewayCreates, 0);
  response = await post('/cod', basket());
  assert.equal(response.status, 201);
  const data = await response.json();
  assert.equal(data.order.totalAmount, 149.5);
  assert.deepEqual(data.order.deliveryAddress, deliveryAddress);
});

test('authorization alone cannot mark paid; captured confirmation is retryable and cannot be downgraded', async () => {
  const response = await post('', basket());
  const order = await response.json();
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${order.id}|pay_fixture`).digest('hex');
  const confirmation = { razorpayOrderId: order.id, razorpayPaymentId: 'pay_fixture', razorpaySignature: signature };
  assert.equal((await post(`/${order.id}/verify`, confirmation, 'user_b')).status, 404);
  gatewayStatus = 'authorized';
  assert.equal((await post(`/${order.id}/verify`, confirmation)).status, 409);
  assert.equal(records.at(-1).paymentStatus, 'pending');
  gatewayStatus = 'captured';
  assert.equal((await post(`/${order.id}/verify`, confirmation)).status, 200);
  assert.equal(records.at(-1).paymentStatus, 'paid');
  assert.equal((await post(`/${order.id}/verify`, { ...confirmation, razorpayPaymentId: 'pay_attacker' })).status, 409);
  assert.equal(records.at(-1).paymentStatus, 'paid');
});

test('signed captured webhooks are idempotent and status recovery is owner-scoped', async () => {
  const order = await (await post('', basket())).json();
  const event = { event: 'payment.captured', payload: { payment: { entity: paymentFor(order.id) } } };
  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(JSON.stringify(event)).digest('hex');
  assert.equal((await post('/webhook', event, '', { 'x-razorpay-signature': 'bad' })).status, 400);
  assert.equal(records.at(-1).paymentStatus, 'pending');
  for (let attempt = 0; attempt < 2; attempt++) {
    assert.equal((await post('/webhook', event, '', { 'x-razorpay-signature': signature })).status, 200);
  }
  assert.equal(records.at(-1).paymentStatus, 'paid');
  const recoveryOrder = await (await post('', basket())).json();
  assert.equal((await post(`/${recoveryOrder.id}/sync`, {}, 'user_b')).status, 404);
  const recovered = await (await post(`/${recoveryOrder.id}/sync`, {})).json();
  assert.equal(recovered.paymentStatus, 'paid');
});
