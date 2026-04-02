import api from "./api";
import BASE_URL from "../utils/constants";

export const getAllProducts = () => api.get("/api/products");
export const getProductById = (id) => api.get(`/api/products/${id}`);
export const getProductsByCategory = (category) => api.get(`/api/products/category/${category}`);
export const searchProducts = (name) => api.get(`/api/products/search?name=${name}`);
export const addProduct = (data) => api.post("/api/products", data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const getProductImageUrl = (imgName) => `${BASE_URL}/api/products/image/${imgName}`;
