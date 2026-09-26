import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  shortDescription: string;
  description: string;
  image: string;
  specifications: string;
};

const sampleProducts: Record<string, ProductForm> = {
  "1": {
    name: "Smart IoT Gateway Pro",
    sku: "NX-IOT-001",
    category: "Electronics",
    price: "24999",
    stock: "48",
    status: "Active",
    shortDescription: "Industrial-grade IoT gateway for connected device management.",
    description:
      "Smart IoT Gateway Pro provides reliable connectivity, secure device communication and centralized industrial IoT management.",
    image: "product1.jpg",
    specifications:
      "Processor: Quad ARM A53 1.8GHz\nEthernet: Dual GbE\nSecurity: TPM 2.0\nConnectivity: Industrial IoT",
  },
  "2": {
    name: "EdgeCompute R500",
    sku: "NX-EDGE-002",
    category: "Hardware",
    price: "78500",
    stock: "24",
    status: "Active",
    shortDescription: "Compact edge computing server for industrial workloads.",
    description:
      "EdgeCompute R500 delivers dependable edge processing with ECC memory and NVMe storage for enterprise deployments.",
    image: "product2.jpg",
    specifications:
      "CPU: AMD Ryzen Embedded\nMemory: 32GB ECC\nStorage: NVMe RAID\nRating: IP40",
  },
  "3": {
    name: "NexusOS Fleet Control",
    sku: "NX-SW-003",
    category: "Software",
    price: "12400",
    stock: "100",
    status: "Active",
    shortDescription: "Centralized fleet and device management platform.",
    description:
      "NexusOS Fleet Control provides remote OTA updates, device telemetry and role-based management controls.",
    image: "product3.jpg",
    specifications:
      "Remote OTA: Supported\nTelemetry: Real-time\nAccess: Role-based\nPlan: Annual",
  },
};

const defaultProduct: ProductForm = {
  name: "Industrial PoE Switch 8P",
  sku: "NX-NET-007",
  category: "Hardware",
  price: "32800",
  stock: "36",
  status: "Active",
  shortDescription: "Managed industrial PoE switch with redundant power support.",
  description:
    "Industrial PoE Switch 8P provides reliable network connectivity for industrial environments with PoE+ and SFP support.",
  image: "product7.jpg",
  specifications:
    "Ports: 8 × GbE PoE+\nUplink: 2 × SFP\nPower: Redundant\nManagement: Managed",
};

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<ProductForm>(
    sampleProducts[id ?? ""] ?? defaultProduct
  );

  const [saved, setSaved] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaved(true);

    window.setTimeout(() => {
      navigate("/admin/products");
    }, 1200);
  };

  return (
    <div className="nx-edit-product-page">
      <div className="nx-edit-header">
        <div>
          <button
            type="button"
            className="nx-edit-back"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>

          <h1>Edit Product</h1>

          <p>
            Update product information, pricing, inventory and
            specifications.
          </p>
        </div>

        <div className="nx-product-id">
          Product ID: #{id || "007"}
        </div>
      </div>

      {saved && (
        <div className="nx-edit-success">
          Product updated successfully. Redirecting to products...
        </div>
      )}

      <form
        className="nx-edit-form"
        onSubmit={handleSubmit}
      >
        <div className="nx-edit-grid">

          {/* BASIC INFORMATION */}
          <section className="nx-edit-card nx-edit-full">
            <div className="nx-edit-card-heading">
              <h2>Basic Information</h2>
              <p>Update the primary product information.</p>
            </div>

            <div className="nx-edit-fields">
              <div className="nx-edit-field">
                <label htmlFor="name">
                  Product Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="nx-edit-field">
                <label htmlFor="sku">
                  SKU <span>*</span>
                </label>

                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="nx-edit-field">
                <label htmlFor="category">
                  Category <span>*</span>
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="nx-edit-field">
                <label htmlFor="status">Product Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </section>

          {/* PRICE & STOCK */}
          <section className="nx-edit-card">
            <div className="nx-edit-card-heading">
              <h2>Pricing & Inventory</h2>
              <p>Manage price and available stock.</p>
            </div>

            <div className="nx-edit-single-fields">
              <div className="nx-edit-field">
                <label htmlFor="price">
                  Price <span>*</span>
                </label>

                <div className="nx-price-input">
                  <span>₹</span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="nx-edit-field">
                <label htmlFor="stock">
                  Stock Quantity <span>*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* IMAGE */}
          <section className="nx-edit-card">
            <div className="nx-edit-card-heading">
              <h2>Product Image</h2>
              <p>Update the product image reference.</p>
            </div>

            <div className="nx-edit-field">
              <label htmlFor="image">Image URL</label>

              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
              />

              <small>
                Enter the product image file name or URL.
              </small>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="nx-edit-card nx-edit-full">
            <div className="nx-edit-card-heading">
              <h2>Product Description</h2>
              <p>Update product summary and detailed description.</p>
            </div>

            <div className="nx-edit-field">
              <label htmlFor="shortDescription">
                Short Description
              </label>

              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={3}
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>

            <div className="nx-edit-field">
              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* SPECIFICATIONS */}
          <section className="nx-edit-card nx-edit-full">
            <div className="nx-edit-card-heading">
              <h2>Specifications</h2>
              <p>Update technical specifications.</p>
            </div>

            <div className="nx-edit-field">
              <label htmlFor="specifications">
                Specifications
              </label>

              <textarea
                id="specifications"
                name="specifications"
                rows={7}
                value={formData.specifications}
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        {/* ACTIONS */}
        <div className="nx-edit-actions">
          <button
            type="button"
            className="nx-edit-cancel"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="nx-edit-save"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;