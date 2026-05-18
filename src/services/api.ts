import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // Handle ApiResponse wrapper: { code, result, message } or { success, data, message }
    if (res && typeof res === "object") {
      if ("result" in res && "code" in res) {
        return res.result;
      }
      if ("data" in res && "success" in res) {
        return res.data;
      }
    }
    return res;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle unauthorized (401)
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Only redirect if not already on the login page or landing page to avoid infinite reload/loop
        if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
          window.location.href = "/login";
        }
      }

      // Return structured error message if available
      const data = error.response.data as any;
      const message = typeof data === 'string' ? data : (data?.message || data?.error || "Something went wrong");
      const err = new Error(message) as any;
      err.response = error.response;
      return Promise.reject(err);
    }
    return Promise.reject(error);
  },
);

export default api;
