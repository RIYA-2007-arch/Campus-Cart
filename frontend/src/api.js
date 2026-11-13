import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const api = axios.create({ baseURL: API_URL, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("cc_token")) {
      localStorage.removeItem("cc_token");
      localStorage.removeItem("cc_user");
      window.dispatchEvent(new Event("cc-auth-expired"));
    }
    return Promise.reject(error);
  }
);

export default api;