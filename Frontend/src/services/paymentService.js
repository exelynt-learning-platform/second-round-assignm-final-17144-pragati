import api from "./api";

export const createPaymentSession = (orderId) =>
  api.post(`/api/payment/create-session/${orderId}`);
export const confirmPaymentSuccess = (orderId, paymentIntentId) =>
  api.post(`/api/payment/success/${orderId}?paymentIntentId=${paymentIntentId}`);
export const confirmPaymentFailure = (orderId) =>
  api.post(`/api/payment/failure/${orderId}`);
