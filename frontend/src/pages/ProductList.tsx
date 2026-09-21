import "./ProductList.css";
import { useContext, useEffect, useMemo, useState } from "react";

import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { categoryLabels } from "../data/products";
import type { Product } from "../types/product";
import { getProducts } from "../services/productService";

function ProductList() {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  // =========================
  // API PRODUCTS
  // =========================

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 12;

  // =========================
  // CART NOTICE
  // =========================

  const [notice, setNotice] = useState<string>("");

  // =========================
  // LOAD PRODUCTS FROM API
  // =========================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);

        setError(
          "Unable to load products. Please make sure the backend API is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =========================
  // FILTER + SORT PRODUCTS
  // =========================

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category);

        const matchesPrice = product.price <= priceRange;

        const matchesRating = product.rating >= minRating;

        const matchesSearch =
          !query ||
          [product.name, product.group, product.specs, product.category]
            .join(" ")
            .toLowerCase()
            .includes(query);

        return (
          matchesCategory && matchesPrice && matchesRating && matchesSearch
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") {
          return a.price - b.price;
        }

        if (sort === "price-high") {
          return b.price - a.price;
        }

        if (sort === "rating") {
          return b.rating - a.rating;
        }

        return a.id - b.id;
      });
  }, [products, selectedCategories, priceRange, minRating, search, sort]);

  // =========================
  // PAGINATION CALCULATION
  // =========================

  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = visibleProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

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
  // RESET PAGE WHEN FILTER CHANGES
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, minRating, search, sort]);

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
  // PAGINATION
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
  // SEARCH CLEAR
  // =========================

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // =========================
  // RESULT RANGE
  // =========================

  const resultStart = visibleProducts.length > 0 ? startIndex + 1 : 0;

  const resultEnd = Math.min(
    startIndex + productsPerPage,
    visibleProducts.length,
  );

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

                    <small>{products.length}</small>
                  </label>

                  {/* CATEGORIES */}

                  {categoryLabels
                    .filter((label) => label !== "All")
                    .map((label) => {
                      const count = products.filter(
                        (item) => item.category === label,
                      ).length;

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

            {!loading && !error && visibleProducts.length > 0 && (
              <div className="nx-result-summary">
                <span>
                  Showing{" "}
                  <strong>
                    {resultStart}–{resultEnd}
                  </strong>{" "}
                  of <strong>{visibleProducts.length}</strong> products
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

            {/* LOADING */}

            {loading && (
              <div className="nx-empty-catalog">
                <span className="material-symbols-outlined">
                  progress_activity
                </span>

                <h2>Loading products...</h2>

                <p>Please wait while we load the catalog.</p>
              </div>
            )}

            {/* API ERROR */}

            {!loading && error && (
              <div className="nx-empty-catalog">
                <span className="material-symbols-outlined">error_outline</span>

                <h2>Unable to load products</h2>

                <p>{error}</p>

                <button type="button" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
            )}

            {/* PRODUCT GRID */}

            {!loading && !error && paginatedProducts.length > 0 && (
              <div className="nx-product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isLiked={wishlist.includes(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                  />
                ))}
              </div>
            )}

            {/* PAGINATION */}

            {!loading &&
              !error &&
              visibleProducts.length > 0 &&
              totalPages > 1 && (
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

            {!loading && !error && !visibleProducts.length && (
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
