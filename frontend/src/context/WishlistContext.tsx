import { createContext, useContext, useState } from "react";

type WishlistContextType = {
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
};

export const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const toggleWishlist = (productId: number) => {
    setWishlist((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist }}
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