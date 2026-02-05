import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
