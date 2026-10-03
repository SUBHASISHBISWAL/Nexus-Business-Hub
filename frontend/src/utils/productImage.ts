import type { SyntheticEvent } from "react";
import type { Product } from "../types/product";

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";

/**
 * Resolves a reliable image URL for a product according to requirements:
 * Priority:
 * 1. product.images[0]
 * 2. product.imageUrl
 * 3. product.image
 * 4. safe fallback placeholder
 */
export function resolveProductImage(
  product?: Partial<Product> | {
    images?: string[] | null;
    imageUrl?: string | null;
    image?: string | null;
    productImage?: string | null;
  } | null
): string {
  if (!product) return FALLBACK_PRODUCT_IMAGE;

  // 1. product.images[0]
  if (Array.isArray(product.images)) {
    const firstValid = product.images.find(
      (img) => typeof img === "string" && img.trim().length > 0
    );
    if (firstValid) {
      return sanitizeImageUrl(firstValid);
    }
  }

  // 2. product.imageUrl
  if (
    typeof product.imageUrl === "string" &&
    product.imageUrl.trim().length > 0
  ) {
    return sanitizeImageUrl(product.imageUrl);
  }

  // 3. product.image
  if (typeof product.image === "string" && product.image.trim().length > 0) {
    return sanitizeImageUrl(product.image);
  }

  // 3b. OrderItem.productImage (for orders / payment)
  if (
    "productImage" in product &&
    typeof product.productImage === "string" &&
    product.productImage.trim().length > 0
  ) {
    return sanitizeImageUrl(product.productImage);
  }

  // 4. Safe fallback placeholder
  return FALLBACK_PRODUCT_IMAGE;
}

/**
 * Resolves an array of image URLs for galleries / carousels.
 * Falls back to single resolved image or placeholder.
 */
export function resolveProductImages(
  product?: Partial<Product> | null
): string[] {
  if (!product) return [FALLBACK_PRODUCT_IMAGE];

  let list: string[] = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    list = product.images
      .filter((img) => typeof img === "string" && img.trim().length > 0)
      .map(sanitizeImageUrl);
  }

  if (list.length === 0) {
    const single = resolveProductImage(product);
    list = [single];
  }

  return list.length > 0 ? list : [FALLBACK_PRODUCT_IMAGE];
}

/**
 * Sanitizes image URLs by stripping obsolete static local asset prefixes if present,
 * or returning full HTTP/HTTPS/data URLs cleanly.
 */
function sanitizeImageUrl(url: string): string {
  if (!url) return FALLBACK_PRODUCT_IMAGE;
  const trimmed = url.trim();

  // If already an absolute HTTP/HTTPS or data URL, return directly
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // If someone passed /src/assets/product-images/https://... or similar
  const httpIdx = trimmed.indexOf("http://");
  const httpsIdx = trimmed.indexOf("https://");
  if (httpsIdx !== -1) {
    return trimmed.substring(httpsIdx);
  }
  if (httpIdx !== -1) {
    return trimmed.substring(httpIdx);
  }

  return trimmed;
}

/**
 * Reusable onError handler that replaces a broken image with FALLBACK_PRODUCT_IMAGE
 * exactly once, preventing infinite onError request loops.
 */
export function handleImageError(
  event: SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = FALLBACK_PRODUCT_IMAGE
): void {
  const target = event.currentTarget;
  if (!target) return;

  // Prevent repeated triggers / loops if fallback itself fails
  if (!target.dataset.hasFallback && target.src !== fallback) {
    target.dataset.hasFallback = "true";
    target.src = fallback;
  }
}

/**
 * Normalizes a product before storing it into cart to ensure stable fields:
 * - id
 * - name
 * - price
 * - image / imageUrl / images (using resolved DB/API image URLs)
 * - stockQuantity
 * - quantity
 */
export function normalizeProductForCart(product: Product): Product {
  const resolved = resolveProductImage(product);
  const resolvedList = resolveProductImages(product);

  return {
    ...product,
    image: resolved,
    imageUrl: product.imageUrl || resolved,
    images: resolvedList.length > 0 ? resolvedList : [resolved],
    stockQuantity: product.stockQuantity,
    quantity: product.quantity && product.quantity > 0 ? product.quantity : 1,
  };
}
