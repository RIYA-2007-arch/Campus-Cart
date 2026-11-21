import axios from "axios";

// Smart API URL resolution:
// 1. Custom env variable if provided (VITE_API_URL)
// 2. If running on public cloud (Vercel, Render, Netlify), automatically use Render backend
// 3. If running locally on development machine, use localhost
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "https://campuscart-backend.onrender.com/api"
    : "http://127.0.0.1:5000/api");

const api = axios.create({ baseURL: API_URL, timeout: 25000 });

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
