import api from "./api";

export const getCart = () => api.get("/api/cart");
export const addToCart = (data) => api.post("/api/cart/add", data);
export const updateCartItem = (cartItemId, quantity) =>
  api.put(`/api/cart/update/${cartItemId}?quantity=${quantity}`);
export const removeFromCart = (cartItemId) => api.delete(`/api/cart/remove/${cartItemId}`);
