import axios from "axios";
import { getToken, removeToken } from "@/lib/auth-storage";

export const http = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== "/auth/login"
    ) {
      removeToken();
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);
