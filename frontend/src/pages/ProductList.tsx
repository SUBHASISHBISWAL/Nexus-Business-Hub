import "./ProductList.css";
import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { products, categoryLabels } from "../data/products";
import type { Product } from "../types/product";

function ProductList() {
  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  // =========================
  // FILTER / SORT STATES
  // =========================

  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] =
    useState<boolean>(true);
  const [sortOpen, setSortOpen] =
    useState<boolean>(false);
  const [priceRange, setPriceRange] =
    useState<number>(412000);
  const [minRating, setMinRating] =
    useState<number>(0);
  const [sort, setSort] =
    useState<string>("featured");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const productsPerPage = 12;

  // =========================
  // CART NOTICE
  // =========================

  const [notice, setNotice] =
    useState<string>("");

  // =========================
  // FILTER PRODUCTS
  // =========================

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter(
        (product) =>
          (selectedCategories.length === 0 ||
            selectedCategories.includes(
              product.category
            )) &&
          product.price <= priceRange &&
          product.rating >= minRating &&
          (!query ||
            [
              product.name,
              product.group,
              product.specs,
            ]
              .join(" ")
              .toLowerCase()
              .includes(query))
      )
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
  }, [
    selectedCategories,
    priceRange,
    minRating,
    search,
    sort,
  ]);

  // =========================
  // PAGINATION CALCULATION
  // =========================

  const totalPages = Math.ceil(
    visibleProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const paginatedProducts =
    visibleProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  // =========================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    priceRange,
    minRating,
    search,
    sort,
  ]);

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = (product: Product) => {
    addToCart(product);

    setNotice(
      `${product.name} added to cart`
    );

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  // =========================
  // CATEGORY FILTER
  // =========================

  const handleCategoryChange = (
    categoryName: string
  ) => {
    setSelectedCategories((previous) => {
      if (previous.includes(categoryName)) {
        return previous.filter(
          (item) => item !== categoryName
        );
      }

      return [
        ...previous,
        categoryName,
      ];
    });
  };

  // =========================
  // SORT
  // =========================

  const handleSortChange = (
    value: string
  ) => {
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
  // PAGINATION HANDLERS
  // =========================

  const goToPage = (page: number) => {
    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

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

                  {/* ALL */}

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length ===
                        0
                      }
                      onChange={() =>
                        setSelectedCategories(
                          []
                        )
                      }
                    />

                    <span>All</span>

                    <small>
                      {products.length}
                    </small>
                  </label>

                  {/* CATEGORIES */}

                  {categoryLabels
                    .filter(
                      (label) =>
                        label !== "All"
                    )
                    .map((label) => {
                      const count =
                        products.filter(
                          (item) =>
                            item.category ===
                            label
                        ).length;

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
                onChange={(event) =>
                  setPriceRange(
                    Number(
                      event.target.value
                    )
                  )
                }
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
                  Featured Architecture
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
                      checked={sort === "price-high"}
                      onChange={() =>
                        handleSortChange("price-high")
                      }
                    />

                    <span>Price: High to Low</span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={sort === "price-low"}
                      onChange={() =>
                        handleSortChange("price-low")
                      }
                    />

                    <span>Price: Low to High</span>
                  </label>

                  <label className="nx-checkbox-row">
                    <input
                      type="checkbox"
                      checked={sort === "rating"}
                      onChange={() =>
                        handleSortChange("rating")
                      }
                    />

                    <span>Spec Rating (4.0 & Above)</span>
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
                      onChange={() =>
                        setMinRating(
                          minRating ===
                            rating
                            ? 0
                            : rating
                        )
                      }
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

          {/* =========================
              RIGHT PRODUCT AREA
          ========================== */}

          <div className="nx-product-area">

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

            {/* PRODUCT GRID */}

            <div className="nx-product-grid">
              {paginatedProducts.map(
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
                      toggleWishlist(
                        product.id
                      )
                    }
                  />
                )
              )}
            </div>

            {/* =========================
                PAGINATION
            ========================== */}

            {visibleProducts.length >
              0 &&
              totalPages > 1 && (
                <div className="nx-pagination">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      goToPage(
                        currentPage - 1
                      )
                    }
                    aria-label="Previous page"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>

                  {/* PAGE NUMBERS */}

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={
                        currentPage ===
                        page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        goToPage(page)
                      }
                    >
                      {page}
                    </button>
                  ))}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
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
                    <i className="bi bi-chevron-right"></i>
                  </button>

                </div>
              )}

            {/* =========================
                EMPTY STATE
            ========================== */}

            {!visibleProducts.length && (
              <div className="nx-empty-catalog">
                <span className="material-symbols-outlined">
                  search_off
                </span>

                <h2>
                  No matching nodes found
                </h2>

                <p>
                  Try a different search
                  phrase or adjust your
                  filters.
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