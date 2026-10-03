import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AdminTableSkeleton } from "../../../components/skeleton";
import { ErrorState } from "../../../components/common/ErrorState";
import {
  deleteProduct as apiDeleteProduct,
  getCategories,
  getProducts,
} from "../../../services/productService";
import { useInitialLoading } from "../../../context/InitialLoadingContext";

import "./AdminProducts.css";

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

function AdminProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { markAppReady } = useInitialLoading();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productAddedSuccess, setProductAddedSuccess] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [summary, setSummary] = useState({
    total: 0,
    active: 0,
    draft: 0,
    outOfStock: 0,
  });

  const [categories, setCategories] = useState<string[]>([]);

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Load all categories on mount for the category dropdown
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((cats) => {
        if (isMounted && Array.isArray(cats)) {
          setCategories(cats.map((c) => c.name));
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * LOAD PRODUCTS FROM SQL SERVER API WITH SERVER-SIDE PAGINATION
   */
  const loadProducts = useCallback(
    async (
      pageToLoad: number,
      searchVal = debouncedSearch,
      categoryVal = categoryFilter,
      statusVal = statusFilter
    ) => {
      try {
        setLoading(true);
        setError("");

        const apiData = await getProducts({
          page: pageToLoad,
          pageSize: ITEMS_PER_PAGE,
          includeInactive: true,
          sortBy: "newest",
          search: searchVal.trim() || undefined,
          category: categoryVal !== "All Categories" ? categoryVal : undefined,
          status: statusVal !== "All Status" ? statusVal : undefined,
        });

        const productList = Array.isArray(apiData)
          ? apiData
          : apiData?.items ?? [];

        const mappedProducts: Product[] = productList.map((product) => {
          const prodImg = product.imageUrl || product.image;
          const imagesList: ProductImage[] = [];
          if (product.images && product.images.length > 0) {
            product.images.forEach((img: string) =>
              imagesList.push({ src: img, type: "url" })
            );
          } else if (prodImg) {
            imagesList.push({ src: prodImg, type: "url" });
          }

          let status: ProductStatus = "Active";
          if (product.isActive === false) {
            status = "Inactive";
          } else if (product.stockQuantity === 0) {
            status = "Out of Stock";
          }

          const dateStr = product.updatedAt || product.createdAt;
          const formattedDate = dateStr
            ? new Date(dateStr).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "—";

          return {
            id: product.id,
            name: product.name,
            sku: `NEX-${product.category?.substring(0, 3).toUpperCase() || "GEN"}-${String(product.id).padStart(3, "0")}`,
            category: product.category || "Electronics",
            price: Number(product.price) || 0,
            stock: product.stockQuantity ?? 0,
            status,
            updated: formattedDate,
            shortDescription: product.description
              ? product.description.length > 50
                ? product.description.substring(0, 50) + "..."
                : product.description
              : "",
            description: product.description || "",
            images: imagesList,
          };
        });

        setProducts(mappedProducts);

        const total = apiData?.totalItems ?? mappedProducts.length;
        const totalP =
          apiData?.totalPages ??
          Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

        setTotalItems(total);
        setTotalPages(Math.max(1, totalP));

        if (apiData?.categoryCounts) {
          const keys = Object.keys(apiData.categoryCounts);
          if (keys.length > 0) {
            setCategories((prev) => (prev.length > 0 ? prev : keys));
          }
        }

        setSummary({
          total: total,
          active:
            apiData?.activeCount ??
            (statusVal === "Active" ? total : 0),
          draft: apiData?.draftCount ?? 0,
          outOfStock:
            apiData?.outOfStockCount ??
            (statusVal === "Out of Stock" ? total : 0),
        });

        return {
          items: mappedProducts,
          totalItems: total,
          totalPages: totalP,
        };
      } catch (err) {
        console.error("Failed to load admin products:", err);
        setError("Unable to load products right now. Please try again.");
        setProducts([]);
        return null;
      } finally {
        setLoading(false);
        markAppReady();
      }
    },
    [debouncedSearch, categoryFilter, statusFilter, markAppReady]
  );

  useEffect(() => {
    if (location.state?.productAdded) {
      setProductAddedSuccess(true);
      setCurrentPage(1);
      loadProducts(1);
      window.history.replaceState({}, document.title);
      window.setTimeout(() => {
        setProductAddedSuccess(false);
      }, 3000);
    } else {
      loadProducts(currentPage);
    }
  }, [currentPage, debouncedSearch, categoryFilter, statusFilter, location.key, location.state, loadProducts]);

  /*
   * COMPACT PAGINATION PAGES
   */
  const paginationPages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    if (currentPage <= 4) {
      const startEnd = Math.max(currentPage + 1, 3);
      for (let i = 1; i <= startEnd; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push(2);
      pages.push("ellipsis");
      const endStart = Math.min(currentPage - 1, totalPages - 2);
      for (let i = endStart; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  /*
   * SUMMARY ALIASES FOR UI CARDS
   */
  const totalProducts = summary.total;
  const activeProducts = summary.active;
  const outOfStockProducts = summary.outOfStock;
  const draftProducts = summary.draft;

  /*
   * HANDLERS
   */
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    setCurrentPage(1);
  };

  const handleViewProduct = (productId: string | number) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleEditProduct = (productId: string | number) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleDeleteCancel = () => {
    setDeleteProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) {
      return;
    }

    try {
      setDeleteLoading(true);
      await apiDeleteProduct(Number(deleteProduct.id));
      setDeleteProduct(null);
      setDeleteSuccess(true);

      // Re-fetch current page
      const result = await loadProducts(currentPage);
      // If current page becomes empty and currentPage > 1, move to previous page
      if (result && result.items.length === 0 && currentPage > 1) {
        setCurrentPage((previous) => previous - 1);
      }

      window.setTimeout(() => {
        setDeleteSuccess(false);
      }, 2500);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusClass = (status: ProductStatus) => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
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

      {productAddedSuccess && (
        <div className="nx-admin-success-message">
          <i className="bi bi-check-circle-fill" />
          <span>
            Product added successfully.
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
            {totalItems === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            -
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              totalItems
            )}{" "}
            of{" "}
            {totalItems}{" "}
            products
          </span>
        </div>

        {/* ERROR */}
        {!loading && error && (
          <ErrorState
            title="Unable to load content"
            message={error}
            onRetry={() => loadProducts(currentPage)}
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
              ) : products.length >
                0 ? (
                products.map(
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
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200&auto=format&fit=crop&q=60";
                                }}
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
          products.length > 0 &&
          totalPages > 1 && (
            <div className="nx-admin-pagination">
              <button
                type="button"
                className="nx-admin-pagination-button"
                disabled={currentPage <= 1}
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.max(1, previous - 1)
                  )
                }
                aria-label="Previous page"
              >
                <i className="bi bi-chevron-left" />
                <span>Previous</span>
              </button>

              <div className="nx-admin-page-numbers">
                {paginationPages.map((page, index) => {
                  if (page === "ellipsis") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="nx-admin-pagination-ellipsis"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      className={`nx-admin-page-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="nx-admin-pagination-button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((previous) =>
                    Math.min(totalPages, previous + 1)
                  )
                }
                aria-label="Next page"
              >
                <span>Next</span>
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
                disabled={deleteLoading}
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
