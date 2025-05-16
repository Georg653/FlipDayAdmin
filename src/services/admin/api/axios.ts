// src/services/admin/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

export default axiosInstance;