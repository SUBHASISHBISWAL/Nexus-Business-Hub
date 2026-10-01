import "./ProductList.css";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeletonGrid } from "../components/skeleton";
import { ErrorState } from "../components/common/ErrorState";
import { categoryLabels } from "../data/products";
import type { Product } from "../types/product";
import { getProducts } from "../services/productService";
import { useInitialLoading } from "../context/InitialLoadingContext";

function ProductList() {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();
  const { markAppReady } = useInitialLoading();

  // =========================
  // API PRODUCTS & PAGINATION
  // =========================

  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const productsPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // =========================
  // FILTER / SORT STATES
  // =========================

  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(true);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(412000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<string>("featured");

  // =========================
  // CART NOTICE
  // =========================

  const [notice, setNotice] = useState<string>("");

  // =========================
  // LOAD PRODUCTS FROM API
  // =========================

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const categoryParam =
        selectedCategories.length > 0
          ? selectedCategories.join(",")
          : undefined;

      const data = await getProducts({
        page: currentPage,
        pageSize: productsPerPage,
        category: categoryParam,
        search: search.trim() || undefined,
        maxPrice: priceRange < 412000 ? priceRange : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy: sort,
      });

      const items = Array.isArray(data) ? data : data?.items ?? [];
      setProducts(items);
      setTotalItems(data?.totalItems ?? items.length);
      setTotalPages(
        data?.totalPages ??
          Math.max(1, Math.ceil((data?.totalItems ?? items.length) / productsPerPage))
      );
      if (data?.categoryCounts) {
        setCategoryCounts(data.categoryCounts);
      }
    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        "Unable to load products. Please make sure the backend API is running."
      );
    } finally {
      setLoading(false);
      markAppReady();
    }
  }, [
    currentPage,
    productsPerPage,
    selectedCategories,
    search,
    priceRange,
    minRating,
    sort,
    markAppReady,
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Total count across all categories from server
  const allCategoryTotal = useMemo(() => {
    const counts = Object.values(categoryCounts);
    if (counts.length > 0) {
      return counts.reduce((acc, curr) => acc + curr, 0);
    }
    return totalItems;
  }, [categoryCounts, totalItems]);

  // =========================
  // PROFESSIONAL PAGE NUMBERS
  // =========================

  const paginationPages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    if (currentPage > 4) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 3) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (product: Product) => {
    addToCart(product);

    setNotice(`${product.name} added to cart`);

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  // =========================
  // CATEGORY FILTER
  // =========================

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((previous) => {
      if (previous.includes(categoryName)) {
        return previous.filter((item) => item !== categoryName);
      }

      return [...previous, categoryName];
    });

    setCurrentPage(1);
  };

  // =========================
  // SORT
  // =========================

  const handleSortChange = (value: string) => {
    setSort(value);
    setSortOpen(false);
    setCurrentPage(1);
  };

  // =========================
  // RESET FILTERS
  // =========================

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setPriceRange(412000);
    setMinRating(0);
    setSort("featured");
    setSortOpen(false);
    setCurrentPage(1);
  };

  // =========================
  // PAGINATION NAVIGATION
  // =========================

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================
  // RESULT RANGE
  // =========================

  const startIndex = (currentPage - 1) * productsPerPage;
  const resultStart = totalItems > 0 ? startIndex + 1 : 0;
  const resultEnd = Math.min(startIndex + products.length, totalItems);

  // =========================
  // UI
  // =========================

  return (
    <div className="nx-catalog-page">
      <section className="container nx-catalog-shell">
        <div className="nx-catalog-content">
          {/* =========================
              LEFT FILTER SIDEBAR
          ========================== */}

          <aside className="nx-filter-sidebar">
            <h3>Filters</h3>

            {/* CATEGORY */}

            <div className="nx-filter-section">
              <button
                type="button"
                className="nx-category-dropdown"
                onClick={() => setCategoryOpen((previous) => !previous)}
              >
                <span>Category</span>

                <span
                  className={`nx-chevron ${categoryOpen ? "open" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {categoryOpen && (
                <div className="nx-category-options">
                  {/* ALL */}

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length === 0}
                      onChange={() => {
                        setSelectedCategories([]);
                        setCurrentPage(1);
                      }}
                    />

                    <span>All</span>

                    <small>{allCategoryTotal}</small>
                  </label>

                  {/* CATEGORIES */}

                  {categoryLabels
                    .filter((label) => label !== "All")
                    .map((label) => {
                      const count = categoryCounts[label] ?? 0;

                      return (
                        <label key={label} className="nx-checkbox-row">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(label)}
                            onChange={() => handleCategoryChange(label)}
                          />

                          <span>{label}</span>

                          <small>{count}</small>
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
                  setPriceRange(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="nx-price-slider"
              />

              <div className="nx-price-values">
                <span>₹0</span>

                <span>₹{priceRange.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* SORT */}

            <div className="nx-filter-section nx-sort-filter">
              <button
                type="button"
                className="nx-sort-dropdown"
                onClick={() => setSortOpen((previous) => !previous)}
              >
                <span>
                  {sort === "price-high"
                    ? "Price: High to Low"
                    : sort === "price-low"
                      ? "Price: Low to High"
                      : sort === "rating"
                        ? "Spec Rating (5.0 First)"
                        : "Featured Architecture"}
                </span>

                <span
                  className={`nx-chevron ${sortOpen ? "open" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {sortOpen && (
                <div className="nx-sort-options">
                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={sort === "price-high"}
                      onChange={() => handleSortChange("price-high")}
                    />

                    <span>Price: High to Low</span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={sort === "price-low"}
                      onChange={() => handleSortChange("price-low")}
                    />

                    <span>Price: Low to High</span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={sort === "rating"}
                      onChange={() => handleSortChange("rating")}
                    />

                    <span>Spec Rating (5.0 First)</span>
                  </label>
                </div>
              )}
            </div>

            {/* RATING */}

            <div className="nx-filter-section">
              <h4>Rating</h4>

              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="nx-checkbox-row">
                  <input
                    type="checkbox"
                    checked={minRating === rating}
                    onChange={() => {
                      setMinRating(minRating === rating ? 0 : rating);
                      setCurrentPage(1);
                    }}
                  />

                  <span>{rating}.0 & above</span>
                </label>
              ))}
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

          {/* =========================
              RIGHT PRODUCT AREA
          ========================== */}

          <div className="nx-product-area">
            {/* RESULT SUMMARY */}

            {!loading && !error && totalItems > 0 && (
              <div className="nx-result-summary">
                <span>
                  Showing{" "}
                  <strong>
                    {resultStart}–{resultEnd}
                  </strong>{" "}
                  of <strong>{totalItems}</strong> products
                </span>

                {(search ||
                  selectedCategories.length > 0 ||
                  minRating > 0 ||
                  priceRange < 412000) && (
                  <span className="nx-filtered-label">Filtered results</span>
                )}
              </div>
            )}

            {/* CART NOTICE */}

            {notice && (
              <div className="nx-cart-notice" role="status">
                <span className="material-symbols-outlined">check_circle</span>

                {notice}
              </div>
            )}

            {/* SKELETON LOADING GRID */}
            {loading && (
              <div className="nx-product-grid" aria-busy="true">
                <ProductCardSkeletonGrid count={productsPerPage} />
              </div>
            )}

            {/* API ERROR */}
            {!loading && error && (
              <ErrorState
                title="Unable to load content"
                message={error}
                onRetry={loadProducts}
              />
            )}

            {/* PRODUCT GRID */}

            {!loading && !error && products.length > 0 && (
              <div className="nx-product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isLiked={wishlist.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product)}
                  />
                ))}
              </div>
            )}

            {/* PAGINATION */}

            {!loading && !error && products.length > 0 && totalPages > 1 && (
              <nav className="nx-pagination" aria-label="Product pagination">
                {/* PREVIOUS */}

                <button
                  type="button"
                  className="nx-pagination-nav"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  <i className="bi bi-chevron-left"></i>
                  <span>Previous</span>
                </button>

                {/* PAGE NUMBERS */}

                <div className="nx-pagination-pages">
                  {paginationPages.map((page, index) => {
                    if (page === "ellipsis") {
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

                    return (
                      <button
                        key={page}
                        type="button"
                        className={currentPage === page ? "active" : ""}
                        onClick={() => goToPage(page)}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  className="nx-pagination-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </nav>
            )}

            {/* EMPTY STATE */}

            {!loading && !error && products.length === 0 && (
              <div className="nx-empty-catalog">
                <span className="material-symbols-outlined">search_off</span>

                <h2>No matching nodes found</h2>

                <p>Try a different search phrase or adjust your filters.</p>

                <button type="button" onClick={resetFilters}>
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
