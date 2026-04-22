import api from './api';

export const listingService = {
  getAll: async (params = {}) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  create: async (listingData) => {
    const response = await api.post('/listings', listingData);
    return response.data;
  },

  update: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  getMyListings: async () => {
    const response = await api.get('/my-listings');
    return response.data;
  },

  uploadImages: async (listingId, images) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images[]', image);
    });

    const response = await api.post(`/listings/${listingId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await api.delete(`/listing-images/${imageId}`);
    return response.data;
  },
};
