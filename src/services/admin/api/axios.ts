// src/services/admin/api/axios.ts
import axios from 'axios';

// КОММЕНТАРИЙ: Указываем полный URL. 
// Это самый надежный способ, который игнорирует настройки прокси и работает всегда.
const axiosInstance = axios.create({
  baseURL: 'https://api.monobuket-mk.by/api/v1/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Этот код-интерсептор подставляет токен в каждый запрос. Он уже был правильный.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Этот код-интерсептор выкидывает на логин, если токен протух (ошибка 401). Он тоже правильный.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("AXIOS: Unauthorized (401). Перенаправление на логин.");
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
