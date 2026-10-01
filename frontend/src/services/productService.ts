import axios from "axios";
import type { Product } from "../types/product";

const API_URL = "http://localhost:5133/api/Products";

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  all?: boolean;
}

export interface PagedProductResult {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categoryCounts?: Record<string, number>;
}

export const getProducts = async (
  params?: ProductQueryParams
): Promise<PagedProductResult> => {
  const response = await axios.get<PagedProductResult>(API_URL, { params });
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/${id}`);
  return response.data;
};