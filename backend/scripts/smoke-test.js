const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Order = require('../models/Order');

const apiBase = process.env.SMOKE_API_URL || 'http://127.0.0.1:5000/api';
const testEmail = `greenbasket-smoke-${Date.now()}@example.com`;
const testPassword = 'GreenBasketTest123!';
let testUserId;
let razorpayOrderCreated = false;

const request = async (pathname, options = {}) => {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${pathname} failed (${response.status}): ${body.message || 'Unknown error'}`);
  }

  return body;
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const cleanup = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket';
  await mongoose.connect(mongoUri);
  const user = testUserId
    ? await User.findById(testUserId)
    : await User.findOne({ email: testEmail });

  if (user) {
    await Order.deleteMany({ userId: user._id });
    await User.deleteOne({ _id: user._id });
  }
  await mongoose.disconnect();
};

const run = async () => {
  try {
    const [products, categories, paymentConfig] = await Promise.all([
      request('/products'),
      request('/products/categories'),
      request('/orders/config'),
    ]);

    assert(Array.isArray(products) && products.length > 0, 'Product catalog is empty');
    assert(Array.isArray(categories) && categories.length === 16, 'Expected all 16 product categories');
    assert(products.length === 240, 'Expected the complete 240-product catalog');
    assert(products.every((product) => product.brand === 'GreenBasket'), 'Catalog contains non-GreenBasket branding');
    assert(products.every((product) => product.source === 'greenbasket-original'), 'Catalog contains a non-original source');
    assert(products.every((product) => !/^https?:\/\//.test(product.image || '')), 'Catalog contains external image URLs');
    assert(typeof paymentConfig.configured === 'boolean', 'Payment configuration response is invalid');

    const signup = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name: 'GreenBasket Smoke Test', email: testEmail, password: testPassword }),
    });
    testUserId = signup._id;
    assert(signup.token, 'Signup did not return an authentication token');

    const signin = await request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    assert(signin.token, 'Signin did not return an authentication token');

    const authHeaders = { Authorization: `Bearer ${signin.token}` };
    const profile = await request('/auth/profile', { headers: authHeaders });
    assert(profile.email === testEmail, 'Authenticated profile does not match the signed-in user');

    if (process.env.SMOKE_RAZORPAY === '1') {
      assert(paymentConfig.configured, 'Razorpay smoke test requested but payment is not configured');
      const razorpayResult = await request('/orders', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ items: [{ productId: products[0]._id, quantity: 1 }] }),
      });
      assert(/^order_/.test(razorpayResult.id || ''), 'Razorpay did not return a valid test order id');
      assert(/^rzp_test_/.test(razorpayResult.keyId || ''), 'Refusing to validate a non-test Razorpay key');
      assert(Number(razorpayResult.amount) >= 100, 'Razorpay returned an invalid order amount');
      razorpayOrderCreated = true;
    }

    const codResult = await request('/orders/cod', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ items: [{ productId: products[0]._id, quantity: 1 }] }),
    });
    assert(codResult.success && codResult.order?.paymentMethod === 'cod', 'COD order was not created correctly');
    assert(codResult.order?.items?.[0]?.image, 'Order item image was not saved');
    assert(codResult.order?.items?.[0]?.category, 'Order item category artwork metadata was not saved');

    const orderHistory = await request('/orders', { headers: authHeaders });
    assert(orderHistory.some((order) => order._id === codResult.order._id), 'Created order is missing from order history');

    console.log(JSON.stringify({
      passed: true,
      products: products.length,
      categories: categories.length,
      signup: true,
      signin: true,
      profile: true,
      cod: true,
      orderHistory: true,
      orderImages: true,
      greenBasketCatalog: true,
      razorpayConfigured: paymentConfig.configured,
      razorpayTestOrder: razorpayOrderCreated,
    }, null, 2));
  } finally {
    await cleanup();
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
