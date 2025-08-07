import axios from 'axios';
import type { AxiosInstance } from 'axios';
import authService from "@/api/auth.service.ts";

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/', // Sửa tại đây
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Khi accessToken hết hạn → tự gọi refresh + retry lại request
http.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

     if (originalRequest.url.includes('/auth/refresh') && err.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(err);
    }
    // Nếu lỗi 401 và chưa từng retry → gọi refresh
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      authService.getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refresh();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return http(originalRequest); // 🔁 Gửi lại request
      } catch (refreshErr) {
        // Nếu refresh lỗi luôn → logout
        authService.logout();
        window.location.href = '/login'; // hoặc router.push()
      }
    }

    return Promise.reject(err);
  }
);
export default http;
