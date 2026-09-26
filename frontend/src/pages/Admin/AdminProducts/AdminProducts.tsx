import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";

type ProductStatus = "Active" | "Draft" | "Out of Stock";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  updated: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Smart IoT Gateway Pro",
    sku: "NEX-IOT-001",
    category: "Electronics",
    price: 24999,
    stock: 42,
    status: "Active",
    updated: "22 Sep 2026",
  },
  {
    id: 2,
    name: "EdgeCompute R500",
    sku: "NEX-HW-002",
    category: "Hardware",
    price: 78500,
    stock: 18,
    status: "Active",
    updated: "22 Sep 2026",
  },
  {
    id: 3,
    name: "NexusOS Fleet Control",
    sku: "NEX-SW-003",
    category: "Software",
    price: 12400,
    stock: 0,
    status: "Out of Stock",
    updated: "21 Sep 2026",
  },
  {
    id: 4,
    name: "Rugged M12 Sensor Cable",
    sku: "NEX-ACC-004",
    category: "Accessories",
    price: 2150,
    stock: 76,
    status: "Active",
    updated: "21 Sep 2026",
  },
  {
    id: 5,
    name: "Thermal Vision Array",
    sku: "NEX-IOT-005",
    category: "Electronics",
    price: 46800,
    stock: 24,
    status: "Active",
    updated: "20 Sep 2026",
  },
  {
    id: 6,
    name: "Nexus Rail Mount Kit",
    sku: "NEX-ACC-006",
    category: "Accessories",
    price: 1890,
    stock: 58,
    status: "Active",
    updated: "20 Sep 2026",
  },
  {
    id: 7,
    name: "Industrial PoE Switch 8P",
    sku: "NEX-NET-007",
    category: "Hardware",
    price: 32800,
    stock: 31,
    status: "Active",
    updated: "19 Sep 2026",
  },
  {
    id: 8,
    name: "SignalBridge CAN Module",
    sku: "NEX-MOD-008",
    category: "Electronics",
    price: 5799,
    stock: 0,
    status: "Draft",
    updated: "18 Sep 2026",
  },
  {
    id: 9,
    name: "PredictiveOps Studio",
    sku: "NEX-SW-009",
    category: "Software",
    price: 18900,
    stock: 14,
    status: "Active",
    updated: "18 Sep 2026",
  },
  {
    id: 10,
    name: "NX-12 Embedded Controller",
    sku: "NEX-HW-010",
    category: "Hardware",
    price: 44200,
    stock: 9,
    status: "Active",
    updated: "17 Sep 2026",
  },
  {
    id: 11,
    name: "SecureLink VPN Gateway",
    sku: "NEX-SW-011",
    category: "Software",
    price: 9600,
    stock: 21,
    status: "Active",
    updated: "17 Sep 2026",
  },
  {
    id: 12,
    name: "Nexus Enterprise HSM Rack",
    sku: "NEX-HSM-012",
    category: "Hardware",
    price: 412000,
    stock: 3,
    status: "Draft",
    updated: "16 Sep 2026",
  },
];

const categories = [
  "All Categories",
  "Electronics",
  "Hardware",
  "Software",
  "Accessories",
];

const statuses = [
  "All Status",
  "Active",
  "Draft",
  "Out of Stock",
];

const ITEMS_PER_PAGE = 8;

function AdminProducts() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" ||
        product.category === category;

      const matchesStatus =
        status === "All Status" ||
        product.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [search, category, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const resetPage = () => {
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getStockClass = (stock: number) => {
    if (stock === 0) {
      return "out";
    }

    if (stock <= 10) {
      return "low";
    }

    return "good";
  };

  return (
    <div className="nx-admin-products">

      {/* PAGE HEADER */}
      <div className="nx-admin-products-header">
        <div>
          <div className="nx-admin-breadcrumb">
            <span>Commerce</span>
            <i className="bi bi-chevron-right" />
            <strong>Products</strong>
          </div>

          <h1>Products</h1>

          <p>
            Manage your product catalog, inventory and
            product information.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-primary-button"
          onClick={() =>
            navigate("/admin/products/add")
          }
        >
          <i className="bi bi-plus-lg" />
          Add Product
        </button>
      </div>

      {/* SUMMARY */}
      <div className="nx-admin-products-summary">
        <div className="nx-admin-product-summary-box">
          <span>Total Products</span>
          <strong>{products.length}</strong>
        </div>

        <div className="nx-admin-product-summary-box">
          <span>Active</span>
          <strong>
            {
              products.filter(
                (product) => product.status === "Active"
              ).length
            }
          </strong>
        </div>

        <div className="nx-admin-product-summary-box">
          <span>Draft</span>
          <strong>
            {
              products.filter(
                (product) => product.status === "Draft"
              ).length
            }
          </strong>
        </div>

        <div className="nx-admin-product-summary-box">
          <span>Out of Stock</span>
          <strong>
            {
              products.filter(
                (product) =>
                  product.status === "Out of Stock"
              ).length
            }
          </strong>
        </div>
      </div>

      {/* PRODUCT CARD */}
      <section className="nx-admin-card nx-admin-products-card">

        {/* TOOLBAR */}
        <div className="nx-admin-products-toolbar">

          <div className="nx-admin-products-search">
            <i className="bi bi-search" />

            <input
              type="search"
              value={search}
              placeholder="Search products, SKU..."
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  resetPage();
                }}
              >
                <i className="bi bi-x-lg" />
              </button>
            )}
          </div>

          <div className="nx-admin-product-filters">

            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                resetPage();
              }}
              aria-label="Filter by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                resetPage();
              }}
              aria-label="Filter by status"
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* RESULTS INFO */}
        <div className="nx-admin-products-result-info">
          <span>
            Showing{" "}
            <strong>
              {filteredProducts.length === 0
                ? 0
                : startIndex + 1}
              -
              {Math.min(
                startIndex + ITEMS_PER_PAGE,
                filteredProducts.length
              )}
            </strong>{" "}
            of{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            products
          </span>

          {(search ||
            category !== "All Categories" ||
            status !== "All Status") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setStatus("All Status");
                resetPage();
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="nx-admin-products-table-wrapper">
          <table className="nx-admin-products-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>

                  {/* PRODUCT */}
                  <td>
                    <div className="nx-admin-product-cell">
                      <div className="nx-admin-product-image">
                        <i className="bi bi-box-seam" />
                      </div>

                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          Product ID #{product.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td>
                    <span className="nx-admin-product-sku">
                      {product.sku}
                    </span>
                  </td>

                  {/* CATEGORY */}
                  <td>
                    <span className="nx-admin-product-category">
                      {product.category}
                    </span>
                  </td>

                  {/* PRICE */}
                  <td>
                    <strong className="nx-admin-product-price">
                      {formatPrice(product.price)}
                    </strong>
                  </td>

                  {/* STOCK */}
                  <td>
                    <span
                      className={`nx-admin-product-stock ${getStockClass(
                        product.stock
                      )}`}
                    >
                      {product.stock === 0
                        ? "Out of stock"
                        : `${product.stock} units`}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`nx-admin-product-status ${product.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <span />
                      {product.status}
                    </span>
                  </td>

                  {/* UPDATED */}
                  <td>
                    <span className="nx-admin-product-date">
                      {product.updated}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <div className="nx-admin-product-actions">

                      <button
                        type="button"
                        title="View product"
                        aria-label={`View ${product.name}`}
                        onClick={() =>
                          navigate(
                            `/admin/products/${product.id}`
                          )
                        }
                      >
                        <i className="bi bi-eye" />
                      </button>

                      <button
                        type="button"
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        onClick={() =>
                          navigate(
                            `/admin/products/${product.id}/edit`
                          )
                        }
                      >
                        <i className="bi bi-pencil" />
                      </button>

                      <button
                        type="button"
                        title="More options"
                        aria-label={`More options for ${product.name}`}
                      >
                        <i className="bi bi-three-dots" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {visibleProducts.length === 0 && (
          <div className="nx-admin-products-empty">
            <div>
              <i className="bi bi-search" />
            </div>

            <h3>No products found</h3>

            <p>
              Try changing your search or filter
              criteria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setStatus("All Status");
                resetPage();
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {filteredProducts.length > 0 && (
          <div className="nx-admin-products-pagination">

            <span>
              Page {safeCurrentPage} of {totalPages}
            </span>

            <div className="nx-admin-pagination-buttons">

              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => Math.max(1, page - 1)
                  )
                }
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    safeCurrentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  safeCurrentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(totalPages, page + 1)
                  )
                }
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>

            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default AdminProducts;