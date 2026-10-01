import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useLocation } from "react-router-dom";
import {
  InitialLoadingProvider,
  useInitialLoading,
} from "./context/InitialLoadingContext";
import { GlobalFullPageSkeleton } from "./components/skeleton";

function AppContent() {
  const { isInitialReady, isFadingOut } = useInitialLoading();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const hideLayout = isAdminPage || isAuthPage;

  return (
    <>
      {!isInitialReady && (
        <GlobalFullPageSkeleton isFadingOut={isFadingOut} />
      )}

      <CartProvider>
        <WishlistProvider>
          {!hideLayout && <Navbar />}

          <main>
            <AppRoutes />
          </main>

          {!hideLayout && <Footer />}
        </WishlistProvider>
      </CartProvider>
    </>
  );
}

function App() {
  return (
    <InitialLoadingProvider>
      <AppContent />
    </InitialLoadingProvider>
  );
}

export default App;