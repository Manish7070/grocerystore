require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const dns = require('node:dns')

dns.setServers(["8.8.8.8" , "8.8.4.4"])

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenbasket';

const defaultOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://grocery-store-kappa-seven.vercel.app',
];

const allowedOrigins = (process.env.CORS_ORIGIN || defaultOrigins.join(','))
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

let mongoConnectionPromise;

const connectDatabase = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!mongoConnectionPromise || mongoose.connection.readyState === 0) {
    mongoConnectionPromise = mongoose.connect(MONGO_URI).then((connection) => {
      mongoConnectionPromise = null;
      return connection;
    }).catch((error) => {
      mongoConnectionPromise = null;
      throw error;
    });
  }

  return mongoConnectionPromise;
};

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    res.status(503).json({ message: 'Database is temporarily unavailable' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    paymentsConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  console.error('Unhandled API error:', error);
  res.status(error.message === 'Not allowed by CORS' ? 403 : 500).json({
    message: error.message === 'Not allowed by CORS' ? 'Origin is not allowed' : 'Unexpected server error',
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exitCode = 1;
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
