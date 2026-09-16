
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
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<string>("featured");
  const [notice, setNotice] = useState<string>("");

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter(
        (product) =>
          (category === "All" || product.category === category) &&
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
  }, [category, search, sort]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);

    setNotice(`${product.name} added to cart`);

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  return (
    <div className="nx-catalog-page">
      <section className="container nx-catalog-shell">

        <div className="nx-catalog-tools">
          <div
            className="nx-filter-set"
            role="group"
            aria-label="Filter products by category"
          >
            {categoryLabels.map((label) => (
              <button
                type="button"
                key={label}
                className={category === label ? "active" : ""}
                onClick={() => setCategory(label)}
              >
                {label} (
                {label === "All"
                  ? products.length
                  : products.filter(
                      (item) => item.category === label
                    ).length}
                )
              </button>
            ))}
          </div>

          <div className="nx-tool-controls">

            <label className="nx-search">
              <span className="material-symbols-outlined">
                search
              </span>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search nodes, specs..."
                aria-label="Search catalog"
              />
            </label>

            <label className="nx-sort">
              <span>SORT:</span>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="featured">
                  Featured Architecture
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Spec Rating (5.0 First)
                </option>
              </select>
            </label>

          </div>
        </div>

        {notice && (
          <div className="nx-cart-notice" role="status">
            <span className="material-symbols-outlined">
              check_circle
            </span>

            {notice}
          </div>
        )}

        <div className="nx-product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {!visibleProducts.length && (
          <div className="nx-empty-catalog">
            <span className="material-symbols-outlined">
              search_off
            </span>

            <h2>No matching nodes found</h2>

            <p>
              Try a different search phrase or reset the category
              filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Reset catalog
            </button>
          </div>
        )}

        <div className="nx-catalog-summary">
          <div className="nx-summary-icon">
            <span className="material-symbols-outlined">
              grid_view
            </span>
          </div>

          <div>
            <small>Catalog Telemetry Status</small>

            <strong>
              Displaying {visibleProducts.length} of {products.length}{" "}
              Enterprise Products
            </strong>
          </div>

          <div className="nx-summary-actions">
            <button type="button">
              <span className="material-symbols-outlined">
                download
              </span>
              Export Manifest
            </button>

            <button type="button" className="primary">
              <span className="material-symbols-outlined">
                terminal
              </span>
              CLI Provision Matrix
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}

export default ProductList;

