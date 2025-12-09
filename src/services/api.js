import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getOne: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  toggleStatus: (id) => api.put(`/restaurants/${id}/toggle-status`)
};

export const foodAPI = {
  getAll: (params) => api.get('/food', { params }),
  getOne: (id) => api.get(`/food/${id}`),
  getMenu: (restaurantId) => api.get(`/food/menu/${restaurantId}`),
  create: (data) => api.post('/food', data),
  update: (id, data) => api.put(`/food/${id}`, data),
  delete: (id) => api.delete(`/food/${id}`),
  toggleAvailability: (id) => api.put(`/food/${id}/toggle-availability`)
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getStats: () => api.get('/orders/stats')
};

export const couponAPI = {
  getActive: () => api.get('/coupons/active'),
  validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`)
};

export const reviewAPI = {
  getAll: (params) => api.get('/reviews', { params }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`)
};

export default api;
