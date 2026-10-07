import axios from "axios";
import type { Product } from "../types/product";
import { getStoredToken } from "../utils/auth";

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
  totalCount?: number;
  activeCount?: number;
  outOfStockCount?: number;
  draftCount?: number;
}

export interface CreateProductInput {
  name: string;
  sku?: string;
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
  sku?: string;
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

const inFlightProducts = new Map<string, Promise<PagedProductResult>>();
let inFlightCategories: Promise<CategoryDto[]> | null = null;

export const clearProductCache = (): void => {
  inFlightProducts.clear();
  inFlightCategories = null;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

function serializeParams(params?: ProductQueryParams): string {
  if (!params) return "";
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

export const getProducts = (
  params?: ProductQueryParams,
  signal?: AbortSignal
): Promise<PagedProductResult> => {
  const key = serializeParams(params);
  let inFlight = inFlightProducts.get(key);

  if (!inFlight) {
    inFlight = axios
      .get<PagedProductResult>(API_URL, { params })
      .then((response) => response.data)
      .finally(() => {
        inFlightProducts.delete(key);
      });
    inFlightProducts.set(key, inFlight);
  }

  if (!signal) {
    return inFlight;
  }

  if (signal.aborted) {
    const err = new Error("canceled");
    err.name = "CanceledError";
    return Promise.reject(err);
  }

  return new Promise<PagedProductResult>((resolve, reject) => {
    const onAbort = () => {
      const err = new Error("canceled");
      err.name = "CanceledError";
      reject(err);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    inFlight!
      .then((data) => {
        signal.removeEventListener("abort", onAbort);
        if (signal.aborted) {
          const err = new Error("canceled");
          err.name = "CanceledError";
          reject(err);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      });
  });
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
  clearProductCache();
  const response = await axios.post<Product>(API_URL, data, {
    headers: getAuthHeaders(),
  });
  clearProductCache();
  window.dispatchEvent(
    new CustomEvent("productsUpdated", {
      detail: { action: "create", product: response.data },
    })
  );
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductInput
): Promise<Product> => {
  clearProductCache();
  const response = await axios.put<Product>(`${API_URL}/${id}`, data, {
    headers: getAuthHeaders(),
  });
  clearProductCache();
  window.dispatchEvent(
    new CustomEvent("productsUpdated", {
      detail: { action: "update", product: response.data },
    })
  );
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  clearProductCache();
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  clearProductCache();
  window.dispatchEvent(
    new CustomEvent("productsUpdated", {
      detail: { action: "delete", id },
    })
  );
};

export const updateProductStatus = async (
  id: number,
  isActive: boolean
): Promise<Product> => {
  clearProductCache();
  const response = await axios.patch<Product>(
    `${API_URL}/${id}/status`,
    { isActive },
    {
      headers: getAuthHeaders(),
    }
  );
  clearProductCache();
  window.dispatchEvent(
    new CustomEvent("productsUpdated", {
      detail: { action: "status", product: response.data },
    })
  );
  return response.data;
};

export const getCategories = (signal?: AbortSignal): Promise<CategoryDto[]> => {
  if (!inFlightCategories) {
    inFlightCategories = axios
      .get<CategoryDto[]>(`${API_URL}/categories`)
      .then((response) => response.data)
      .finally(() => {
        inFlightCategories = null;
      });
  }

  if (!signal) {
    return inFlightCategories;
  }

  if (signal.aborted) {
    const err = new Error("canceled");
    err.name = "CanceledError";
    return Promise.reject(err);
  }

  return new Promise<CategoryDto[]>((resolve, reject) => {
    const onAbort = () => {
      const err = new Error("canceled");
      err.name = "CanceledError";
      reject(err);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    inFlightCategories!
      .then((data) => {
        signal.removeEventListener("abort", onAbort);
        if (signal.aborted) {
          const err = new Error("canceled");
          err.name = "CanceledError";
          reject(err);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      });
  });
};