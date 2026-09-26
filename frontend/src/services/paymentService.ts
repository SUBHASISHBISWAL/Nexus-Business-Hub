import axios from "axios";

const API_URL = "http://localhost:5171/api/Payments";

export type ProcessPaymentRequest = {
  orderId: number;
  paymentMethod: string;
};

export async function processPayment(
  paymentData: ProcessPaymentRequest
) {
  const response = await axios.post(
    `${API_URL}/process`,
    paymentData
  );

  return response.data;
}

export async function getPaymentByOrderId(
  orderId: number
) {
  const response = await axios.get(
    `${API_URL}/${orderId}`
  );

  return response.data;
}