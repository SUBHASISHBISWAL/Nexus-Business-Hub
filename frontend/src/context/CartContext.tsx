import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { Product } from "../types/product";
import { normalizeProductForCart } from "../utils/productImage";
import { isAuthenticated } from "../utils/auth";

export type CartItem = Product & {
  quantity: number;
};

export type CartContextType = {
  cart: CartItem[];
  totalCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  totalCount: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
});

type CartProviderProps = {
  children: ReactNode;
};

const CART_STORAGE_KEY = "nexus_cart";

/**
 * Parses and normalizes cart items from localStorage.
 * Consolidates any legacy duplicate product arrays into single items with quantities.
 */
function parseSavedCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const map = new Map<number, CartItem>();

    for (const item of parsed) {
      if (!item || typeof item.id !== "number") continue;
      const normalized = normalizeProductForCart(item);
      const qty =
        typeof item.quantity === "number" && item.quantity > 0
          ? item.quantity
          : 1;

      const existing = map.get(item.id);
      if (existing) {
        existing.quantity += qty;
        if (existing.stockQuantity !== undefined) {
          existing.quantity = Math.min(
            existing.quantity,
            existing.stockQuantity
          );
        }
      } else {
        const initialQty =
          normalized.stockQuantity !== undefined
            ? Math.min(qty, normalized.stockQuantity)
            : qty;
        map.set(item.id, {
          ...normalized,
          quantity: Math.max(1, initialQty),
        });
      }
    }

    return Array.from(map.values());
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
}

export function CartProvider({ children }: CartProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>(() => {
    return parseSavedCart(localStorage.getItem(CART_STORAGE_KEY));
  });

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // Immediate total count of all items (sum of quantities)
  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  }, [cart]);

  /**
   * Add a product to cart.
   * - Requires customer authentication (redirects to /login)
   * - Prevents adding inactive products
   * - Prevents adding out-of-stock products
   * - Respects stockQuantity limit
   * - Consolidates existing products by increasing quantity
   */
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (!product || typeof product.id !== "number") return;

    // Check login: unauthenticated users must be redirected to /login
    if (!isAuthenticated()) {
      const currentPath = location.pathname + (location.search || "");
      const returnUrl =
        currentPath.includes("?") || currentPath.includes("&")
          ? encodeURIComponent(currentPath)
          : currentPath;
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Prevent adding inactive or zero-stock products
    if (product.isActive === false) {
      return;
    }
    if (
      product.stockQuantity !== undefined &&
      product.stockQuantity <= 0
    ) {
      return;
    }

    const addAmount = Math.max(1, quantityToAdd);

    setCart((currentCart) => {
      const existingIndex = currentCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        // Increase quantity of existing product
        const existingItem = currentCart[existingIndex];
        const maxStock =
          existingItem.stockQuantity !== undefined
            ? existingItem.stockQuantity
            : Infinity;

        const newQuantity = Math.min(
          existingItem.quantity + addAmount,
          maxStock
        );

        const updated = [...currentCart];
        updated[existingIndex] = {
          ...existingItem,
          // Re-normalize in case product details were updated
          ...normalizeProductForCart(product),
          quantity: newQuantity,
        };
        return updated;
      }

      // Add as new cart item
      const normalized = normalizeProductForCart(product);
      const maxStock =
        normalized.stockQuantity !== undefined
          ? normalized.stockQuantity
          : Infinity;
      const initialQuantity = Math.min(addAmount, maxStock);

      return [
        ...currentCart,
        {
          ...normalized,
          quantity: Math.max(1, initialQuantity),
        },
      ];
    });
  };

  /**
   * Remove all quantities of a product from cart
   */
  const removeFromCart = (id: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  /**
   * Decrease quantity of product by 1, or remove if reaches 0
   */
  const decreaseQuantity = (id: number) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === id);
      if (!existing) return currentCart;

      if (existing.quantity <= 1) {
        return currentCart.filter((item) => item.id !== id);
      }

      return currentCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  /**
   * Clear entire cart
   */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalCount,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}