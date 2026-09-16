import "./ProductList.css";
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { products, categoryLabels } from "../data/products";
import type { Product } from "../types/product";

function ProductList() {
  const { addToCart } = useContext(CartContext);

  const [search, setSearch] = useState<string>("");
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(true);
  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(412000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<string>("featured");
  const [notice, setNotice] = useState<string>("" );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter(
        (product) =>
          (selectedCategories.length === 0 ||
            selectedCategories.includes(product.category)) &&
          product.price <= priceRange &&
          product.rating >= minRating &&
          (!query ||
            [product.name, product.group, product.specs]
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);

    setNotice(`${product.name} added to cart`);

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((previous) => {
      if (previous.includes(categoryName)) {
        return previous.filter(
          (item) => item !== categoryName
        );
      }

      return [...previous, categoryName];
    });
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setSortOpen(false);
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setPriceRange(412000);
    setMinRating(0);
    setSort("featured");
    setSortOpen(false);
  };

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
                    (previous) => !previous
                  )
                }
              >
                <span>Category</span>

                <span
                  className={`nx-chevron ${
                    categoryOpen ? "open" : ""
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
                        selectedCategories.length === 0
                      }
                      onChange={() =>
                        setSelectedCategories([])
                      }
                    />

                    <span>All</span>
                    <small>{products.length}</small>
                  </label>

                  {categoryLabels
                    .filter((label) => label !== "All")
                    .map((label) => {
                      const count = products.filter(
                        (item) =>
                          item.category === label
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
                              handleCategoryChange(label)
                            }
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
                onChange={(event) =>
                  setPriceRange(
                    Number(event.target.value)
                  )
                }
                className="nx-price-slider"
              />

              <div className="nx-price-values">
                <span>₹0</span>

                <span>
                  ₹{priceRange.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* FEATURED ARCHITECTURE SORT */}
            <div className="nx-filter-section nx-sort-filter">
              <button
                type="button"
                className="nx-sort-dropdown"
                onClick={() =>
                  setSortOpen(
                    (previous) => !previous
                  )
                }
              >
                <span>Featured Architecture</span>

                <span
                  className={`nx-chevron ${
                    sortOpen ? "open" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {sortOpen && (
                <div className="nx-sort-options">
                  <button
                    type="button"
                    onClick={() =>
                      handleSortChange("price-high")
                    }
                  >
                    Price: High to Low
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSortChange("price-low")
                    }
                  >
                    Price: Low to High
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSortChange("rating")
                    }
                  >
                    Spec Rating (4.0 & Above)
                  </button>
                </div>
              )}
            </div>

            {/* RATING */}
            <div className="nx-filter-section">
              <h4>Rating</h4>

              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="nx-checkbox-row"
                >
                  <input
                    type="checkbox"
                    checked={minRating === rating}
                    onChange={() =>
                      setMinRating(
                        minRating === rating
                          ? 0
                          : rating
                      )
                    }
                  />

                  <span>
                    {rating}.0 & above
                  </span>
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

          {/* RIGHT PRODUCT AREA */}
          <div className="nx-product-area">

            {/* SEARCH */}
            <div className="nx-catalog-search">
              <label className="nx-search">
                <span className="material-symbols-outlined">
                  search
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search nodes, specs..."
                  aria-label="Search catalog"
                />
              </label>
            </div>

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

            {/* PRODUCTS */}
            <div className="nx-product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* EMPTY STATE */}
            {!visibleProducts.length && (
              <div className="nx-empty-catalog">
                <span className="material-symbols-outlined">
                  search_off
                </span>

                <h2>No matching nodes found</h2>

                <p>
                  Try a different search phrase or adjust
                  your filters.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
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
