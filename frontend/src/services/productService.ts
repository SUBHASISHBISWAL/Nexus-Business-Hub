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
  includeInactive?: boolean;
  isActive?: boolean;
  status?: string;
}

export interface PagedProductResult {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categoryCounts?: Record<string, number>;
  activeCount?: number;
  outOfStockCount?: number;
  draftCount?: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: number;
  stockQuantity: number;
  rating?: number;
  imageUrl?: string;
  isActive?: boolean;
  images?: string[];
}

export interface UpdateProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: number;
  stockQuantity: number;
  rating?: number;
  imageUrl?: string;
  isActive?: boolean;
  images?: string[];
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  productCount?: number;
}

export const getProducts = async (
  params?: ProductQueryParams
): Promise<PagedProductResult> => {
  const response = await axios.get<PagedProductResult>(API_URL, { params });
  return response.data;
};

export const getProductById = async (
  id: number,
  includeInactive: boolean = false
): Promise<Product> => {
  const response = await axios.get<Product>(`${API_URL}/${id}`, {
    params: includeInactive ? { includeInactive: true } : undefined,
  });
  return response.data;
};

export const createProduct = async (
  data: CreateProductInput
): Promise<Product> => {
  const response = await axios.post<Product>(API_URL, data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  const response = await axios.put<Product>(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const getCategories = async (): Promise<CategoryDto[]> => {
  const response = await axios.get<CategoryDto[]>(`${API_URL}/categories`);
  return response.data;
};