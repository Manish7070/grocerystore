import axios from 'axios';

const backendOrigin = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : `${backendOrigin}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
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
  getOrders: () => api.get('/orders'),
};

export default api;
