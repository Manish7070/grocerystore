const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

auth.protect = (req, res, next) => { req.user = { _id: 'test-user', name: 'Asha', email: 'asha@example.com' }; next(); };
Product.findById = async () => { throw new Error('Database failed'); };
Product.countDocuments = async () => { throw new Error('Database failed'); };
User.findOne = async () => { throw new Error('Database failed'); };
const app = express();
app.use(express.json());
app.use('/products', require('../routes/products'));
app.use('/auth', require('../routes/auth'));
app.use((error, req, res, next) => { res.status(503).json({ message: 'Service unavailable' }); });
let server;
let base;
before(async () => {
  server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));
const request = (path, body, method = 'POST') => fetch(`${base}${path}`, {
  method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('invalid product URLs return 404 without touching MongoDB', async () => {
  assert.equal((await fetch(`${base}/products/not-an-id`)).status, 404);
});
test('product database errors reach the error handler and the API remains alive', async () => {
  for (const path of ['/products/abcdef123456abcdef123456', '/products', '/products/fruits']) {
    assert.equal((await fetch(`${base}${path}`)).status, 503);
  }
  assert.equal((await fetch(`${base}/products/categories`)).status, 200);
});
test('catalog refresh requires the admin key', async () => {
  assert.equal((await request('/products/refresh', {})).status, 403);
});
test('malformed account fields return 400 rather than reaching the database', async () => {
  for (const body of [
    { name: {}, email: 'asha@example.com', password: 'abcdef' },
    { name: 'Asha', email: { $ne: null }, password: 'abcdef' },
    { name: 'Asha', email: 'invalid', password: 'abcdef' },
    { name: 'Asha', email: 'asha@example.com', password: 'x'.repeat(73) },
  ]) {
    assert.equal((await request('/auth/signup', body)).status, 400);
  }
  assert.equal((await request('/auth/signin', { email: [], password: {} })).status, 400);
});
test('profile rejects malformed updates and forwards database errors', async () => {
  assert.equal((await request('/auth/profile', { deliveryProfile: [] }, 'PUT')).status, 400);
  assert.equal((await request('/auth/profile', { deliveryProfile: { pincode: 'xyz' } }, 'PUT')).status, 400);
  assert.equal((await request('/auth/profile', { email: { $ne: null } }, 'PUT')).status, 400);
  assert.equal((await request('/auth/profile', { name: 'Asha', email: 'asha@example.com' }, 'PUT')).status, 503);
});
test('token generation refuses missing JWT configuration', () => {
  const original = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  try { assert.throws(() => auth.generateToken('test-user'), /JWT_SECRET is required/); }
  finally {
    if (original === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = original;
  }
});
