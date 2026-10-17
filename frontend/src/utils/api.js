import axios from 'axios';

const environment = import.meta.env || {};
const backendOrigin = environment.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

const api = axios.create({
  baseURL: environment.DEV ? '/api' : (backendOrigin ? `${backendOrigin}/api` : '/api'),
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
    window.dispatchEvent(new Event('grocerystore:session-expired'));
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
  createHelper: (data) => api.post('/auth/create-helper', data),
  getHelpers: () => api.get('/auth/helpers'),
};

export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getCategories: () => api.get('/products/categories'),
  getByCategory: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  getBundles: () => api.get('/products/bundles'),
  getDeals: () => api.get('/products/deals'),
};

export const ordersAPI = {
  getPaymentConfig: () => api.get('/orders/config'),
  createOrder: (data) => api.post('/orders', data),
  createCodOrder: (data) => api.post('/orders/cod', data),
  createPosOrder: (data) => api.post('/orders/pos-walkin', data),
  verifyPayment: (id, data) => api.post(`/orders/${id}/verify`, data),
  syncPayment: (id) => api.post(`/orders/${id}/sync`),
  getOrders: () => api.get('/orders'),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  submitFeedback: (id, data) => api.post(`/orders/${id}/feedback`, data),
};

export const couponsAPI = {
  getAll: () => api.get('/coupons'),
  apply: (code, subtotal) => api.post('/coupons/apply', { code, subtotal }),
};

export const inventoryAPI = {
  getBatches: (status) => api.get('/inventory/batches', { params: { status } }),
  getRadar: () => api.get('/inventory/radar'),
  applyMarkdown: (batchId, discountPercent) => api.post('/inventory/apply-markdown', { batchId, discountPercent }),
  writeOff: (batchId, quantity, reason, notes) => api.post('/inventory/write-off', { batchId, quantity, reason, notes }),
  getWasteLogs: () => api.get('/inventory/waste-logs'),
};

export const deliveryAPI = {
  getAssigned: () => api.get('/delivery/assigned'),
  getCompleted: () => api.get('/delivery/completed'),
  updateStatus: (id, data) => api.put(`/delivery/${id}/status`, data),
};

export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getCustomers: () => api.get('/admin/customers'),
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  blockUser: (id, data) => api.put(`/admin/users/${id}/block`, data),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  verifyPartner: (id, isVerified) => api.put(`/admin/users/${id}/verify`, { isVerified }),
  getApprovals: () => api.get('/admin/approvals'),
  processApproval: (id, data) => api.put(`/admin/approvals/${id}`, data),
  addProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

export const partnerAPI = {
  getNearby: (params) => api.get('/partners/nearby', { params }),
  getFarmerProduce: () => api.get('/partners/farmer/produce'),
  addFarmerProduce: (data) => api.post('/partners/farmer/produce', data),
  getFarmerOrders: () => api.get('/partners/farmer/orders'),
  getShopkeeperDashboard: () => api.get('/partners/shopkeeper/dashboard'),
  lockShopkeeperPrices: (data) => api.put('/partners/shopkeeper/price-lock', data),
  toggleShopkeeperStock: (data) => api.put('/partners/shopkeeper/stock-toggle', data),
  addShopkeeperProduct: (data) => api.post('/partners/shopkeeper/product', data),
  getShopkeeperOrders: () => api.get('/partners/shopkeeper/orders'),
  dispatchShopkeeperOrder: (id, data) => api.put(`/partners/shopkeeper/orders/${id}/dispatch`, data),
  rechargeShopkeeperWallet: (amount) => api.post('/partners/shopkeeper/wallet/recharge', { amount }),
  getDistributorInventory: () => api.get('/partners/distributor/inventory'),
  addDistributorProduct: (data) => api.post('/partners/distributor/inventory', data),
  deleteDistributorProduct: (id) => api.delete(`/partners/distributor/inventory/${id}`),
};

export default api;
