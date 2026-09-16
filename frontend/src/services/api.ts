/**
 * Nexus Business Hub - API Service Layer
 * Prepared for future ASP.NET Core Web API integration (e.g. /api/products, /api/categories).
 * Currently serves typed mock data with asynchronous contracts.
 */

import { products, productCategories } from "../data/products";
import type { Product, ProductCategory } from "../types/product";

// Simulated network delay for development realism (can be toggled to 0)
const SIMULATED_DELAY_MS = 0;

function simulateDelay<T>(data: T): Promise<T> {
  if (SIMULATED_DELAY_MS === 0) return Promise.resolve(data);
  return new Promise((resolve) => setTimeout(() => resolve(data), SIMULATED_DELAY_MS));
}

export const apiService = {
  /**
   * Fetch all enterprise products
   * Future backend endpoint: GET /api/products
   */
  async getProducts(): Promise<Product[]> {
    return simulateDelay([...products]);
  },

  /**
   * Fetch a single product by ID
   * Future backend endpoint: GET /api/products/{id}
   */
  async getProductById(id: number): Promise<Product | undefined> {
    const product = products.find((p) => p.id === id);
    return simulateDelay(product);
  },

  /**
   * Fetch featured products for the Home page
   * Future backend endpoint: GET /api/products/featured
   */
  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    const featured = products.slice(0, limit);
    return simulateDelay(featured);
  },

  /**
   * Fetch all product categories
   * Future backend endpoint: GET /api/categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    return simulateDelay([...productCategories]);
  },
};
