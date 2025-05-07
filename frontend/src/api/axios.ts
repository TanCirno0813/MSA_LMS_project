import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9898/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};  // ✅ 안전 보장
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
export default api; 