// src/api/client.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return config;

  // headers가 없으면 AxiosHeaders 인스턴스로 초기화
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // 여기서 타입을 AxiosHeaders로 보고 set 사용
  (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);

  return config;
});
