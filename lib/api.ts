import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_BACKEND_API?.trim() ||
  "";

export default axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
