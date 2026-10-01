import { Routes, Route } from "react-router-dom";

// Login / Register
import Login from "../pages/Login/login";

// Main Pages
import Home from "../pages/Home/Home";
import ProductList from "../pages/ProductList";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import About from "../pages/About/About";

// Profile / Settings
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";

// Cart & Purchase
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import Payment from "../pages/Payment/Payment";

// Customer Orders
import Orders from "../pages/Orders/Orders";
import CustomerOrderDetails from "../pages/Orders/OrderDetails";
import OrderTracking from "../pages/Orders/OrderTracking";
import OrderHistory from "../pages/OrderHistory/OrderHistory";

// Customer Support
import Support from "../pages/Support/Support";
import CreateTicket from "../pages/Support/CreateTicket";
import SupportTickets from "../pages/Support/SupportTickets";
import SupportTicketDetails from "../pages/Support/SupportTicketDetails";

// Admin Layout & Dashboard
import AdminLayout from "../pages/Admin/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";

// Admin Products
import AdminProducts from "../pages/Admin/AdminProducts/AdminProducts";
import AddProduct from "../pages/Admin/AdminProducts/AddProduct/AddProduct";
import EditProduct from "../pages/Admin/AdminProducts/EditProduct/EditProduct";
import AdminProductDetails from "../pages/Admin/AdminProducts/ProductDetails/ProductDetails";

// Admin Orders
import AdminOrders from "../pages/Admin/AdminOrders/AdminOrders";
import AdminOrderDetails from "../pages/Admin/AdminOrders/OrderDetails/OrderDetails";

// Admin Shipments
import AdminShipments from "../pages/Admin/AdminShipments/AdminShipments";
import ShipmentDetails from "../pages/Admin/AdminShipments/ShipmentDetails/ShipmentDetails";

// Admin Tickets
import AdminTickets from "../pages/Admin/AdminTickets/AdminTickets";
import TicketDetails from "../pages/Admin/AdminTickets/TicketDetails/TicketDetails";

// Admin Settings
import AdminSettings from "../pages/Admin/AdminSettings/AdminSettings";

// Admin OTP
import AdminOTP from "../pages/Admin/AdminOTP/AdminOTP";

// Admin Protection
import AdminProtectedRoute from "./AdminProtectedRoute";

// Admin Notifications
import AdminNotifications from "../pages/Admin/AdminNotifications/AdminNotifications";

// Admin Administrators
import AdminAdministrators from "../pages/Admin/AdminAdministrators/AdminAdministrators";

// Admin Payments
import AdminPayments from "../pages/Admin/AdminPayments/AdminPayments";
import PaymentDetails from "../pages/Admin/AdminPayments/PaymentDetails/PaymentDetails";

// Admin Customers
import AdminCustomers from "../pages/Admin/AdminCustomers/AdminCustomers";
import CustomerDetails from "../pages/Admin/AdminCustomers/CustomerDetails/CustomerDetails";

// Admin Inventory
import AdminInventory from "../pages/Admin/AdminInventory/AdminInventory";

// Admin Returns
import AdminReturns from "../pages/Admin/AdminReturns/AdminReturns";
import AdminReturnDetails from "../pages/Admin/AdminReturnDetails/AdminReturnDetails";


function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          LOGIN / REGISTER
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Login />}
      />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <Route
        path="/"
        element={<Home />}
      />

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
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />


      {/* =====================================================
          SHOPPING
      ===================================================== */}

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/wishlist"
        element={<Wishlist />}
      />


      {/* =====================================================
          CHECKOUT
      ===================================================== */}

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/payment"
        element={<Payment />}
      />


      {/* =====================================================
          CUSTOMER ORDERS
      ===================================================== */}

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:id"
        element={<CustomerOrderDetails />}
      />

      <Route
        path="/orders/:id/tracking"
        element={<OrderTracking />}
      />

      <Route
        path="/order-history"
        element={<OrderHistory />}
      />


      {/* =====================================================
          CUSTOMER SUPPORT
      ===================================================== */}

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


      {/* =====================================================
          ADMIN AUTH
          
          This route MUST stay outside AdminProtectedRoute
          because admin reaches OTP immediately after login.
      ===================================================== */}

      <Route
        path="/admin/verify-otp"
        element={<AdminOTP />}
      />


      {/* =====================================================
          PROTECTED ADMIN ROUTES
      ===================================================== */}

      <Route element={<AdminProtectedRoute />}>

        {/* =================================================
            ADMIN DASHBOARD
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN PRODUCTS
        ================================================= */}

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <AdminLayout>
              <AddProduct />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/:id/edit"
          element={
            <AdminLayout>
              <EditProduct />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products/:id"
          element={
            <AdminLayout>
              <AdminProductDetails />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN ORDERS
        ================================================= */}

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <AdminLayout>
              <AdminOrderDetails />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN SHIPMENTS
        ================================================= */}

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


        {/* =================================================
            ADMIN TICKETS
        ================================================= */}

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


        {/* =================================================
            ADMIN SETTINGS
        ================================================= */}

        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN ADMINISTRATORS
        ================================================= */}

        <Route
          path="/admin/administrators"
          element={
            <AdminLayout>
              <AdminAdministrators />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN NOTIFICATIONS
        ================================================= */}

        <Route
          path="/admin/notifications"
          element={
            <AdminLayout>
              <AdminNotifications />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN PAYMENTS
        ================================================= */}

        <Route
          path="/admin/payments"
          element={
            <AdminLayout>
              <AdminPayments />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/payments/:paymentId"
          element={
            <AdminLayout>
              <PaymentDetails />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN CUSTOMERS
        ================================================= */}

        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <AdminCustomers />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/customers/:customerId"
          element={
            <AdminLayout>
              <CustomerDetails />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN INVENTORY
        ================================================= */}

        <Route
          path="/admin/inventory"
          element={
            <AdminLayout>
              <AdminInventory />
            </AdminLayout>
          }
        />


        {/* =================================================
            ADMIN RETURNS
        ================================================= */}

        <Route
          path="/admin/returns"
          element={
            <AdminLayout>
              <AdminReturns />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/returns/:returnId"
          element={
            <AdminLayout>
              <AdminReturnDetails />
            </AdminLayout>
          }
        />

      </Route>

    </Routes>
  );
}

export default AppRoutes;