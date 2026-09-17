import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />

        <main>
          <AppRoutes />
        </main>

        <Footer />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
