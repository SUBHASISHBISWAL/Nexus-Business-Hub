import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const hideLayout = isAdminPage || isAuthPage;

  return (
    <CartProvider>
      <WishlistProvider>
        {!hideLayout && <Navbar />}

        <main>
          <AppRoutes />
        </main>

        {!hideLayout && <Footer />}
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;