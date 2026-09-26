import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";

type WishlistContextType = {
  wishlist: number[];
  wishlistProducts: Product[];
  toggleWishlist: (productOrId: Product | number) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
};

const WISHLIST_IDS_KEY = "nexus_wishlist_ids";
const WISHLIST_PRODUCTS_KEY = "nexus_wishlist_products";

export const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_IDS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [wishlistProducts, setWishlistProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_PRODUCTS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Save IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_IDS_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist IDs:", error);
    }
  }, [wishlist]);

  // Save product details to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_PRODUCTS_KEY,
        JSON.stringify(wishlistProducts)
      );
    } catch (error) {
      console.error("Error saving wishlist products:", error);
    }
  }, [wishlistProducts]);

  const toggleWishlist = (productOrId: Product | number) => {
    const id =
      typeof productOrId === "number" ? productOrId : productOrId.id;
    const product =
      typeof productOrId === "object" ? productOrId : undefined;

    setWishlist((previous) => {
      const exists = previous.includes(id);

      if (exists) {
        setWishlistProducts((prevProducts) =>
          prevProducts.filter((item) => item.id !== id)
        );
        return previous.filter((item) => item !== id);
      } else {
        if (product) {
          setWishlistProducts((prevProducts) => {
            const alreadyHas = prevProducts.some((item) => item.id === id);
            return alreadyHas ? prevProducts : [...prevProducts, product];
          });
        }
        return [...previous, id];
      }
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((previous) => previous.filter((id) => id !== productId));
    setWishlistProducts((previous) =>
      previous.filter((item) => item.id !== productId)
    );
  };

  const clearWishlist = () => {
    setWishlist([]);
    setWishlistProducts([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistProducts,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}