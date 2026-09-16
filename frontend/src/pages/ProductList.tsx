import "./ProductList.css";
import { useContext, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

type Product = {
  id: number;
  name: string;
  category: string;
  group: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  icon: string;
  image: string;
  specs: string;
  stock: string;
  badge: string;
  requestOnly?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "Smart IoT Gateway Pro",
    category: "Electronics",
    group: "Industrial IoT",
    price: 24999,
    oldPrice: 29500,
    rating: 4.9,
    reviews: 128,
    icon: "router",
    image: "product1.jpg",
    specs: "Quad ARM A53 1.8GHz · Dual GbE · TPM 2.0",
    stock: "Ships in 24h",
    badge: "SAVE 15%",
  },
  {
    id: 2,
    name: "EdgeCompute R500",
    category: "Hardware",
    group: "Edge Servers",
    price: 78500,
    rating: 4.8,
    reviews: 64,
    icon: "dns",
    image: "product2.jpg",
    specs: "AMD Ryzen Embedded · 32GB ECC · NVMe RAID",
    stock: "In Stock",
    badge: "IP40 RATED",
  },
  {
    id: 3,
    name: "NexusOS Fleet Control",
    category: "Software",
    group: "Management",
    price: 12400,
    rating: 4.9,
    reviews: 97,
    icon: "monitoring",
    image: "product3.jpg",
    specs: "Remote OTA · Device telemetry · Role controls",
    stock: "License Ready",
    badge: "ANNUAL PLAN",
  },
  {
    id: 4,
    name: "Rugged M12 Sensor Cable",
    category: "Accessories",
    group: "Cabling",
    price: 2150,
    rating: 4.7,
    reviews: 44,
    icon: "cable",
    image: "product4.jpg",
    specs: "IP69K washdown · Oil resistant · 5m shielded",
    stock: "In Stock",
    badge: "IP69K RATED",
  },
  {
    id: 5,
    name: "Thermal Vision Array",
    category: "Electronics",
    group: "Sensor Arrays",
    price: 46800,
    rating: 4.8,
    reviews: 36,
    icon: "thermal",
    image: "product5.jpg",
    specs: "640 × 512 LWIR · -20°C to 85°C · PoE+",
    stock: "In Stock",
    badge: "CALIBRATED",
  },
  {
    id: 6,
    name: "Nexus Rail Mount Kit",
    category: "Accessories",
    group: "Mounting",
    price: 1890,
    rating: 4.6,
    reviews: 71,
    icon: "architecture",
    image: "product6.jpg",
    specs: "Anodized aluminum · DIN 35 compatible",
    stock: "In Stock",
    badge: "FIELD READY",
  },
  {
    id: 7,
    name: "Industrial PoE Switch 8P",
    category: "Hardware",
    group: "Networking",
    price: 32800,
    rating: 4.9,
    reviews: 58,
    icon: "lan",
    image: "product7.jpg",
    specs: "8 × GbE PoE+ · 2 × SFP · Redundant power",
    stock: "Ships in 48h",
    badge: "MANAGED",
  },
  {
    id: 8,
    name: "SignalBridge CAN Module",
    category: "Electronics",
    group: "Modules",
    price: 5799,
    rating: 4.8,
    reviews: 22,
    icon: "tune",
    image: "product8.jpg",
    specs: "2.5kV isolation · Dual CAN 2.0B · Auto-baud",
    stock: "In Stock",
    badge: "2.5kV ISOLATION",
  },
  {
    id: 9,
    name: "PredictiveOps Studio",
    category: "Software",
    group: "Analytics",
    price: 18900,
    rating: 4.7,
    reviews: 49,
    icon: "insights",
    image: "product9.jpg",
    specs: "Anomaly models · Event rules · CSV export",
    stock: "License Ready",
    badge: "AI ENABLED",
  },
  {
    id: 10,
    name: "NX-12 Embedded Controller",
    category: "Hardware",
    group: "Controllers",
    price: 44200,
    rating: 4.8,
    reviews: 31,
    icon: "memory",
    image: "product10.jpg",
    specs: "12 I/O channels · RS-485 · Conformal coating",
    stock: "In Stock",
    badge: "IEC CERTIFIED",
  },
  {
    id: 11,
    name: "SecureLink VPN Gateway",
    category: "Software",
    group: "Security",
    price: 9600,
    rating: 4.9,
    reviews: 83,
    icon: "shield_lock",
    image: "product11.jpg",
    specs: "Zero-trust access · Audit logs · SSO support",
    stock: "License Ready",
    badge: "AES-256",
  },
  {
    id: 12,
    name: "Nexus Enterprise HSM Rack",
    category: "Hardware",
    group: "Cryptographic",
    price: 412000,
    rating: 5.0,
    reviews: 15,
    icon: "lock",
    image: "product12.jpg",
    specs: "10,000 RSA-4096 ops/s · Dual redundant PSU",
    stock: "Built-to-Order",
    badge: "CUSTOM CALIB",
    requestOnly: true,
  },
  {
    id: 13,
    name: "VibrationSense Mini",
    category: "Electronics",
    group: "Sensor Arrays",
    price: 8990,
    rating: 4.6,
    reviews: 54,
    icon: "vibration",
    image: "product13.jpg",
    specs: "3-axis MEMS · 8kHz sample rate · IP67",
    stock: "In Stock",
    badge: "IP67 RATED",
  },
  {
    id: 14,
    name: "Field Service Toolkit",
    category: "Accessories",
    group: "Tools",
    price: 6750,
    rating: 4.7,
    reviews: 29,
    icon: "handyman",
    image: "product14.jpg",
    specs: "Crimp tools · Tester · Travel case",
    stock: "In Stock",
    badge: "SERVICE KIT",
  },
  {
    id: 15,
    name: "Asset Registry Cloud",
    category: "Software",
    group: "Management",
    price: 7200,
    rating: 4.5,
    reviews: 42,
    icon: "inventory_2",
    image: "product15.jpg",
    specs: "QR inventory · Warranty alerts · REST API",
    stock: "License Ready",
    badge: "API INCLUDED",
  },
  {
    id: 16,
    name: "Nexus Runtime SDK",
    category: "Software",
    group: "Development",
    price: 14800,
    rating: 4.8,
    reviews: 67,
    icon: "terminal",
    image: "product16.jpg",
    specs: "C++ / Python SDK · Signed firmware · CI tools",
    stock: "License Ready",
    badge: "DEV LICENSE",
  },
];

const categoryLabels = [
  "All",
  "Electronics",
  "Hardware",
  "Software",
  "Accessories",
];

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
  const [notice, setNotice] = useState<string>("");

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