import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Admin Protection (eagerly loaded route guard)
import AdminProtectedRoute from "./AdminProtectedRoute";

// Login / Register
const Login = lazy(() => import("../pages/Login/login"));

// Main Pages
const Home = lazy(() => import("../pages/Home/Home"));
const ProductList = lazy(() => import("../pages/ProductList"));
const ProductDetails = lazy(
  () => import("../pages/ProductDetails/ProductDetails")
);
const About = lazy(() => import("../pages/About/About"));

// Profile / Settings
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Settings = lazy(() => import("../pages/Settings/Settings"));

// Cart & Purchase
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist/Wishlist"));
const Checkout = lazy(() => import("../pages/Checkout/Checkout"));
const Payment = lazy(() => import("../pages/Payment/Payment"));

// Customer Orders
const Orders = lazy(() => import("../pages/Orders/Orders"));
const CustomerOrderDetails = lazy(() => import("../pages/Orders/OrderDetails"));
const OrderTracking = lazy(() => import("../pages/Orders/OrderTracking"));
const OrderHistory = lazy(() => import("../pages/OrderHistory/OrderHistory"));

// Customer Support
const Support = lazy(() => import("../pages/Support/Support"));
const CreateTicket = lazy(() => import("../pages/Support/CreateTicket"));
const SupportTickets = lazy(() => import("../pages/Support/SupportTickets"));
const SupportTicketDetails = lazy(
  () => import("../pages/Support/SupportTicketDetails")
);

// Admin Layout & Dashboard
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout/AdminLayout"));
const AdminDashboard = lazy(
  () => import("../pages/Admin/AdminDashboard/AdminDashboard")
);

// Admin Products
const AdminProducts = lazy(
  () => import("../pages/Admin/AdminProducts/AdminProducts")
);
const AddProduct = lazy(
  () => import("../pages/Admin/AdminProducts/AddProduct/AddProduct")
);
const EditProduct = lazy(
  () => import("../pages/Admin/AdminProducts/EditProduct/EditProduct")
);
const AdminProductDetails = lazy(
  () => import("../pages/Admin/AdminProducts/ProductDetails/ProductDetails")
);

// Admin Orders
const AdminOrders = lazy(() => import("../pages/Admin/AdminOrders/AdminOrders"));
const AdminOrderDetails = lazy(
  () => import("../pages/Admin/AdminOrders/OrderDetails/OrderDetails")
);

// Admin Shipments
const AdminShipments = lazy(
  () => import("../pages/Admin/AdminShipments/AdminShipments")
);
const ShipmentDetails = lazy(
  () => import("../pages/Admin/AdminShipments/ShipmentDetails/ShipmentDetails")
);

// Admin Tickets
const AdminTickets = lazy(
  () => import("../pages/Admin/AdminTickets/AdminTickets")
);
const TicketDetails = lazy(
  () => import("../pages/Admin/AdminTickets/TicketDetails/TicketDetails")
);

// Admin Settings
const AdminSettings = lazy(
  () => import("../pages/Admin/AdminSettings/AdminSettings")
);

// Admin OTP
const AdminOTP = lazy(() => import("../pages/Admin/AdminOTP/AdminOTP"));

// Admin Notifications
const AdminNotifications = lazy(
  () => import("../pages/Admin/AdminNotifications/AdminNotifications")
);

// Admin Administrators
const AdminAdministrators = lazy(
  () => import("../pages/Admin/AdminAdministrators/AdminAdministrators")
);

// Admin Payments
const AdminPayments = lazy(
  () => import("../pages/Admin/AdminPayments/AdminPayments")
);
const PaymentDetails = lazy(
  () => import("../pages/Admin/AdminPayments/PaymentDetails/PaymentDetails")
);

// Admin Customers
const AdminCustomers = lazy(
  () => import("../pages/Admin/AdminCustomers/AdminCustomers")
);
const CustomerDetails = lazy(
  () => import("../pages/Admin/AdminCustomers/CustomerDetails/CustomerDetails")
);

// Admin Inventory
const AdminInventory = lazy(
  () => import("../pages/Admin/AdminInventory/AdminInventory")
);

// Admin Returns
const AdminReturns = lazy(
  () => import("../pages/Admin/AdminReturns/AdminReturns")
);
const AdminReturnDetails = lazy(
  () => import("../pages/Admin/AdminReturnDetails/AdminReturnDetails")
);

const routeLoadingFallback = (
  <div className="nx-route-loading">
    <span className="material-symbols-outlined">progress_activity</span>
    <p>Loading...</p>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={routeLoadingFallback}>
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
    </Suspense>
  );
}

export default AppRoutes;