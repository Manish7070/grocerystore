const jwt = require('jsonwebtoken');
const User = require('../models/User');
const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return process.env.JWT_SECRET;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), { expiresIn: '30d', algorithm: 'HS256' });
};

const protect = async (req, res, next) => {
  const token = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).json({ code: 'AUTH_REQUIRED', message: 'Please sign in to continue.' });
  if (!process.env.JWT_SECRET) return res.status(503).json({ message: 'Sign-in is temporarily unavailable.' });
  let decoded;
  try {
    decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    if (typeof decoded.id !== 'string' || !/^[a-f\d]{24}$/i.test(decoded.id)) throw new Error('Invalid subject');
  } catch {
    return res.status(401).json({ code: 'SESSION_EXPIRED', message: 'Your session has expired. Please sign in again.' });
  }
  try {
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ code: 'SESSION_EXPIRED', message: 'Please sign in again.' });
    return next();
  } catch (error) {
    // A database outage is not an invalid login; do not log customers out.
    return next(error);
  }
};

module.exports = { protect, generateToken };
