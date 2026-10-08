const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

const userId = 'abcdef123456abcdef123456';
const originalSecret = process.env.JWT_SECRET;
const originalFind = User.findById;
afterEach(() => {
  User.findById = originalFind;
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

const authenticate = async (authorization) => {
  const result = {};
  const req = { headers: { authorization } };
  const res = { status(code) { result.status = code; return this; }, json(body) { result.body = body; return this; } };
  await protect(req, res, error => { result.next = true; result.error = error; });
  return { ...result, user: req.user };
};

test('missing, malformed, expired and old-secret tokens return actionable 401', async () => {
  process.env.JWT_SECRET = 'isolated-unit-test-secret';
  User.findById = () => { throw new Error('Invalid sessions must not query Mongo'); };
  const expired = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: -1 });
  const old = jwt.sign({ id: userId }, 'previous-test-secret');
  for (const header of [undefined, 'Bearer undefined', 'Bearer broken', `Bearer ${expired}`, `Bearer ${old}`]) {
    const response = await authenticate(header);
    assert.equal(response.status, 401);
    assert.match(response.body.message, /sign in/i);
    assert.equal(response.next, undefined);
  }
});

test('fresh login token authenticates the correct user without a password', async () => {
  process.env.JWT_SECRET = 'isolated-unit-test-secret';
  User.findById = id => {
    assert.equal(id, userId);
    return { select: async fields => { assert.equal(fields, '-password'); return { _id: id }; } };
  };
  const response = await authenticate(`Bearer ${generateToken(userId)}`);
  assert.equal(response.next, true);
  assert.equal(response.error, undefined);
  assert.equal(response.user._id, userId);
});

test('database outages forward the error instead of falsely expiring sessions', async () => {
  process.env.JWT_SECRET = 'isolated-unit-test-secret';
  const dbError = new Error('Mongo unavailable');
  User.findById = () => ({ select: async () => { throw dbError; } });
  const response = await authenticate(`Bearer ${generateToken(userId)}`);
  assert.equal(response.error, dbError);
  assert.equal(response.status, undefined);
});

test('deleted users and invalid JWT subjects cannot place orders', async () => {
  process.env.JWT_SECRET = 'isolated-unit-test-secret';
  User.findById = () => ({ select: async () => null });
  assert.equal((await authenticate(`Bearer ${generateToken(userId)}`)).status, 401);
  assert.equal((await authenticate(`Bearer ${generateToken('invalid-id')}`)).status, 401);
});

test('missing server JWT configuration returns service unavailable', async () => {
  delete process.env.JWT_SECRET;
  assert.equal((await authenticate('Bearer any-token')).status, 503);
});
