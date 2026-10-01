import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

type InitialLoadingContextType = {
  isInitialReady: boolean;
  isFadingOut: boolean;
  markAppReady: () => void;
};

const InitialLoadingContext = createContext<InitialLoadingContextType>({
  isInitialReady: false,
  isFadingOut: false,
  markAppReady: () => {},
});

export function InitialLoadingProvider({ children }: { children: ReactNode }) {
  const [isInitialReady, setIsInitialReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const location = useLocation();

  const markAppReady = useCallback(() => {
    setIsFadingOut((prevFading) => {
      if (prevFading) return prevFading;
      return true;
    });
  }, []);

  // When fading out begins, complete readiness after the short CSS transition
  useEffect(() => {
    if (isFadingOut && !isInitialReady) {
      // Allow the 250ms CSS visual transition to finish, then unmount overlay
      const timer = window.setTimeout(() => {
        setIsInitialReady(true);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [isFadingOut, isInitialReady]);

  // For routes that don't depend on external API catalogs, release immediately
  useEffect(() => {
    const apiRoutes = [
      "/",
      "/products",
      "/orders",
      "/order-history",
      "/wishlist",
      "/admin/products",
      "/admin/orders",
    ];

    const isApiRoute =
      apiRoutes.includes(location.pathname) ||
      location.pathname.startsWith("/products/") ||
      location.pathname.startsWith("/orders/");

    if (!isFadingOut && !isApiRoute) {
      markAppReady();
    }
  }, [location.pathname, isFadingOut, markAppReady]);

  // Safety fallback guard (e.g. infinite network hang or unreachable host)
  useEffect(() => {
    const safetyTimer = window.setTimeout(() => {
      markAppReady();
    }, 5000);
    return () => window.clearTimeout(safetyTimer);
  }, [markAppReady]);

  return (
    <InitialLoadingContext.Provider
      value={{
        isInitialReady,
        isFadingOut,
        markAppReady,
      }}
    >
      {children}
    </InitialLoadingContext.Provider>
  );
}

export function useInitialLoading() {
  return useContext(InitialLoadingContext);
}

export default InitialLoadingContext;
