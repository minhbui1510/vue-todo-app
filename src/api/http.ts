// src/services/http.ts
import axios, {type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig,} from 'axios';
import authService from "@/api/auth.service.ts";
import {useCenterModal} from "@/composables/useCenterModal.ts";

// --- Augment axios config để đánh dấu đã retry ---
declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
    _retryCount?: number;
  }
}
const modal = useCenterModal();

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  timeout: 15_000,
  headers: {'Content-Type': 'application/json'},
  // withCredentials: true, // nếu dùng cookie httpOnly
});

// ============ Request interceptor: gắn Bearer ============
http.interceptors.request.use((config) => {
  const token = authService.getAccessToken?.();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ Refresh lock + queue tránh gọi trùng ============
let isRefreshing = false;
let queuedResolvers: Array<(token: string | null) => void> = [];

function queueAwaitRefresh() {
  return new Promise<string | null>((resolve) => queuedResolvers.push(resolve));
}

function resolveQueue(token: string | null) {
  queuedResolvers.forEach((r) => r(token));
  queuedResolvers = [];
}

// ============ Chuẩn hoá lỗi ============
export type AppHttpError = {
  code: string;
  message: string;
  status?: number;
  detail?: string;
};

export async function normalizeError(err: unknown): AppHttpError {
  const ax = err as AxiosError<any>;

  if (ax?.isAxiosError) {
    const status = ax.response?.status;
    const serverMsg =
      ax.response?.data?.message ||
      ax.response?.data?.error ||
      ax.response?.data?.msg;

    await modal.alert({
      title: 'Có lỗi xảy ra',
      message: ax.response?.data?.message,
      variant: 'danger'
    });
    return {
      code: (ax.code || String(status || 'ERR')).toUpperCase(),
      status,
      message:
        serverMsg ||
        (status === 0
          ? 'Không thể kết nối máy chủ'
          : status
            ? `Lỗi ${status}`
            : 'Đã xảy ra lỗi không xác định'),
      detail: ax.message,
    };
  }
  return {code: 'UNKNOWN', message: 'Đã xảy ra lỗi không xác định'};
}

// ============ Response interceptor ============
http.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as InternalAxiosRequestConfig | undefined;
    const status = err.response?.status;

    // Nếu refresh endpoint trả 401 → logout thẳng
    if (original?.url?.includes('/auth/refresh') && status === 401) {
      authService.logout?.();
      window.location.href = '/login';
      return Promise.reject(err);
    }

    // 401: thử refresh 1 lần
    if (
      status === 401 &&
      original &&
      !original._retry &&
      authService.getRefreshToken?.()
    ) {
      original._retry = true;

      try {
        // Nếu đang refresh → đợi token mới
        if (isRefreshing) {
          const newToken = await queueAwaitRefresh();
          if (!newToken) throw err; // refresh thất bại
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          return http(original);
        }

        // Bắt đầu refresh
        isRefreshing = true;
        const newToken = await authService.refresh(); // <- trả token string
        // Lưu token mới
        authService.setAccessToken?.(newToken);

        // Cập nhật header mặc định + request gốc
        http.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;

        // Đánh thức hàng đợi
        resolveQueue(newToken);
        return http(original);
      } catch (e) {
        // Refresh thất bại → huỷ queue + logout
        resolveQueue(null);
        authService.logout?.();
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // 429/503: retry backoff nhẹ (tối đa 2 lần)
    if (original && (status === 429 || status === 503)) {
      original._retryCount = (original._retryCount ?? 0) + 1;
      if (original._retryCount <= 2) {
        const wait = 500 * Math.pow(2, original._retryCount - 1); // 500ms, 1000ms
        await new Promise((r) => setTimeout(r, wait));
        return http(original);
      }
    }

    // Trả lỗi nguyên bản (để chỗ gọi có thể normalize)
    return Promise.reject(err);
  }
);

export default http;

/* =========================
   CÁCH DÙNG (ví dụ):
   =========================
   import http, { normalizeError } from '@/services/http';

   async function fetchNotes(page = 1, signal?: AbortSignal) {
     try {
       const res = await http.get('/notes', { params: { page, limit: 10 }, signal });
       return res.data;
     } catch (e) {
       throw normalizeError(e);
     }
   }

   // Cancel:
   const ctrl = new AbortController();
   fetchNotes(1, ctrl.signal);
   // ctrl.abort();
*/
