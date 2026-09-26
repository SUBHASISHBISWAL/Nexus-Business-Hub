import axios from "axios";

const API_URL = "http://localhost:5171/api/Orders";

export const getOrders = async () => {
  const response = await axios.get(API_URL);

  return response.data;
};

export const getOrderById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data;
};

export const createOrder = async (orderData: unknown) => {
  const response = await axios.post(
    API_URL,
    orderData
  );

  return response.data;
};