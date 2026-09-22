import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import About from "../pages/About/About";

import Support from "../pages/Support/Support";
import CreateTicket from "../pages/Support/CreateTicket";
import SupportTickets from "../pages/Support/SupportTickets";
import SupportTicketDetails from "../pages/Support/SupportTicketDetails";

import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/products"
        element={<ProductList />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />

      <Route
        path="/support"
        element={<Support />}
      />

      <Route
        path="/support/create-ticket"
        element={<CreateTicket />}
      />

      <Route
        path="/support/tickets"
        element={<SupportTickets />}
      />

      <Route
        path="/support/tickets/:id"
        element={<SupportTicketDetails />}
      />
    </Routes>
  );
}

export default AppRoutes;