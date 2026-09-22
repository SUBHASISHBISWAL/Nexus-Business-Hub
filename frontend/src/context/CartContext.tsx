import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../types/product";

type CartContextType = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  decreaseQuantity: () => {},
  clearCart: () => {},
});

type CartProviderProps = {
  children: ReactNode;
};

const CART_STORAGE_KEY = "nexus_cart";

export function CartProvider({
  children,
}: CartProviderProps) {
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const savedCart = localStorage.getItem(
        CART_STORAGE_KEY
      );

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Error loading cart:",
        error
      );

      return [];
    }
  });

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );

      console.log(
        "Cart saved:",
        cart
      );
    } catch (error) {
      console.error(
        "Error saving cart:",
        error
      );
    }
  }, [cart]);

  // Add product
  const addToCart = (product: Product) => {
    setCart((currentCart) => [
      ...currentCart,
      product,
    ]);
  };

  // Remove all quantities of a product
  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter(
        (product) => product.id !== id
      )
    );
  };

  // Decrease quantity by 1
  const decreaseQuantity = (id: number) => {
    setCart((currentCart) => {
      const index = currentCart.findIndex(
        (product) => product.id === id
      );

      if (index === -1) {
        return currentCart;
      }

      const updatedCart = [...currentCart];

      updatedCart.splice(index, 1);

      return updatedCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
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