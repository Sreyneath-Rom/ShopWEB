// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // if your backend uses cookies/sessions
});

// Optional: useful for debugging
api.interceptors.request.use((config) => {
  console.log("API Request →", config.method?.toUpperCase(), config.url);
  return config;
});

export default api;