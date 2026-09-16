import { createContext, useState, type ReactNode } from "react";

type CartProduct = {
  id: number;
  name: string;
  category: string;
  group: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  icon: string;
  specs: string;
  stock: string;
  badge: string;
  requestOnly?: boolean;
};

type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const addToCart = (product: CartProduct) => {
    setCart((currentCart) => [...currentCart, product]);
  };

  const removeFromCart = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((product) => product.id !== id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}