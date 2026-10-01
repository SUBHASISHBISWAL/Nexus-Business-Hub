import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  type:
    | "Order"
    | "Product"
    | "Shipment"
    | "Payment"
    | "Customer"
    | "Ticket"
    | "Page";
  icon: string;
  route: string;
};

type StoredProduct = {
  id: string | number;
  name: string;
  sku: string;
  category: string;
  price: string | number;
  stock: string | number;
  status: string;
  updated?: string;
};

const PRODUCTS_STORAGE_KEY = "nexus_business_products";

/* ==========================================
   STATIC ADMIN SEARCH DATA
   ========================================== */

const staticSearchItems: SearchItem[] = [
  // ---------- MODULES ----------
  {
    id: "page-dashboard",
    title: "Dashboard",
    subtitle: "Admin dashboard and business overview",
    type: "Page",
    icon: "bi-grid-1x2",
    route: "/admin/dashboard",
  },
  {
    id: "page-products",
    title: "Products",
    subtitle: "Manage product catalog and inventory",
    type: "Page",
    icon: "bi-box-seam",
    route: "/admin/products",
  },
  {
    id: "page-orders",
    title: "Orders",
    subtitle: "Manage customer orders and order status",
    type: "Page",
    icon: "bi-receipt",
    route: "/admin/orders",
  },
  {
    id: "page-customers",
    title: "Customers",
    subtitle: "Manage customer information and orders",
    type: "Page",
    icon: "bi-people",
    route: "/admin/customers",
  },
  {
    id: "page-payments",
    title: "Payments",
    subtitle: "View and manage payment transactions",
    type: "Page",
    icon: "bi-credit-card",
    route: "/admin/payments",
  },
  {
    id: "page-shipments",
    title: "Shipments",
    subtitle: "Manage shipments and tracking information",
    type: "Page",
    icon: "bi-truck",
    route: "/admin/shipments",
  },
  {
    id: "page-inventory",
    title: "Inventory",
    subtitle: "Manage inventory and stock levels",
    type: "Page",
    icon: "bi-boxes",
    route: "/admin/inventory",
  },
  {
    id: "page-returns",
    title: "Returns & Refunds",
    subtitle: "Manage product returns and refunds",
    type: "Page",
    icon: "bi-arrow-return-left",
    route: "/admin/returns",
  },
  {
    id: "page-support",
    title: "Support",
    subtitle: "Manage customer support tickets",
    type: "Page",
    icon: "bi-headset",
    route: "/admin/tickets",
  },
  {
    id: "page-administrators",
    title: "Administrators",
    subtitle: "Manage admin users and access",
    type: "Page",
    icon: "bi-people",
    route: "/admin/administrators",
  },
  {
    id: "page-settings",
    title: "Settings",
    subtitle: "Manage store and admin settings",
    type: "Page",
    icon: "bi-gear",
    route: "/admin/settings",
  },

  // ---------- SAMPLE ORDERS ----------
  {
    id: "ORD-10284",
    title: "ORD-10284",
    subtitle: "Rahul Sharma · ₹57,499 · Processing",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10284",
  },
  {
    id: "ORD-10283",
    title: "ORD-10283",
    subtitle: "Priya Das · ₹78,500 · Shipped",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10283",
  },
  {
    id: "ORD-10282",
    title: "ORD-10282",
    subtitle: "Amit Kumar · ₹42,150 · Delivered",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10282",
  },

  // ---------- SAMPLE SHIPMENT ----------
  {
    id: "SHP-5001",
    title: "SHP-5001",
    subtitle: "ORD-10284 · BlueDart · In Transit",
    type: "Shipment",
    icon: "bi-truck",
    route: "/admin/shipments/SHP-5001",
  },

  // ---------- SAMPLE PAYMENT ----------
  {
    id: "PAY-1001",
    title: "PAY-1001",
    subtitle: "ORD-10284 · ₹57,499 · Paid",
    type: "Payment",
    icon: "bi-credit-card",
    route: "/admin/payments",
  },

  // ---------- SAMPLE CUSTOMERS ----------
  {
    id: "customer-rahul",
    title: "Rahul Sharma",
    subtitle: "Customer · Orders and profile",
    type: "Customer",
    icon: "bi-person",
    route: "/admin/customers",
  },
  {
    id: "customer-priya",
    title: "Priya Das",
    subtitle: "Customer · Orders and profile",
    type: "Customer",
    icon: "bi-person",
    route: "/admin/customers",
  },

  // ---------- SAMPLE TICKET ----------
  {
    id: "TKT-1001",
    title: "TKT-1001",
    subtitle: "Payment issue · Open",
    type: "Ticket",
    icon: "bi-headset",
    route: "/admin/tickets/TKT-1001",
  },
];

function AdminGlobalSearch() {
  const navigate = useNavigate();

  const searchRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [products, setProducts] =
    useState<StoredProduct[]>([]);

  /* ==========================================
     LOAD PRODUCTS FROM LOCAL STORAGE
     ========================================== */

  useEffect(() => {
    const loadProducts = () => {
      const storedProducts =
        localStorage.getItem(
          PRODUCTS_STORAGE_KEY
        );

      if (!storedProducts) {
        setProducts([]);
        return;
      }

      try {
        const parsed =
          JSON.parse(storedProducts);

        if (Array.isArray(parsed)) {
          setProducts(parsed);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Unable to load products for global search:",
          error
        );

        setProducts([]);
      }
    };

    loadProducts();

    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "nx-products-updated",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "nx-products-updated",
        handleStorageChange
      );
    };
  }, []);

  /* ==========================================
     CONVERT PRODUCTS INTO SEARCH ITEMS
     ========================================== */

  const productSearchItems =
    useMemo<SearchItem[]>(() => {
      return products.map((product) => ({
        id: `product-${product.id}`,
        title: product.name,
        subtitle: `${product.sku} · ${product.category} · ₹${Number(
          product.price
        ).toLocaleString("en-IN")}`,
        type: "Product",
        icon: "bi-box-seam",
        route: `/admin/products/${product.id}`,
      }));
    }, [products]);

  /* ==========================================
     ALL SEARCH DATA
     ========================================== */

  const allSearchData = useMemo(
    () => [
      ...staticSearchItems,
      ...productSearchItems,
    ],
    [productSearchItems]
  );

  /* ==========================================
     FILTER SEARCH RESULTS
     ========================================== */

  const filteredResults = useMemo(() => {
    const searchValue =
      query.trim().toLowerCase();

    if (!searchValue) {
      return [];
    }

    return allSearchData.filter((item) => {
      const searchableText = [
        item.id,
        item.title,
        item.subtitle,
        item.type,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        searchValue
      );
    });
  }, [query, allSearchData]);

  /* ==========================================
     CTRL + K
     ========================================== */

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  /* ==========================================
     OUTSIDE CLICK
     ========================================== */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* ==========================================
     RESET SELECTED RESULT
     ========================================== */

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  /* ==========================================
     OPEN RESULT
     ========================================== */

  const openResult = (
    item: SearchItem
  ) => {
    /*
     * Send route to AdminLayout.
     * AdminLayout will:
     * - open collapsed sidebar
     * - open correct section
     */
    window.dispatchEvent(
      new CustomEvent(
        "nx-admin-open-sidebar",
        {
          detail: {
            route: item.route,
          },
        }
      )
    );

    setQuery("");
    setOpen(false);

    navigate(item.route);
  };

  /* ==========================================
     FALLBACK MODULE SEARCH
     ========================================== */

  const openModuleFromQuery = (
    value: string
  ) => {
    const moduleMap: Array<{
      keywords: string[];
      route: string;
    }> = [
      {
        keywords: [
          "dashboard",
          "home",
          "overview",
        ],
        route: "/admin/dashboard",
      },
      {
        keywords: [
          "product",
          "products",
          "sku",
          "catalog",
        ],
        route: "/admin/products",
      },
      {
        keywords: [
          "order",
          "orders",
        ],
        route: "/admin/orders",
      },
      {
        keywords: [
          "customer",
          "customers",
          "client",
        ],
        route: "/admin/customers",
      },
      {
        keywords: [
          "payment",
          "payments",
          "transaction",
        ],
        route: "/admin/payments",
      },
      {
        keywords: [
          "shipment",
          "shipments",
          "tracking",
          "delivery",
        ],
        route: "/admin/shipments",
      },
      {
        keywords: [
          "inventory",
          "stock",
        ],
        route: "/admin/inventory",
      },
      {
        keywords: [
          "return",
          "returns",
          "refund",
          "refunds",
        ],
        route: "/admin/returns",
      },
      {
        keywords: [
          "ticket",
          "tickets",
          "support",
        ],
        route: "/admin/tickets",
      },
      {
        keywords: [
          "administrator",
          "administrators",
          "admin",
        ],
        route: "/admin/administrators",
      },
      {
        keywords: [
          "setting",
          "settings",
        ],
        route: "/admin/settings",
      },
    ];

    const matchedModule =
      moduleMap.find((module) =>
        module.keywords.some(
          (keyword) =>
            value.includes(keyword)
        )
      );

    if (!matchedModule) {
      return false;
    }

    window.dispatchEvent(
      new CustomEvent(
        "nx-admin-open-sidebar",
        {
          detail: {
            route: matchedModule.route,
          },
        }
      )
    );

    setQuery("");
    setOpen(false);

    navigate(matchedModule.route);

    return true;
  };

  /* ==========================================
     KEYBOARD NAVIGATION
     ========================================== */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (
      event.key === "ArrowDown"
    ) {
      if (
        filteredResults.length === 0
      ) {
        return;
      }

      event.preventDefault();

      setSelectedIndex(
        (previous) =>
          previous <
          filteredResults.length - 1
            ? previous + 1
            : 0
      );

      return;
    }

    if (
      event.key === "ArrowUp"
    ) {
      if (
        filteredResults.length === 0
      ) {
        return;
      }

      event.preventDefault();

      setSelectedIndex(
        (previous) =>
          previous > 0
            ? previous - 1
            : filteredResults.length - 1
      );

      return;
    }

    if (
      event.key === "Enter" &&
      query.trim()
    ) {
      event.preventDefault();

      if (
        filteredResults.length > 0
      ) {
        const selected =
          filteredResults[
            selectedIndex
          ];

        if (selected) {
          openResult(selected);
          return;
        }
      }

      openModuleFromQuery(
        query.trim().toLowerCase()
      );
    }
  };

  /* ==========================================
     GROUP RESULTS
     ========================================== */

  const groupedResults =
    filteredResults.reduce<
      Record<string, SearchItem[]>
    >((groups, item) => {
      if (!groups[item.type]) {
        groups[item.type] = [];
      }

      groups[item.type].push(item);

      return groups;
    }, {});

  return (
    <div
      ref={searchRef}
      className="nx-admin-global-search"
    >
      {/* ================= SEARCH INPUT ================= */}

      <div className="nx-admin-search">
        <i className="bi bi-search" />

        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search admin panel..."
          aria-label="Search admin panel"
          onFocus={() => setOpen(true)}
          onChange={(event) =>
            setQuery(
              event.target.value
            )
          }
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            type="button"
            className="nx-admin-search-clear"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <i className="bi bi-x" />
          </button>
        )}

        {!query && (
          <span className="nx-admin-search-shortcut">
            Ctrl K
          </span>
        )}
      </div>

      {/* ================= SEARCH RESULTS ================= */}

      {open && query.trim() && (
        <div className="nx-admin-search-results">
          {filteredResults.length >
          0 ? (
            Object.entries(
              groupedResults
            ).map(
              ([type, items]) => (
                <div
                  key={type}
                  className="nx-admin-search-group"
                >
                  <div className="nx-admin-search-group-title">
                    {type === "Page"
                      ? "Modules"
                      : `${type}s`}
                  </div>

                  {items.map(
                    (item) => {
                      const globalIndex =
                        filteredResults.findIndex(
                          (result) =>
                            result.id ===
                            item.id
                        );

                      return (
                        <button
                          type="button"
                          key={item.id}
                          className={`nx-admin-search-result ${
                            globalIndex ===
                            selectedIndex
                              ? "selected"
                              : ""
                          }`}
                          onMouseEnter={() =>
                            setSelectedIndex(
                              globalIndex
                            )
                          }
                          onClick={() =>
                            openResult(
                              item
                            )
                          }
                        >
                          <span className="nx-admin-search-result-icon">
                            <i
                              className={`bi ${item.icon}`}
                            />
                          </span>

                          <span className="nx-admin-search-result-content">
                            <strong>
                              {
                                item.title
                              }
                            </strong>

                            <small>
                              {
                                item.subtitle
                              }
                            </small>
                          </span>

                          <i className="bi bi-arrow-up-right" />
                        </button>
                      );
                    }
                  )}
                </div>
              )
            )
          ) : (
            <div className="nx-admin-search-empty">
              <div className="nx-admin-search-empty-icon">
                <i className="bi bi-search" />
              </div>

              <strong>
                No results found
              </strong>

              <span>
                Try searching products,
                orders, customers,
                shipments, payments,
                tickets or admin
                modules.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminGlobalSearch;