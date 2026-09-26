import axios from "axios";

const API_URL = "http://localhost:5133/api/Products";

export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await axios.get(
    `${API_URL}/${id}`
  );

  return response.data;
};