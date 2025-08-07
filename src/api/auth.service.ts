// src/api/services/authService.ts
import http from '@/api/http';
import {AuthConstants} from "@/model/constant.enum.ts"; // Đường dẫn tới instance axios có interceptor nếu có

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto extends LoginDto {
  name: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export default {
  async register(data: RegisterDto): Promise<void> {
    const res = await http.post('/auth/register', data);
    console.log('[👤 REGISTER]', res.data);
  },

  async login(data: LoginDto): Promise<LoginResponse> {
    const res = await http.post<LoginResponse>('/auth/login', data);
    const { accessToken, refreshToken } = res.data;

    // Lưu token vào localStorage (hoặc Pinia tùy dự án)
    localStorage.setItem(AuthConstants.AT, accessToken);
    localStorage.setItem(AuthConstants.RT, refreshToken);

    return res.data;
  },

  async getMe(): Promise<MeResponse> {
    const res = await http.get<MeResponse>('/auth/me');
    return res.data;
  },

  async refresh(): Promise<string> {
    const refreshToken = localStorage.getItem(AuthConstants.RT);
    if (!refreshToken) throw new Error('No refresh token found');

    const res = await http.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken
    });

    localStorage.setItem(AuthConstants.AT, res.data.accessToken);
    return res.data.accessToken;
  },

  logout(): void {
    localStorage.removeItem(AuthConstants.AT);
    localStorage.removeItem(AuthConstants.RT);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(AuthConstants.AT);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(AuthConstants.RT);
  }
};
