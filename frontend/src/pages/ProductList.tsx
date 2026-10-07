import "./ProductList.css";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeletonGrid } from "../components/skeleton/ProductCardSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import { categoryLabels } from "../data/products";
import type { Product } from "../types/product";
import { getCategories, getProducts } from "../services/productService";
import { useInitialLoading } from "../context/InitialLoadingContext";
import { isAuthenticated } from "../utils/auth";

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();
  const { markAppReady } = useInitialLoading();

  // =========================
  // API PRODUCTS & PAGINATION
  // =========================

  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categoryCounts, setCategoryCounts] =
    useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const productsPerPage = 48;
  const productSkeletonCount = Math.min(productsPerPage, 8);

  // =========================
  // READ VALUES FROM URL
  // =========================

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  const categoryParam =
    searchParams.get("category") || "";

  const selectedCategories = useMemo(() => {
    return categoryParam
      ? categoryParam
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
  }, [categoryParam]);

  const searchTerm =
    searchParams.get("search")?.trim() || "";

  const sort =
    searchParams.get("sortBy") || "newest";

  // =========================
  // FILTER UI STATES
  // =========================

  const [categoryOpen, setCategoryOpen] =
    useState<boolean>(true);

  const [sortOpen, setSortOpen] =
    useState<boolean>(false);

  const [priceRange, setPriceRange] =
    useState<number>(412000);

  const [minRating, setMinRating] =
    useState<number>(0);

  // =========================
  // CART NOTICE
  // =========================

  const [notice, setNotice] =
    useState<string>("");

  // =========================
  // LOAD CATEGORIES FROM API
  // =========================

  useEffect(() => {
    const controller =
      new AbortController();

    getCategories(controller.signal)
      .then((categories) => {
        if (!Array.isArray(categories)) {
          return;
        }

        const counts: Record<string, number> = {};

        categories.forEach((category) => {
          counts[category.name] =
            category.productCount ?? 0;
        });

        setCategoryCounts((previous) => ({
          ...counts,
          ...previous,
        }));
      })
      .catch((err) => {
        if (
          err?.name !== "CanceledError" &&
          err?.name !== "AbortError"
        ) {
          console.error(
            "Failed to load categories:",
            err
          );
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  // =========================
  // LOAD PRODUCTS FROM API
  // =========================

  const loadProducts = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError("");

        const categoryFilter =
          selectedCategories.length > 0
            ? selectedCategories.join(",")
            : undefined;

        const data = await getProducts(
          {
            page: currentPage,
            pageSize: productsPerPage,
            category: categoryFilter,
            search: searchTerm || undefined,
            maxPrice:
              priceRange < 412000
                ? priceRange
                : undefined,
            minRating:
              minRating > 0
                ? minRating
                : undefined,
            sortBy: sort,
          },
          signal
        );

        const items = Array.isArray(data)
          ? data
          : data?.items ?? [];

        setProducts(items);

        setTotalItems(
          data?.totalItems ?? items.length
        );

        setTotalPages(
          data?.totalPages ??
            Math.max(
              1,
              Math.ceil(
                (data?.totalItems ??
                  items.length) /
                  productsPerPage
              )
            )
        );

        if (data?.categoryCounts) {
          setCategoryCounts(
            data.categoryCounts
          );
        }
      } catch (err: any) {
        if (
          err?.name === "CanceledError" ||
          err?.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Failed to load products:",
          err
        );

        setError(
          "Unable to load products. Please make sure the backend API is running."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          markAppReady();
        }
      }
    },
    [
      currentPage,
      selectedCategories,
      searchTerm,
      priceRange,
      minRating,
      sort,
      markAppReady,
    ]
  );

  // =========================
  // LOAD PRODUCTS
  // =========================

  useEffect(() => {
    const controller =
      new AbortController();

    loadProducts(controller.signal);

    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      controller.abort();
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, [loadProducts]);

  // =========================
  // TOTAL CATEGORY COUNT
  // =========================

  const allCategoryTotal = useMemo(() => {
    const counts =
      Object.values(categoryCounts);

    if (counts.length > 0) {
      return counts.reduce(
        (total, count) =>
          total + count,
        0
      );
    }

    return totalItems;
  }, [categoryCounts, totalItems]);

  // =========================
  // PROFESSIONAL PAGE NUMBERS
  // =========================

  type PaginationItem =
    | number
    | "ellipsis"
    | "last";

  const paginationPages = useMemo(
    (): PaginationItem[] => {
      if (totalPages <= 1) {
        return [1];
      }

      if (totalPages <= 3) {
        return Array.from(
          { length: totalPages },
          (_, index) => index + 1
        );
      }

      if (totalPages === 4) {
        return [1, 2, 3, "last"];
      }

      if (currentPage <= 3) {
        return [
          1,
          2,
          3,
          "ellipsis",
          "last",
        ];
      }

      if (
        currentPage >=
        totalPages - 2
      ) {
        return [
          1,
          "ellipsis",
          totalPages - 2,
          totalPages - 1,
          "last",
        ];
      }

      return [
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis",
        "last",
      ];
    },
    [currentPage, totalPages]
  );

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (
    product: Product
  ) => {
    if (!isAuthenticated()) {
      const currentPath = location.pathname + (location.search || "");
      const returnUrl =
        currentPath.includes("?") || currentPath.includes("&")
          ? encodeURIComponent(currentPath)
          : currentPath;
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }

    if (
      (product.stockQuantity ?? 0) <= 0
    ) {
      setNotice(
        `${product.name} is currently out of stock`
      );

      window.setTimeout(() => {
        setNotice("");
      }, 2600);

      return;
    }

    addToCart(product);

    setNotice(
      `${product.name} added to cart`
    );

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  const handleToggleWishlist = (product: Product) => {
    if (!isAuthenticated()) {
      const currentPath = location.pathname + (location.search || "");
      const returnUrl =
        currentPath.includes("?") || currentPath.includes("&")
          ? encodeURIComponent(currentPath)
          : currentPath;
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }
    toggleWishlist(product);
  };

  // =========================
  // CATEGORY FILTER
  // =========================

  const handleCategoryChange = (
    categoryName: string
  ) => {
    const updated =
      selectedCategories.includes(
        categoryName
      )
        ? selectedCategories.filter(
            (item) =>
              item !== categoryName
          )
        : [
            ...selectedCategories,
            categoryName,
          ];

    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(previous);

        if (updated.length > 0) {
          next.set(
            "category",
            updated.join(",")
          );
        } else {
          next.delete("category");
        }

        next.delete("page");

        return next;
      },
      { replace: true }
    );
  };

  // =========================
  // SELECT ALL CATEGORIES
  // =========================

  const handleSelectAllCategories =
    () => {
      setSearchParams(
        (previous) => {
          const next =
            new URLSearchParams(previous);

          next.delete("category");
          next.delete("page");

          return next;
        },
        { replace: true }
      );
    };

  // =========================
  // SORT
  // =========================

  const handleSortChange = (
    value: string
  ) => {
    setSortOpen(false);

    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(previous);

        if (
          value &&
          value !== "newest"
        ) {
          next.set("sortBy", value);
        } else {
          next.delete("sortBy");
        }

        next.delete("page");

        return next;
      },
      { replace: true }
    );
  };

  // =========================
  // RESET FILTERS
  // =========================

  const resetFilters = () => {
    setPriceRange(412000);
    setMinRating(0);
    setSortOpen(false);

    setSearchParams(
      {},
      { replace: true }
    );
  };

  // =========================
  // PAGINATION NAVIGATION
  // =========================

  const goToPage = (page: number) => {
    if (
      page >= 1 &&
      page <= totalPages &&
      page !== currentPage
    ) {
      setSearchParams(
        (previous) => {
          const next =
            new URLSearchParams(previous);

          if (page > 1) {
            next.set(
              "page",
              String(page)
            );
          } else {
            next.delete("page");
          }

          return next;
        },
        { replace: true }
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================
  // RESULT RANGE
  // =========================

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const resultStart =
    totalItems > 0
      ? startIndex + 1
      : 0;

  const resultEnd = Math.min(
    startIndex + products.length,
    totalItems
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="nx-catalog-page">
      <section className="container nx-catalog-shell">
        <div className="nx-catalog-content">

          {/* LEFT FILTER SIDEBAR */}

          <aside className="nx-filter-sidebar">
            <h3>Filters</h3>

            {/* CATEGORY */}

            <div className="nx-filter-section">
              <button
                type="button"
                className="nx-category-dropdown"
                onClick={() =>
                  setCategoryOpen(
                    (previous) =>
                      !previous
                  )
                }
              >
                <span>Category</span>

                <span
                  className={`nx-chevron ${
                    categoryOpen
                      ? "open"
                      : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {categoryOpen && (
                <div className="nx-category-options">

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length ===
                        0
                      }
                      onChange={
                        handleSelectAllCategories
                      }
                    />

                    <span>All</span>

                    <small>
                      {allCategoryTotal}
                    </small>
                  </label>

                  {categoryLabels
                    .filter(
                      (label) =>
                        label !== "All"
                    )
                    .map((label) => {
                      const count =
                        categoryCounts[
                          label
                        ] ?? 0;

                      return (
                        <label
                          key={label}
                          className="nx-checkbox-row"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(
                              label
                            )}
                            onChange={() =>
                              handleCategoryChange(
                                label
                              )
                            }
                          />

                          <span>
                            {label}
                          </span>

                          <small>
                            {count}
                          </small>
                        </label>
                      );
                    })}
                </div>
              )}
            </div>

            {/* PRICE RANGE */}

            <div className="nx-filter-section">
              <h4>Price Range</h4>

              <input
                type="range"
                min="0"
                max="412000"
                step="1000"
                value={priceRange}
                onChange={(event) => {
                  setPriceRange(
                    Number(
                      event.target.value
                    )
                  );

                  setSearchParams(
                    (previous) => {
                      if (
                        !previous.has("page")
                      ) {
                        return previous;
                      }

                      const next =
                        new URLSearchParams(
                          previous
                        );

                      next.delete("page");

                      return next;
                    },
                    { replace: true }
                  );
                }}
                className="nx-price-slider"
              />

              <div className="nx-price-values">
                <span>₹0</span>

                <span>
                  ₹
                  {priceRange.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>

            {/* SORT */}

            <div className="nx-filter-section nx-sort-filter">
              <button
                type="button"
                className="nx-sort-dropdown"
                onClick={() =>
                  setSortOpen(
                    (previous) =>
                      !previous
                  )
                }
              >
                <span>
                  {sort ===
                  "price-high"
                    ? "Price: High to Low"
                    : sort ===
                        "price-low"
                      ? "Price: Low to High"
                      : sort === "rating"
                        ? "Spec Rating (5.0 First)"
                        : sort ===
                            "featured"
                          ? "Featured Architecture"
                          : "Newest Arrivals"}
                </span>

                <span
                  className={`nx-chevron ${
                    sortOpen
                      ? "open"
                      : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {sortOpen && (
                <div className="nx-sort-options">

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        sort ===
                        "newest"
                      }
                      onChange={() =>
                        handleSortChange(
                          "newest"
                        )
                      }
                    />

                    <span>
                      Newest Arrivals
                    </span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        sort ===
                        "featured"
                      }
                      onChange={() =>
                        handleSortChange(
                          "featured"
                        )
                      }
                    />

                    <span>
                      Featured Architecture
                    </span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        sort ===
                        "price-high"
                      }
                      onChange={() =>
                        handleSortChange(
                          "price-high"
                        )
                      }
                    />

                    <span>
                      Price: High to Low
                    </span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        sort ===
                        "price-low"
                      }
                      onChange={() =>
                        handleSortChange(
                          "price-low"
                        )
                      }
                    />

                    <span>
                      Price: Low to High
                    </span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        sort === "rating"
                      }
                      onChange={() =>
                        handleSortChange(
                          "rating"
                        )
                      }
                    />

                    <span>
                      Spec Rating (5.0 First)
                    </span>
                  </label>

                </div>
              )}
            </div>

            {/* RATING */}

            <div className="nx-filter-section">
              <h4>Rating</h4>

              {[4, 3, 2, 1].map(
                (rating) => (
                  <label
                    key={rating}
                    className="nx-checkbox-row"
                  >
                    <input
                      type="checkbox"
                      checked={
                        minRating ===
                        rating
                      }
                      onChange={() => {
                        setMinRating(
                          minRating ===
                            rating
                            ? 0
                            : rating
                        );

                        setSearchParams(
                          (previous) => {
                            if (
                              !previous.has(
                                "page"
                              )
                            ) {
                              return previous;
                            }

                            const next =
                              new URLSearchParams(
                                previous
                              );

                            next.delete(
                              "page"
                            );

                            return next;
                          },
                          { replace: true }
                        );
                      }}
                    />

                    <span>
                      {rating}.0 & above
                    </span>
                  </label>
                )
              )}
            </div>

            {/* RESET */}

            <button
              type="button"
              className="nx-reset-filters"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </aside>

          {/* RIGHT PRODUCT AREA */}

          <div className="nx-product-area">

            {/* RESULT SUMMARY */}

            {!loading &&
              !error &&
              totalItems > 0 && (
                <div className="nx-result-summary">
                  <span>
                    Showing{" "}
                    <strong>
                      {resultStart}–
                      {resultEnd}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {totalItems}
                    </strong>{" "}
                    products

                    {searchTerm && (
                      <span>
                        {" "}
                        for &ldquo;
                        <strong>
                          {searchTerm}
                        </strong>
                        &rdquo;
                      </span>
                    )}
                  </span>

                  {(searchTerm ||
                    selectedCategories.length >
                      0 ||
                    minRating > 0 ||
                    priceRange <
                      412000) && (
                    <span className="nx-filtered-label">
                      Filtered results
                    </span>
                  )}
                </div>
              )}

            {/* CART NOTICE */}

            {notice && (
              <div
                className="nx-cart-notice"
                role="status"
              >
                <span className="material-symbols-outlined">
                  check_circle
                </span>

                {notice}
              </div>
            )}

            {/* SKELETON LOADING GRID */}

            {loading && (
              <div
                className="nx-product-grid"
                aria-busy="true"
              >
                <ProductCardSkeletonGrid
                  count={productSkeletonCount}
                />
              </div>
            )}

            {/* API ERROR */}

            {!loading && error && (
              <ErrorState
                title="Unable to load content"
                message={error}
                onRetry={() =>
                  loadProducts()
                }
              />
            )}

            {/* PRODUCT GRID */}

            {!loading &&
              !error &&
              products.length > 0 && (
                <div className="nx-product-grid">
                  {products.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={
                          handleAddToCart
                        }
                        isLiked={wishlist.includes(
                          product.id
                        )}
                        onToggleWishlist={() =>
                          handleToggleWishlist(
                            product
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}

            {/* PAGINATION */}

            {!error &&
              totalItems > 0 &&
              totalPages > 1 && (
                <nav
                  className="nx-pagination"
                  aria-label="Product pagination"
                >

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    className="nx-pagination-nav"
                    disabled={
                      loading ||
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    aria-label="Previous page"
                  >
                    <i
                      className="bi bi-chevron-left"
                      aria-hidden="true"
                    ></i>

                    <span>
                      Previous
                    </span>
                  </button>

                  {/* PAGE NUMBERS */}

                  <div className="nx-pagination-pages">
                    {paginationPages.map(
                      (
                        page,
                        index
                      ) => {
                        if (
                          page ===
                          "ellipsis"
                        ) {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className="nx-pagination-ellipsis"
                              aria-hidden="true"
                            >
                              …
                            </span>
                          );
                        }

                        if (
                          page === "last"
                        ) {
                          return (
                            <button
                              key="last"
                              type="button"
                              className={
                                currentPage ===
                                totalPages
                                  ? "active"
                                  : ""
                              }
                              disabled={loading}
                              onClick={() =>
                                goToPage(
                                  totalPages
                                )
                              }
                              aria-current={
                                currentPage ===
                                totalPages
                                  ? "page"
                                  : undefined
                              }
                              aria-label={`Last page, page ${totalPages}`}
                              title={`Page ${totalPages}`}
                              data-page={
                                totalPages
                              }
                            >
                              Last
                            </button>
                          );
                        }

                        return (
                          <button
                            key={page}
                            type="button"
                            className={
                              currentPage ===
                              page
                                ? "active"
                                : ""
                            }
                            disabled={loading}
                            onClick={() =>
                              goToPage(page)
                            }
                            aria-current={
                              currentPage ===
                              page
                                ? "page"
                                : undefined
                            }
                            aria-label={`Page ${page}`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    className="nx-pagination-nav"
                    disabled={
                      loading ||
                      currentPage ===
                        totalPages
                    }
                    onClick={() =>
                      goToPage(
                        currentPage + 1
                      )
                    }
                    aria-label="Next page"
                  >
                    <span>Next</span>

                    <i
                      className="bi bi-chevron-right"
                      aria-hidden="true"
                    ></i>
                  </button>

                </nav>
              )}

            {/* EMPTY STATE */}

            {!loading &&
              !error &&
              products.length === 0 && (
                <div className="nx-empty-catalog">
                  <span className="material-symbols-outlined">
                    search_off
                  </span>

                  <h2>
                    No matching products found
                  </h2>

                  <p>
                    {searchTerm
                      ? `No products found matching "${searchTerm}". Try a different search phrase or adjust your filters.`
                      : "Try a different search phrase or adjust your filters."}
                  </p>

                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                  >
                    Reset catalog
                  </button>
                </div>
              )}

          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductList;