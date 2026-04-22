import api from './api';

export const userService = {
  getProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/user', userData);
    return response.data;
  },

  updateProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    const response = await api.post('/user/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
