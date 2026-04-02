import axios from "axios";
import BASE_URL from "../utils/constants";
import { getToken } from "../utils/helpers";

const authApi = axios.create({
  baseURL: BASE_URL,
});

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => authApi.post("/api/auth/register", data);
export const loginUser = (data) => authApi.post("/api/auth/login", data);

export default api;
