import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    shortDescription: "",
    description: "",
    specifications: "",
    image: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
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

    setTimeout(() => {
      navigate("/admin/products");
    }, 1200);
  };

  return (
    <div className="nx-add-product-page">
      <div className="nx-page-header">
        <div>
          <button
            type="button"
            className="nx-back-button"
            onClick={() => navigate("/admin/products")}
          >
            ← Back to Products
          </button>

          <h1>Add Product</h1>

          <p>
            Create a new product and add it to your product catalog.
          </p>
        </div>
      </div>

      {saved && (
        <div className="nx-success-message">
          Product saved successfully. Redirecting to products...
        </div>
      )}

      <form
        className="nx-add-product-form"
        onSubmit={handleSubmit}
      >
        <div className="nx-form-grid">

          {/* BASIC INFORMATION */}
          <section className="nx-form-card nx-full-width">
            <div className="nx-form-card-header">
              <div>
                <h2>Basic Information</h2>
                <p>Enter the main product information.</p>
              </div>
            </div>

            <div className="nx-fields-grid">
              <div className="nx-field">
                <label htmlFor="name">
                  Product Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="nx-field">
                <label htmlFor="sku">
                  SKU <span>*</span>
                </label>

                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. NX-GW-001"
                  required
                />
              </div>

              <div className="nx-field">
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
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="nx-field">
                <label htmlFor="status">
                  Product Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">
                    Out of Stock
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* PRICING & INVENTORY */}
          <section className="nx-form-card">
            <div className="nx-form-card-header">
              <div>
                <h2>Pricing & Inventory</h2>
                <p>Set product price and stock quantity.</p>
              </div>
            </div>

            <div className="nx-fields-grid nx-single-column">
              <div className="nx-field">
                <label htmlFor="price">
                  Price <span>*</span>
                </label>

                <div className="nx-input-prefix">
                  <span>₹</span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="nx-field">
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
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>
          </section>

          {/* PRODUCT IMAGE */}
          <section className="nx-form-card">
            <div className="nx-form-card-header">
              <div>
                <h2>Product Image</h2>
                <p>Add the product image URL.</p>
              </div>
            </div>

            <div className="nx-field">
              <label htmlFor="image">
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
              />

              <small>
                Use a valid image URL for the product.
              </small>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="nx-form-card nx-full-width">
            <div className="nx-form-card-header">
              <div>
                <h2>Description</h2>
                <p>Provide clear information about the product.</p>
              </div>
            </div>

            <div className="nx-field">
              <label htmlFor="shortDescription">
                Short Description
              </label>

              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Write a short product summary..."
                rows={3}
              />
            </div>

            <div className="nx-field">
              <label htmlFor="description">
                Product Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write detailed product information..."
                rows={6}
              />
            </div>
          </section>

          {/* SPECIFICATIONS */}
          <section className="nx-form-card nx-full-width">
            <div className="nx-form-card-header">
              <div>
                <h2>Specifications</h2>
                <p>
                  Add technical specifications and product details.
                </p>
              </div>
            </div>

            <div className="nx-field">
              <label htmlFor="specifications">
                Specifications
              </label>

              <textarea
                id="specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                placeholder="Example:&#10;Processor: Quad ARM A53 1.8GHz&#10;Memory: 32GB ECC&#10;Storage: 1TB NVMe"
                rows={7}
              />
            </div>
          </section>
        </div>

        {/* ACTIONS */}
        <div className="nx-form-actions">
          <button
            type="button"
            className="nx-cancel-button"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="nx-save-button"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;