import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getOne: (slug) => api.get(`/courses/${slug}`),
};

export const blogsAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slug) => api.get(`/blogs/${slug}`),
};

export default api;
