import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import About from "../pages/About/About";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default AppRoutes;