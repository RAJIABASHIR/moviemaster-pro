import axios from "axios";
import { auth } from "../lib/firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://moviemaster-pro-server-xi.vercel.app/",
});

console.log("API base:", api.defaults.baseURL);

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
   
    console.warn("[axios] token fetch failed:", e?.message || e);
  }
  return config;
});

export default api;
