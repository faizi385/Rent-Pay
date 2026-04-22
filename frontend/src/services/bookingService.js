import api from './api';

export const bookingService = {
  getAll: async (type = 'sent') => {
    const response = await api.get('/booking-requests', { params: { type } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/booking-requests/${id}`);
    return response.data;
  },

  create: async (bookingData) => {
    const response = await api.post('/booking-requests', bookingData);
    return response.data;
  },

  update: async (id, bookingData) => {
    const response = await api.put(`/booking-requests/${id}`, bookingData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/booking-requests/${id}`);
    return response.data;
  },
};
