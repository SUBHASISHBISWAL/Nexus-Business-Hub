import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AdminTableSkeleton } from "../../../components/skeleton";
import { ErrorState } from "../../../components/common/ErrorState";
import { getProducts } from "../../../services/productService";
import { useInitialLoading } from "../../../context/InitialLoadingContext";

import "./AdminProducts.css";

const PRODUCTS_STORAGE_KEY = "nexus_business_products";
const ITEMS_PER_PAGE = 8;

type ProductStatus =
  | "Active"
  | "Draft"
  | "Inactive"
  | "Out of Stock";

type ProductImage = {
  src: string;
  type: "upload" | "url";
};

type Product = {
  id: string | number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  updated: string;
  shortDescription?: string;
  description?: string;
  specifications?: string;
  images?: ProductImage[];
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Business Laptop Pro",
    sku: "NX-LAP-001",
    category: "Electronics",
    price: 55000,
    stock: 24,
    status: "Active",
    updated: "10 Sep 2026",
    images: [],
  },
  {
    id: 2,
    name: "Enterprise Smartphone",
    sku: "NX-PHN-002",
    category: "Electronics",
    price: 25000,
    stock: 36,
    status: "Active",
    updated: "10 Sep 2026",
    images: [],
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    sku: "NX-CHR-003",
    category: "Hardware",
    price: 8000,
    stock: 18,
    status: "Active",
    updated: "09 Sep 2026",
    images: [],
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    sku: "NX-KBD-004",
    category: "Accessories",
    price: 1500,
    stock: 42,
    status: "Active",
    updated: "08 Sep 2026",
    images: [],
  },
  {
    id: 5,
    name: "Wireless Mouse Pro",
    sku: "NX-MOU-005",
    category: "Accessories",
    price: 1200,
    stock: 55,
    status: "Active",
    updated: "08 Sep 2026",
    images: [],
  },
  {
    id: 6,
    name: "24 Inch Business Monitor",
    sku: "NX-MON-006",
    category: "Electronics",
    price: 14500,
    stock: 20,
    status: "Active",
    updated: "07 Sep 2026",
    images: [],
  },
  {
    id: 7,
    name: "USB-C Docking Station",
    sku: "NX-DCK-007",
    category: "Accessories",
    price: 6500,
    stock: 15,
    status: "Active",
    updated: "07 Sep 2026",
    images: [],
  },
  {
    id: 8,
    name: "Enterprise Wi-Fi Router",
    sku: "NX-RTR-008",
    category: "Hardware",
    price: 7200,
    stock: 12,
    status: "Active",
    updated: "06 Sep 2026",
    images: [],
  },
  {
    id: 9,
    name: "Business Antivirus License",
    sku: "NX-AV-009",
    category: "Software",
    price: 3200,
    stock: 100,
    status: "Active",
    updated: "06 Sep 2026",
    images: [],
  },
  {
    id: 10,
    name: "Cloud Backup License",
    sku: "NX-CLD-010",
    category: "Software",
    price: 4500,
    stock: 75,
    status: "Active",
    updated: "05 Sep 2026",
    images: [],
  },
  {
    id: 11,
    name: "Office Productivity Suite",
    sku: "NX-OFF-011",
    category: "Software",
    price: 6800,
    stock: 48,
    status: "Active",
    updated: "05 Sep 2026",
    images: [],
  },
  {
    id: 12,
    name: "Enterprise SSD 1TB",
    sku: "NX-SSD-012",
    category: "Hardware",
    price: 8900,
    stock: 10,
    status: "Active",
    updated: "04 Sep 2026",
    images: [],
  },
  {
    id: 13,
    name: "Network Security Firewall",
    sku: "NX-FWL-013",
    category: "Hardware",
    price: 18500,
    stock: 6,
    status: "Draft",
    updated: "03 Sep 2026",
    images: [],
  },
  {
    id: 14,
    name: "Project Management Software",
    sku: "NX-PMS-014",
    category: "Software",
    price: 5600,
    stock: 0,
    status: "Out of Stock",
    updated: "02 Sep 2026",
    images: [],
  },
];

function AdminProducts() {
  const navigate = useNavigate();
  const { markAppReady } = useInitialLoading();

  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null);

  const [deleteSuccess, setDeleteSuccess] =
    useState(false);

  /*
   * LOAD PRODUCTS
   *
   * Priority:
   * 1. LocalStorage products
   * 2. Backend API products
   * 3. Initial demo products
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const storedProducts =
        localStorage.getItem(PRODUCTS_STORAGE_KEY);

      if (storedProducts) {
        try {
          const parsedProducts: Product[] =
            JSON.parse(storedProducts);

          if (
            Array.isArray(parsedProducts) &&
            parsedProducts.length > 0
          ) {
            setProducts(parsedProducts);
            setLoading(false);
            markAppReady();
            return;
          }
        } catch (storageError) {
          console.error(
            "Unable to parse local products:",
            storageError
          );
        }
      }

      const apiData = await getProducts({ all: true, pageSize: 1000 });
      const productList = Array.isArray(apiData) ? apiData : apiData?.items ?? [];

      if (productList.length > 0) {
        const mappedProducts: Product[] =
          productList.map((product) => ({
            id: product.id,
            name: product.name,
            sku: `NEX-${
              product.category?.substring(0, 3).toUpperCase() ||
              "GEN"
            }-${String(product.id).padStart(3, "0")}`,
            category: product.category || "Electronics",
            price: Number(product.price) || 0,
            stock: product.stockQuantity ?? 25,
            status:
              product.isActive === false
                ? "Inactive"
                : "Active",
            updated: "22 Sep 2026",
            images: [],
          }));

        setProducts(mappedProducts);

        localStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(mappedProducts)
        );
      } else {
        setProducts(initialProducts);
      }
    } catch (err) {
      console.error(
        "Failed to load admin products:",
        err
      );

      setError(
        "Unable to load products right now. Please try again."
      );

      setProducts(initialProducts);
    } finally {
      setLoading(false);
      markAppReady();
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /*
   * SAVE PRODUCTS
   */
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
      );
    }
  }, [products, loading]);

  /*
   * CATEGORIES
   */
  const categories = useMemo(() => {
    const categorySet = new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    );

    return Array.from(categorySet);
  }, [products]);

  /*
   * FILTER PRODUCTS
   */
  const filteredProducts = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.sku
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        product.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
  ]);

  /*
   * PAGINATION
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex + ITEMS_PER_PAGE;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      endIndex
    );

  /*
   * SUMMARY
   */
  const totalProducts = products.length;

  const activeProducts =
    products.filter(
      (product) =>
        product.status === "Active"
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        product.status === "Out of Stock" ||
        product.stock === 0
    ).length;

  const draftProducts =
    products.filter(
      (product) =>
        product.status === "Draft"
    ).length;

  /*
   * HANDLERS
   */
  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (
    value: string
  ) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    value: string
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const handleViewProduct = (
    productId: string | number
  ) => {
    navigate(
      `/admin/products/${productId}`
    );
  };

  const handleEditProduct = (
    productId: string | number
  ) => {
    navigate(
      `/admin/products/${productId}/edit`
    );
  };

  const handleDeleteClick = (
    product: Product
  ) => {
    setDeleteProduct(product);
  };

  const handleDeleteCancel = () => {
    setDeleteProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteProduct) {
      return;
    }

    const updatedProducts =
      products.filter(
        (product) =>
          String(product.id) !==
          String(deleteProduct.id)
      );

    setProducts(updatedProducts);

    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    setDeleteProduct(null);
    setDeleteSuccess(true);

    const newTotalPages = Math.max(
      1,
      Math.ceil(
        updatedProducts.length /
          ITEMS_PER_PAGE
      )
    );

    setCurrentPage((previousPage) =>
      Math.min(
        previousPage,
        newTotalPages
      )
    );

    window.setTimeout(() => {
      setDeleteSuccess(false);
    }, 2500);
  };

  const getStatusClass = (
    status: ProductStatus
  ) => {
    switch (status) {
      case "Active":
        return "active";

      case "Draft":
        return "draft";

      case "Inactive":
        return "inactive";

      case "Out of Stock":
        return "out-of-stock";

      default:
        return "";
    }
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const formatPrice = (
    price: number
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(price);
  };

  return (
    <div className="nx-admin-products-page">
      {/* HEADER */}
      <div className="nx-admin-page-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage your product catalog,
            inventory and product information.
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

      {/* SUCCESS MESSAGE */}
      {deleteSuccess && (
        <div className="nx-admin-success-message">
          <i className="bi bi-check-circle-fill" />
          <span>
            Product deleted successfully.
          </span>
        </div>
      )}

      {/* SUMMARY */}
      <div className="nx-admin-product-summary">
        <div className="nx-admin-summary-card">
          <div className="nx-admin-summary-icon">
            <i className="bi bi-box-seam" />
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {totalProducts}
            </strong>
          </div>
        </div>

        <div className="nx-admin-summary-card">
          <div className="nx-admin-summary-icon">
            <i className="bi bi-check-circle" />
          </div>

          <div>
            <span>Active Products</span>
            <strong>
              {activeProducts}
            </strong>
          </div>
        </div>

        <div className="nx-admin-summary-card">
          <div className="nx-admin-summary-icon">
            <i className="bi bi-file-earmark" />
          </div>

          <div>
            <span>Draft Products</span>
            <strong>
              {draftProducts}
            </strong>
          </div>
        </div>

        <div className="nx-admin-summary-card">
          <div className="nx-admin-summary-icon">
            <i className="bi bi-exclamation-circle" />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {outOfStockProducts}
            </strong>
          </div>
        </div>
      </div>

      {/* PRODUCTS CARD */}
      <div className="nx-admin-products-card">
        {/* TOOLBAR */}
        <div className="nx-admin-products-toolbar">
          <div className="nx-admin-search-box">
            <i className="bi bi-search" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value
                )
              }
              placeholder="Search products or SKU..."
            />

            {search && (
              <button
                type="button"
                className="nx-admin-search-clear"
                onClick={() =>
                  handleSearchChange("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="nx-admin-filter-group">
            <select
              value={categoryFilter}
              onChange={(event) =>
                handleCategoryChange(
                  event.target.value
                )
              }
              aria-label="Filter by category"
            >
              <option value="All Categories">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
              aria-label="Filter by status"
            >
              <option value="All Status">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Draft">
                Draft
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>

            {(search ||
              categoryFilter !==
                "All Categories" ||
              statusFilter !==
                "All Status") && (
              <button
                type="button"
                className="nx-admin-clear-filter"
                onClick={
                  handleClearFilters
                }
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* RESULT INFO */}
        <div className="nx-admin-result-info">
          <span>
            Showing{" "}
            {filteredProducts.length === 0
              ? 0
              : startIndex + 1}
            -
            {Math.min(
              endIndex,
              filteredProducts.length
            )}{" "}
            of{" "}
            {filteredProducts.length}{" "}
            products
          </span>
        </div>

        {/* ERROR */}
        {!loading && error && (
          <ErrorState
            title="Unable to load content"
            message={error}
            onRetry={loadProducts}
          />
        )}

        {/* TABLE */}
        <div className="nx-admin-products-table-wrapper">
          <table className="nx-admin-products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>UPDATED</th>
                <th className="nx-action-column">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <AdminTableSkeleton
                  columns={8}
                  rows={ITEMS_PER_PAGE}
                />
              ) : paginatedProducts.length >
                0 ? (
                paginatedProducts.map(
                  (product) => (
                    <tr
                      key={product.id}
                    >
                      <td>
                        <div className="nx-admin-product-cell">
                          <div className="nx-admin-product-image">
                            {product.images?.[0]
                              ?.src ? (
                              <img
                                src={
                                  product
                                    .images[0]
                                    .src
                                }
                                alt={
                                  product.name
                                }
                              />
                            ) : (
                              <i className="bi bi-box-seam" />
                            )}
                          </div>

                          <div className="nx-admin-product-info">
                            <strong>
                              {product.name}
                            </strong>

                            {product.shortDescription && (
                              <span>
                                {
                                  product.shortDescription
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="nx-admin-sku">
                          {product.sku}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-category">
                          {product.category}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-price">
                          {formatPrice(
                            Number(
                              product.price
                            ) || 0
                          )}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`nx-admin-stock ${
                            Number(product.stock) ===
                            0
                              ? "empty"
                              : ""
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`nx-admin-status ${getStatusClass(
                            product.status
                          )}`}
                        >
                          <span className="nx-admin-status-dot" />
                          {product.status}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-updated">
                          {product.updated ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <div className="nx-admin-product-actions">
                          <button
                            type="button"
                            className="nx-admin-action-button view"
                            onClick={() =>
                              handleViewProduct(
                                product.id
                              )
                            }
                            title="View Product"
                            aria-label="View Product"
                          >
                            <i className="bi bi-eye" />
                          </button>

                          <button
                            type="button"
                            className="nx-admin-action-button edit"
                            onClick={() =>
                              handleEditProduct(
                                product.id
                              )
                            }
                            title="Edit Product"
                            aria-label="Edit Product"
                          >
                            <i className="bi bi-pencil" />
                          </button>

                          <button
                            type="button"
                            className="nx-admin-action-button delete"
                            onClick={() =>
                              handleDeleteClick(
                                product
                              )
                            }
                            title="Delete Product"
                            aria-label="Delete Product"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="nx-admin-empty-cell"
                  >
                    <div className="nx-admin-empty-state">
                      <div className="nx-admin-empty-icon">
                        <i className="bi bi-box-seam" />
                      </div>

                      <h3>
                        No products found
                      </h3>

                      <p>
                        Try changing your
                        search or filter
                        criteria.
                      </p>

                      {(search ||
                        categoryFilter !==
                          "All Categories" ||
                        statusFilter !==
                          "All Status") && (
                        <button
                          type="button"
                          onClick={
                            handleClearFilters
                          }
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading &&
          filteredProducts.length > 0 &&
          totalPages > 1 && (
            <div className="nx-admin-pagination">
              <button
                type="button"
                className="nx-admin-pagination-button"
                disabled={
                  safeCurrentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.max(
                        1,
                        previous - 1
                      )
                  )
                }
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
              </button>

              <div className="nx-admin-page-numbers">
                {pageNumbers.map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      className={`nx-admin-page-number ${
                        safeCurrentPage ===
                        page
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="nx-admin-pagination-button"
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (previous) =>
                      Math.min(
                        totalPages,
                        previous + 1
                      )
                  )
                }
                aria-label="Next page"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
      </div>

      {/* DELETE MODAL */}
      {deleteProduct && (
        <div
          className="nx-admin-modal-backdrop"
          onClick={handleDeleteCancel}
        >
          <div
            className="nx-admin-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="nx-admin-delete-icon">
              <i className="bi bi-trash3" />
            </div>

            <h2>
              Delete Product?
            </h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {deleteProduct.name}
              </strong>
              ? This action cannot be
              undone.
            </p>

            <div className="nx-admin-delete-actions">
              <button
                type="button"
                className="nx-admin-delete-cancel"
                onClick={
                  handleDeleteCancel
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="nx-admin-delete-confirm"
                onClick={
                  handleDeleteConfirm
                }
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;