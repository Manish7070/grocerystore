import axios from 'axios';

const environment = import.meta.env || {};
const backendOrigin = environment.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

const api = axios.create({
  baseURL: environment.DEV ? '/api' : `${backendOrigin}/api`,
  timeout: 20000,
});

api.interceptors.response.use((response) => response, (error) => {
  const requestToken = error.config?.headers?.Authorization;
  const currentToken = localStorage.getItem('token');
  const isLogin = /\/auth\/(signin|signup)$/.test(error.config?.url || '');
  if (error.response?.status === 401 && !isLogin && currentToken && requestToken === `Bearer ${currentToken}`) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('greenbasket:session-expired'));
  }
  return Promise.reject(error);
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  profile: () => api.get('/auth/profile'),
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getCategories: () => api.get('/products/categories'),
  getByCategory: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
};

export const ordersAPI = {
  getPaymentConfig: () => api.get('/orders/config'),
  createOrder: (data) => api.post('/orders', data),
  createCodOrder: (data) => api.post('/orders/cod', data),
  verifyPayment: (id, data) => api.post(`/orders/${id}/verify`, data),
  syncPayment: (id) => api.post(`/orders/${id}/sync`),
  getOrders: () => api.get('/orders'),
};

export default api;
