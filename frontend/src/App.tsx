import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Navbar />

      <main>
        <AppRoutes />
      </main>

      <Footer />
    </CartProvider>
  );
}

export default App;
