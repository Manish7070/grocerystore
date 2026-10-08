import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import api from '../src/utils/api.js';

let events;
beforeEach(() => {
  const values = new Map([['token', 'old-token'], ['user', '{"name":"Customer"}']]);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  } });
  globalThis.window = new EventTarget();
  events = 0;
  window.addEventListener('greenbasket:session-expired', () => { events++; });
});

const fail = (status, onRequest = () => {}) => async config => {
  assert.equal(config.headers.Authorization, 'Bearer old-token');
  onRequest();
  throw { config, response: { status, data: { message: 'Test response' } } };
};

test('401 clears stale account once and requests sign-in without replaying the order', async () => {
  let attempts = 0;
  await assert.rejects(api.post('/orders/cod', {}, { adapter: fail(401, () => attempts++) }));
  assert.equal(localStorage.getItem('token'), null);
  assert.equal(localStorage.getItem('user'), null);
  assert.equal(events, 1);
  assert.equal(attempts, 1);
});

test('late 401 from an old session does not sign out a freshly logged-in user', async () => {
  await assert.rejects(api.get('/auth/profile', { adapter: fail(401, () => localStorage.setItem('token', 'new-token')) }));
  assert.equal(localStorage.getItem('token'), 'new-token');
  assert.equal(events, 0);
});

test('wrong sign-in credentials and service outages do not trigger session redirects', async () => {
  await assert.rejects(api.post('/auth/signin', {}, { adapter: fail(401) }));
  await assert.rejects(api.get('/auth/profile', { adapter: fail(503) }));
  assert.equal(localStorage.getItem('token'), 'old-token');
  assert.equal(events, 0);
});
