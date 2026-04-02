import api from "./api";

export const createOrder = (data) => api.post("/api/orders/create", data);
export const getMyOrders = () => api.get("/api/orders/my-orders");
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const getOrderItems = (id) => api.get(`/api/orders/${id}/items`);
export const getAllOrders = () => api.get("/api/orders/all");
export const updateOrderStatus = (id, status) =>
  api.put(`/api/orders/${id}/status?status=${status}`);
