import { Routes, Route } from "react-router-dom";

// Login/Register
import Auth from "../pages/Auth/Auth";

// Main Pages
import Home from "../pages/Home/Home";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import About from "../pages/About/About";

// Cart & Purchase
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Payment from "../pages/Payment/Payment";

// Orders
import Orders from "../pages/Orders/Orders";
import CustomerOrderDetails from "../pages/Orders/OrderDetails";
import OrderTracking from "../pages/Orders/OrderTracking";

// Support
import Support from "../pages/Support/Support";
import CreateTicket from "../pages/Support/CreateTicket";
import SupportTickets from "../pages/Support/SupportTickets";
import SupportTicketDetails from "../pages/Support/SupportTicketDetails";

import OrderHistory from "../pages/OrderHistory/OrderHistory";

// Admin
import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import AdminProducts from "../pages/Admin/AdminProducts/AdminProducts";
import AddProduct from "../pages/Admin/AdminProducts/AddProduct/AddProduct";
import EditProduct from "../pages/Admin/AdminProducts/EditProduct/EditProduct";
import AdminProductDetails from "../pages/Admin/AdminProducts/ProductDetails/ProductDetails";

import AdminOrders from "../pages/Admin/AdminOrders/AdminOrders";
import AdminOrderDetails from "../pages/Admin/AdminOrders/OrderDetails/OrderDetails";
import AdminShipments from "../pages/Admin/AdminShipments/AdminShipments";
import ShipmentDetails from "../pages/Admin/AdminShipments/ShipmentDetails/ShipmentDetails";
import AdminTickets from "../pages/Admin/AdminTickets/AdminTickets";
import TicketDetails from "../pages/Admin/AdminTickets/TicketDetails/TicketDetails";
import AdminSettings from "../pages/Admin/AdminSettings/AdminSettings";

function AppRoutes() {
  return (
    <Routes>
      {/* ==================== Login/Register ==================== */}  
      
      <Route path="/login" element={<Auth />} />
      
      <Route path="/register" element={<Auth />} />

      {/* ==================== MAIN ==================== */}

      <Route path="/" element={<Home />} />

      <Route path="/products" element={<ProductList />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/about" element={<About />} />

      {/* ==================== SHOPPING ==================== */}

      <Route path="/cart" element={<Cart />} />

      <Route path="/wishlist" element={<Wishlist />} />

      {/* ==================== CHECKOUT ==================== */}

      <Route path="/checkout" element={<Checkout />} />

      <Route path="/payment" element={<Payment />} />

      {/* ==================== CUSTOMER ORDERS ==================== */}

      <Route path="/orders" element={<Orders />} />

      <Route path="/orders/:id" element={<CustomerOrderDetails />} />

      <Route path="/orders/:id/tracking" element={<OrderTracking />} />

      {/* ==================== SUPPORT ==================== */}

      <Route path="/support" element={<Support />} />

      <Route path="/support/create-ticket" element={<CreateTicket />} />

      <Route path="/support/tickets" element={<SupportTickets />} />

      <Route path="/support/tickets/:id" element={<SupportTicketDetails />} />

      <Route path="/order-history" element={<OrderHistory />} />

      {/* ==================== ADMIN ==================== */}

      {/* Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />

      {/* Products */}
      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        }
      />

      {/* Add Product */}
      <Route
        path="/admin/products/add"
        element={
          <AdminLayout>
            <AddProduct />
          </AdminLayout>
        }
      />

      {/* Edit Product */}
      <Route
        path="/admin/products/:id/edit"
        element={
          <AdminLayout>
            <EditProduct />
          </AdminLayout>
        }
      />

      {/* Product Details */}
      <Route
        path="/admin/products/:id"
        element={
          <AdminLayout>
            <AdminProductDetails />
          </AdminLayout>
        }
      />

      {/* Orders */}
      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <AdminOrders />
          </AdminLayout>
        }
      />

      {/* Order Details */}
      <Route
        path="/admin/orders/:id"
        element={
          <AdminLayout>
            <AdminOrderDetails />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/shipments"
        element={
          <AdminLayout>
            <AdminShipments />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/shipments/:id"
        element={
          <AdminLayout>
            <ShipmentDetails />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tickets"
        element={
          <AdminLayout>
            <AdminTickets />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/tickets/:id"
        element={
          <AdminLayout>
            <TicketDetails />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
