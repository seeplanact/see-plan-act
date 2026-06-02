import axios from 'axios';

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('spa_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if NOT already on the login page — prevents infinite loop
      if (!window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('spa_admin_token');
        localStorage.removeItem('spa_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(
      new Error(error.response?.data?.message || error.message || 'Request failed')
    );
  }
);

export const adminAuthAPI = {
  login: (data) => adminApi.post('/admin/auth/login', data),
  me:    ()      => adminApi.get('/admin/auth/me'),
  seed:  (data)  => adminApi.post('/admin/auth/seed', data),
};

export const adminBlogsAPI = {
  getAll:         (params) => adminApi.get('/admin/blogs', { params }),
  getOne:         (id)     => adminApi.get(`/admin/blogs/${id}`),
  create:         (data)   => adminApi.post('/admin/blogs', data),
  update:         (id, data) => adminApi.put(`/admin/blogs/${id}`, data),
  togglePublish:  (id)     => adminApi.patch(`/admin/blogs/${id}/publish`),
  delete:         (id)     => adminApi.delete(`/admin/blogs/${id}`),
};

export const adminCoursesAPI = {
  getAll:         (params) => adminApi.get('/admin/courses', { params }),
  getOne:         (id)     => adminApi.get(`/admin/courses/${id}`),
  create:         (data)   => adminApi.post('/admin/courses', data),
  update:         (id, data) => adminApi.put(`/admin/courses/${id}`, data),
  togglePublish:  (id)     => adminApi.patch(`/admin/courses/${id}/publish`),
  delete:         (id)     => adminApi.delete(`/admin/courses/${id}`),
};

export const adminContactsAPI = {
  getAll:   (params) => adminApi.get('/admin/contacts', { params }),
  markRead: (id)     => adminApi.patch(`/admin/contacts/${id}/read`),
};

export default adminApi;