# Nexus Business Hub — Frontend Architecture Documentation

Welcome to the **Nexus Business Hub** frontend application. This is a modern, high-performance enterprise Single Page Application (SPA) engineered with **React 19**, **TypeScript**, and **Vite**.

> [!IMPORTANT]
> **Zero Direct Database Access**: The frontend application does **NOT** connect directly to Microsoft SQL Server. It communicates strictly via asynchronous HTTP/REST calls through the ASP.NET Core Web API layer (`http://localhost:5133`).

---

## 1. Frontend Purpose & Scope

The Nexus Business Hub frontend provides an enterprise commerce and solutions experience for both business customers and platform administrators:
- **Customer Storefront**: Product discovery across 200,000+ items, faceted filtering, search, multi-view image galleries, wishlist, persistent cart, checkout, payment processing, customer order management, and support ticketing.
- **Admin Management Portal**: Administrative dashboard, product catalog management (create, read, update, deactivate), order inspection, shipment status tracking, customer registry, and multi-factor authentication (MFA).

---

## 2. Technology Stack & Architecture

- **Framework**: React 19 (`react` ^19.2.8, `react-dom` ^19.2.8)
- **Language**: TypeScript (`typescript` ~6.0.2)
- **Build Tool**: Vite (`vite` ^8.3.0) with `@vitejs/plugin-react`
- **Routing**: React Router v7 (`react-router-dom` ^7.18.3)
- **HTTP Client**: Axios (`axios` ^1.20.0)
- **Styling**: Bootstrap 5 (`bootstrap` ^5.3.8), Bootstrap Icons (`bootstrap-icons` ^1.13.1), FontAwesome Free (`@fortawesome/fontawesome-free` ^7.3.1), Google Material Symbols Outlined, and custom CSS variables.

---

## 3. Directory & Folder Structure

```text
frontend/
├── public/                     # Static root assets
│   ├── favicon.svg             # Application favicon
│   └── icons.svg               # SVG sprite sheet
├── src/
│   ├── assets/                 # Brand graphics and images
│   │   ├── hero.png            # Enterprise hero banner
│   │   └── product-images/     # Static placeholder product images
│   ├── components/             # Reusable UI component library
│   │   ├── common/             # Common UI components (ErrorState.tsx)
│   │   ├── layout/             # Global layout (Navbar.tsx, Footer.tsx)
│   │   ├── skeleton/           # Zero-layout-shift skeleton loaders
│   │   └── ProductCard.tsx     # Enterprise product card component
│   ├── context/                # Global React Context providers
│   │   ├── CartContext.tsx     # Persistent shopping cart state
│   │   ├── InitialLoadingContext.tsx # Full-page initial boot skeleton
│   │   ├── ThemeContext.tsx    # Light/Dark theme provider
│   │   └── WishlistContext.tsx # User wishlist state
│   ├── data/                   # Fallback and taxonomy data
│   │   └── products.ts         # Categories & fallback mock catalogs
│   ├── pages/                  # Routed page view components
│   │   ├── About/              # Company & platform information
│   │   ├── Admin/              # Administrative portal views
│   │   │   ├── AdminAdministrators/
│   │   │   ├── AdminCustomers/
│   │   │   ├── AdminDashboard/
│   │   │   ├── AdminInventory/
│   │   │   ├── AdminLayout/
│   │   │   ├── AdminNotifications/
│   │   │   ├── AdminOrders/
│   │   │   ├── AdminOTP/
│   │   │   ├── AdminPayments/
│   │   │   ├── AdminProducts/  # Product listing, AddProduct, EditProduct
│   │   │   ├── AdminReturns/
│   │   │   ├── AdminSettings/
│   │   │   ├── AdminShipments/
│   │   │   └── AdminTickets/
│   │   ├── Auth/               # Secondary auth views
│   │   ├── Cart/               # Shopping cart review
│   │   ├── Checkout/           # Multi-step checkout with address validation
│   │   ├── Home/               # Enterprise landing page
│   │   ├── Login/              # Customer & Admin login, registration, OTP reset
│   │   ├── OrderHistory/       # Historical customer order ledger
│   │   ├── Orders/             # Order tracking & detail inspection
│   │   ├── Payment/            # Payment gateway simulation (UPI/Card/NetBank)
│   │   ├── ProductDetails/     # Multi-image viewer, specs, stock
│   │   ├── ProductList.tsx     # 48-item paginated catalog with filters
│   │   ├── Profile/            # Customer profile management
│   │   ├── Settings/           # Account settings
│   │   └── Support/            # Customer support tickets & creation
│   ├── routes/                 # Routing configuration
│   │   ├── AdminProtectedRoute.tsx # RBAC route guard for /admin/*
│   │   └── AppRoutes.tsx       # Master route definitions
│   ├── services/               # REST API HTTP clients
│   │   ├── api.ts              # Simulated mock delay contracts
│   │   ├── authService.ts      # Authentication & password reset endpoints
│   │   ├── orderService.ts     # Customer order endpoints
│   │   ├── paymentService.ts   # Payment processing endpoints
│   │   └── productService.ts   # Product catalog CRUD & pagination
│   ├── styles/                 # Global styles & themes
│   │   ├── skeleton.css        # Shimmer animations & placeholder shapes
│   │   └── theme.css           # CSS variables for light & dark themes
│   ├── types/                  # TypeScript interface contracts
│   │   └── product.ts          # Product, Category, Query DTOs
│   ├── utils/                  # Utility helpers
│   │   └── productImage.ts     # Multi-tier image resolution & fallback
│   ├── App.tsx                 # Root application wrapper & providers
│   ├── index.css               # Global base reset & typography
│   └── main.tsx                # React DOM render entry point
├── eslint.config.js            # ESLint rules configuration
├── index.html                  # HTML entry template
├── package.json                # Dependencies and build scripts
├── tsconfig.app.json           # Client TypeScript configuration
├── tsconfig.json               # Root TypeScript configuration
├── tsconfig.node.json          # Node build tools TypeScript config
└── vite.config.ts              # Vite configuration
```

---

## 4. Routing Architecture

Routing is managed declaratively by `react-router-dom` v7 in [`AppRoutes.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/routes/AppRoutes.tsx):

- **Public Routes**:
  - `/` — Homepage featuring top products and category tiles
  - `/products` — 48-item paginated catalog with search, price, and category filters
  - `/products/:id` — Product detail view with gallery and specifications
  - `/cart` — Shopping cart item management
  - `/wishlist` — Saved favorite items
  - `/checkout` — Shipping and billing address collection
  - `/payment` — Secure payment method execution
  - `/orders`, `/orders/:id`, `/orders/:id/tracking`, `/order-history` — Order tracking
  - `/login`, `/register` — Authentication portal
  - `/support`, `/support/tickets`, `/support/tickets/:id` — Support desk

- **Protected Administrative Routes**:
  - Guarded by [`AdminProtectedRoute.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/routes/AdminProtectedRoute.tsx).
  - Checks `localStorage.getItem("isAdmin") === "true"`. If false, redirects to `/login`.
  - Nested routes: `/admin/dashboard`, `/admin/products`, `/admin/products/add`, `/admin/products/:id/edit`, `/admin/orders`, `/admin/shipments`, `/admin/tickets`, `/admin/customers`, `/admin/inventory`, `/admin/payments`, etc.
  - `/admin/verify-otp` remains public so unauthenticated admins can verify their MFA challenge immediately following credentials check.

---

## 5. Components Architecture

Components follow a modular presentation/container pattern:
- **Atomic Cards**: [`ProductCard.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/ProductCard.tsx) encapsulates stock badge rendering, wishlisting toggle, pricing, image loading errors, and add-to-cart actions.
- **Layout Shell**: [`Navbar.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/layout/Navbar.tsx) and [`Footer.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/layout/Footer.tsx) listen for user authentication events (`userUpdated`) and cart state updates, auto-hiding on admin or authentication views.
- **Skeletons**: Located in `src/components/skeleton/`, including [`ProductCardSkeleton.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/skeleton/ProductCardSkeleton.tsx), [`AdminTableSkeleton.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/skeleton/AdminTableSkeleton.tsx), and [`GlobalFullPageSkeleton.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/components/skeleton/GlobalFullPageSkeleton.tsx).

---

## 6. Services & REST API Integration

All external communication is centralized in `src/services/`:
- **`productService.ts`**:
  - `getProducts(params)`: Calls `GET http://localhost:5133/api/Products` with page, pageSize, search, category, minPrice, maxPrice, minRating, and sortBy.
  - `getProductById(id)`: Calls `GET http://localhost:5133/api/Products/{id}`.
  - `createProduct(dto)`: Calls `POST http://localhost:5133/api/Products`.
  - `updateProduct(id, dto)`: Calls `PUT http://localhost:5133/api/Products/{id}`.
  - `deleteProduct(id)`: Calls `DELETE http://localhost:5133/api/Products/{id}`.
  - `getCategories()`: Calls `GET http://localhost:5133/api/Products/categories`.
- **`authService.ts`**:
  - `loginUser(req)`: Calls `POST http://localhost:5133/api/Auth/login`.
  - `registerUser(req)`: Calls `POST http://localhost:5133/api/Auth/register`.
  - `forgotPassword(id)`: Calls `POST http://localhost:5133/api/Auth/forgot-password`.
  - `verifyResetOtp(id, otp)`: Calls `POST http://localhost:5133/api/Auth/verify-reset-otp`.
  - `resetPassword(token, pwd)`: Calls `POST http://localhost:5133/api/Auth/reset-password`.
- **`orderService.ts` & `paymentService.ts`**:
  - Manages order submission (`POST /api/Orders`), order lookup, and payment verification (`POST /api/Payments/process`).

---

## 7. Authentication & Token Management

- **Storage**: On successful login, the frontend stores `authToken`, `userId`, `userEmail`, `userRole`, and the serialized `user` object in `localStorage`.
- **Event-Driven UI**: Emits `window.dispatchEvent(new Event("userUpdated"))` on login and logout, enabling the navigation bar to update without a full-page reload.
- **Admin Multi-Factor Authentication**:
  - When an admin signs in, the API returns `requiresOtp = true`.
  - Frontend transitions the user to `/admin/verify-otp`.
  - Upon submitting the OTP and solving the CAPTCHA, `isAdmin = true` is set, granting access to protected routes.

---

## 8. Shopping Cart Mechanics

Managed by [`CartContext.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/context/CartContext.tsx):
- **Normalization**: Uses `normalizeProductForCart()` to guarantee stable fields (`id`, `name`, `price`, `stockQuantity`, `images`).
- **Stock Guard**: Prevents adding items that are inactive (`isActive === false`) or out of stock (`stockQuantity <= 0`), capping quantity to `stockQuantity`.
- **Deduplication**: Increments item quantity when adding an existing item rather than inserting duplicate records.
- **Persistence**: Synced automatically to `localStorage` key `nexus_cart`.

---

## 9. Wishlist Mechanics

Managed by [`WishlistContext.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/context/WishlistContext.tsx):
- Persists both product IDs (`nexus_wishlist_ids`) and cached product details (`nexus_wishlist_products`) in `localStorage`.
- Provides instant toggle capability with optimistic heart icon animations on all product cards.

---

## 10. Multi-Tier Product Image Resolution

Handled by [`productImage.ts`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/utils/productImage.ts):
```text
Product Image Request
      ↓
1. product.images[0]  ──(Found?)──► Return Image URL
      ↓ No
2. product.imageUrl   ──(Found?)──► Return Image URL
      ↓ No
3. product.image      ──(Found?)──► Return Image URL
      ↓ No
4. FALLBACK_IMAGE     ─────────────► High-availability CDN Unsplash Placeholder
```
- **Loop Prevention**: `handleImageError` uses `dataset.hasFallback` to prevent recursive re-fetch loops if a remote image fails to load.
- **URL Sanitization**: Strips obsolete local path prefixes (`/src/assets/...`) if inadvertently prepended to an absolute URL.

---

## 11. Zero-Layout-Shift Skeleton Loading

- Pre-renders pulsating skeleton placeholders matching exact card and table dimensions while API calls are in flight.
- Skeletons include: `ProductCardSkeletonGrid`, `ProductDetailsSkeleton`, `AdminTableSkeleton`, `OrdersSkeleton`, and `GlobalFullPageSkeleton`.

---

## 12. Theme Management (Light / Dark)

Managed by [`ThemeContext.tsx`](file:///c:/Users/ATL/Nexus-Business-Hub/frontend/src/context/ThemeContext.tsx):
- Toggles `data-theme="dark"` on `document.documentElement`.
- Uses CSS custom properties defined in `src/styles/theme.css` to transition background colors, surface cards, and typography.
- Preserves user preference in `localStorage` under `nexus_theme`.

---

## 13. Environment & API URL Configuration

API endpoints default to the ASP.NET Core Web API:
- Base API URL: `http://localhost:5133` (as defined in `productService.ts` and `authService.ts`)
- To adjust for production, set the environment variable `VITE_API_URL` in `.env.production`.

---

## 14. How to Run Frontend

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Execution
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server with Hot Module Replacement (HMR)
npm run dev
```

The frontend will be accessible at:
```text
http://localhost:5173
```

### Production Build
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```
