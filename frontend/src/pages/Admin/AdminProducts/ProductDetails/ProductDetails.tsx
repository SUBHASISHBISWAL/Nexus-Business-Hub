import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string[];
  createdAt: string;
  updatedAt: string;
};

const products: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Smart IoT Gateway Pro",
    sku: "NX-IOT-001",
    category: "Electronics",
    price: "₹24,999",
    stock: 48,
    status: "Active",
    image: "/product1.jpg",
    shortDescription:
      "Industrial-grade IoT gateway for connected device management.",
    description:
      "Smart IoT Gateway Pro provides reliable connectivity, secure device communication and centralized industrial IoT management for enterprise environments.",
    specifications: [
      "Quad ARM A53 1.8GHz",
      "Dual GbE",
      "TPM 2.0",
      "Industrial IoT connectivity",
      "Remote device management",
    ],
    createdAt: "10 Sep 2026",
    updatedAt: "18 Sep 2026",
  },

  "2": {
    id: "2",
    name: "EdgeCompute R500",
    sku: "NX-EDGE-002",
    category: "Hardware",
    price: "₹78,500",
    stock: 24,
    status: "Active",
    image: "/product2.jpg",
    shortDescription:
      "Compact edge computing server for industrial workloads.",
    description:
      "EdgeCompute R500 delivers dependable edge processing with ECC memory and NVMe storage for enterprise deployments.",
    specifications: [
      "AMD Ryzen Embedded",
      "32GB ECC",
      "NVMe RAID",
      "IP40 rated",
      "Industrial edge computing",
    ],
    createdAt: "08 Sep 2026",
    updatedAt: "17 Sep 2026",
  },

  "3": {
    id: "3",
    name: "NexusOS Fleet Control",
    sku: "NX-SW-003",
    category: "Software",
    price: "₹12,400",
    stock: 100,
    status: "Active",
    image: "/product3.jpg",
    shortDescription:
      "Centralized fleet and device management platform.",
    description:
      "NexusOS Fleet Control provides remote OTA updates, device telemetry and role-based management controls.",
    specifications: [
      "Remote OTA",
      "Device telemetry",
      "Role-based controls",
      "Annual licensing",
      "Enterprise management",
    ],
    createdAt: "06 Sep 2026",
    updatedAt: "16 Sep 2026",
  },
};

const defaultProduct: Product = {
  id: "7",
  name: "Industrial PoE Switch 8P",
  sku: "NX-NET-007",
  category: "Hardware",
  price: "₹32,800",
  stock: 36,
  status: "Active",
  image: "/product7.jpg",
  shortDescription:
    "Managed industrial PoE switch with redundant power support.",
  description:
    "Industrial PoE Switch 8P provides reliable network connectivity for industrial environments with PoE+ and SFP support.",
  specifications: [
    "8 × GbE PoE+",
    "2 × SFP",
    "Redundant power",
    "Managed switch",
    "Industrial networking",
  ],
  createdAt: "04 Sep 2026",
  updatedAt: "18 Sep 2026",
};

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const product = products[id ?? ""] ?? defaultProduct;

  return (
    <div className="nx-product-details-page">
      {/* HEADER */}
      <div className="nx-product-details-header">
        <div>
          <button
            type="button"
            className="nx-details-back"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>

          <div className="nx-details-title-row">
            <div>
              <h1>{product.name}</h1>

              <p>
                Product details, inventory and specifications
              </p>
            </div>

            <span
              className={`nx-product-status ${
                product.status.toLowerCase() === "active"
                  ? "active"
                  : "inactive"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="nx-edit-product-button"
          onClick={() =>
            navigate(`/admin/products/${product.id}/edit`)
          }
        >
          Edit Product
        </button>
      </div>

      {/* MAIN */}
      <div className="nx-product-details-grid">
        {/* IMAGE */}
        <section className="nx-details-card nx-product-image-card">
          <div className="nx-product-image-wrapper">
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.style.display = "none";
                event.currentTarget.parentElement?.classList.add(
                  "image-fallback"
                );
              }}
            />

            <div className="nx-image-placeholder">
              <span>Product Image</span>
            </div>
          </div>
        </section>

        {/* BASIC INFO */}
        <section className="nx-details-card">
          <div className="nx-details-card-heading">
            <h2>Product Information</h2>
            <p>Basic product and catalog information.</p>
          </div>

          <div className="nx-info-list">
            <div className="nx-info-row">
              <span>Product Name</span>
              <strong>{product.name}</strong>
            </div>

            <div className="nx-info-row">
              <span>SKU</span>
              <strong>{product.sku}</strong>
            </div>

            <div className="nx-info-row">
              <span>Category</span>
              <strong>{product.category}</strong>
            </div>

            <div className="nx-info-row">
              <span>Status</span>
              <strong>{product.status}</strong>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="nx-details-card">
          <div className="nx-details-card-heading">
            <h2>Pricing & Inventory</h2>
            <p>Current product availability.</p>
          </div>

          <div className="nx-metric-grid">
            <div className="nx-detail-metric">
              <span>Current Price</span>
              <strong>{product.price}</strong>
            </div>

            <div className="nx-detail-metric">
              <span>Stock Quantity</span>
              <strong>{product.stock}</strong>
            </div>
          </div>

          <div className="nx-stock-indicator">
            <div className="nx-stock-label">
              <span>Inventory Level</span>
              <strong>
                {product.stock > 20 ? "Healthy" : "Low Stock"}
              </strong>
            </div>

            <div className="nx-stock-bar">
              <div
                className={`nx-stock-fill ${
                  product.stock <= 20 ? "low" : ""
                }`}
                style={{
                  width: `${Math.min(product.stock, 100)}%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* DESCRIPTION */}
        <section className="nx-details-card nx-details-full">
          <div className="nx-details-card-heading">
            <h2>Description</h2>
            <p>Product overview and detailed information.</p>
          </div>

          <div className="nx-description-block">
            <h3>Short Description</h3>
            <p>{product.shortDescription}</p>
          </div>

          <div className="nx-description-block">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        </section>

        {/* SPECIFICATIONS */}
        <section className="nx-details-card">
          <div className="nx-details-card-heading">
            <h2>Specifications</h2>
            <p>Technical product specifications.</p>
          </div>

          <div className="nx-specification-list">
            {product.specifications.map((specification, index) => (
              <div
                className="nx-specification-item"
                key={`${specification}-${index}`}
              >
                <span className="nx-spec-dot" />
                <span>{specification}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RECORD INFORMATION */}
        <section className="nx-details-card">
          <div className="nx-details-card-heading">
            <h2>Record Information</h2>
            <p>Product catalog timestamps.</p>
          </div>

          <div className="nx-info-list">
            <div className="nx-info-row">
              <span>Product ID</span>
              <strong>#{product.id}</strong>
            </div>

            <div className="nx-info-row">
              <span>Created</span>
              <strong>{product.createdAt}</strong>
            </div>

            <div className="nx-info-row">
              <span>Last Updated</span>
              <strong>{product.updatedAt}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;