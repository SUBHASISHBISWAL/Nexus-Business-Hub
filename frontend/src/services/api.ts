/**
 * Nexus Business Hub - API Service Layer
 * Prepared for future ASP.NET Core Web API integration (e.g. /api/products, /api/categories).
 * Currently serves typed mock data with asynchronous contracts.
 */

import {
  getProducts as fetchProducts,
  getProductById as fetchProductById,
  getCategories as fetchCategories,
} from "./productService";
import type { Product, ProductCategory } from "../types/product";
import { productCategories } from "../data/products";

export const apiService = {
  /**
   * Fetch all enterprise products from real backend API
   */
  async getProducts(): Promise<Product[]> {
    const res = await fetchProducts({ all: true });
    return res.items;
  },

  /**
   * Fetch a single product by ID from real backend API
   */
  async getProductById(id: number): Promise<Product | undefined> {
    try {
      return await fetchProductById(id);
    } catch {
      return undefined;
    }
  },

  /**
   * Fetch featured products for the Home page from real backend API
   */
  async getFeaturedProducts(limit = 4): Promise<Product[]> {
    const res = await fetchProducts({ page: 1, pageSize: limit, sortBy: "newest" });
    return res.items;
  },

  /**
   * Fetch all product categories from real backend API
   */
  async getCategories(): Promise<ProductCategory[]> {
    try {
      const cats = await fetchCategories();
      return cats.map((c) => ({
        id: c.name.toLowerCase(),
        name: c.name,
        count: c.productCount ?? 0,
        description: c.description || `${c.name} products`,
        icon: "bi-tag",
        path: `/products?category=${encodeURIComponent(c.name)}`,
      }));
    } catch {
      return productCategories;
    }
  },
};
