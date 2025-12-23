import axios from "axios";
import useAuthStore from "@/stores/auth-store";
import { devLog } from "./utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().token?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        devLog(`Bearer Token: ${token}`);
      }
    }
    return config;
  },
  (error) => {
    return (
      console.log("Request Error:", error),
      Promise.reject(error)
    )
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", {
//       url: error.config?.url,
//       status: error.response?.status,
//       data: error.response?.data,
//     });
//     return Promise.reject(error);
//   },
// );

export default api;
