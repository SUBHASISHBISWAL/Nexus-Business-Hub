import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

export type ProductImage = {
  src: string;
  type: "upload" | "url";
};

export type StoredProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  shortDescription: string;
  description: string;
  specifications: string;
  images: ProductImage[];
  updated: string;
};

export const PRODUCTS_STORAGE_KEY =
  "nexus_business_products";

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

  const [uploadImages, setUploadImages] =
    useState<string[]>(["", "", "", ""]);

  const [imageUrls, setImageUrls] =
    useState<string[]>(["", "", "", ""]);

  const [urlErrors, setUrlErrors] =
    useState<boolean[]>([false, false, false, false]);

  const [saved, setSaved] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const preview = reader.result as string;

      setUploadImages((previous) => {
        const updated = [...previous];
        updated[index] = preview;
        return updated;
      });
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleRemoveUploadedImage = (
    index: number
  ) => {
    setUploadImages((previous) => {
      const updated = [...previous];
      updated[index] = "";
      return updated;
    });
  };

  const handleUrlChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;

    setImageUrls((previous) => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });

    setUrlErrors((previous) => {
      const updated = [...previous];
      updated[index] = false;
      return updated;
    });
  };

  const handleUrlImageError = (index: number) => {
    setUrlErrors((previous) => {
      const updated = [...previous];
      updated[index] = true;
      return updated;
    });
  };

  const handleUrlImageLoad = (index: number) => {
    setUrlErrors((previous) => {
      const updated = [...previous];
      updated[index] = false;
      return updated;
    });
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls((previous) => {
      const updated = [...previous];
      updated[index] = "";
      return updated;
    });

    setUrlErrors((previous) => {
      const updated = [...previous];
      updated[index] = false;
      return updated;
    });
  };

  const totalImages =
    uploadImages.filter(Boolean).length +
    imageUrls.filter(Boolean).length;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (totalImages !== 4) {
      setImageError(
        `Please add exactly 4 product images. Currently ${totalImages} image${
          totalImages === 1 ? "" : "s"
        } added.`
      );
      return;
    }

    setImageError("");

    let storedProducts: StoredProduct[] = [];

    try {
      const storedData = localStorage.getItem(
        PRODUCTS_STORAGE_KEY
      );

      if (storedData) {
        const parsed = JSON.parse(storedData);

        if (Array.isArray(parsed)) {
          storedProducts = parsed;
        }
      }
    } catch (error) {
      console.error(
        "Unable to read stored products:",
        error
      );
    }

    const uploadedProductImages: ProductImage[] =
      uploadImages
        .filter(Boolean)
        .map((src) => ({
          src,
          type: "upload",
        }));

    const urlProductImages: ProductImage[] =
      imageUrls
        .filter(Boolean)
        .map((src) => ({
          src,
          type: "url",
        }));

    const newProduct: StoredProduct = {
      id: `local-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: formData.price,
      stock: formData.stock,
      status: formData.status,
      shortDescription: formData.shortDescription,
      description: formData.description,
      specifications: formData.specifications,
      images: [
        ...uploadedProductImages,
        ...urlProductImages,
      ],
      updated: new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
    };

    const updatedProducts = [
      ...storedProducts,
      newProduct,
    ];

    localStorage.setItem(
      PRODUCTS_STORAGE_KEY,
      JSON.stringify(updatedProducts)
    );

    setSaved(true);

    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  };

  return (
    <div className="nx-add-product-page">
      <div className="nx-page-header">
        <div>
          <button
            type="button"
            className="nx-back-button"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            ← Back to Products
          </button>

          <h1>Add Product</h1>

          <p>
            Create a new product and add it to
            your product catalog.
          </p>
        </div>
      </div>

      {saved && (
        <div className="nx-success-message">
          Product saved successfully.
          Redirecting to products...
        </div>
      )}

      <form
        className="nx-add-product-form"
        onSubmit={handleSubmit}
      >
        <div className="row g-3">

          {/* BASIC INFORMATION */}

          <div className="col-12">
            <section className="nx-form-card h-100">
              <div className="nx-form-card-header">
                <div>
                  <h2>Basic Information</h2>
                  <p>
                    Enter the main product
                    information.
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
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
                </div>

                <div className="col-md-6">
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
                </div>

                <div className="col-md-6">
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
                      <option value="">
                        Select category
                      </option>

                      <option value="Electronics">
                        Electronics
                      </option>

                      <option value="Hardware">
                        Hardware
                      </option>

                      <option value="Software">
                        Software
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
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
                      <option value="Active">
                        Active
                      </option>

                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="Out of Stock">
                        Out of Stock
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* PRICING */}

          <div className="col-12">
            <section className="nx-form-card">
              <div className="nx-form-card-header">
                <div>
                  <h2>Pricing & Inventory</h2>
                  <p>
                    Set product price and stock
                    quantity.
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
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
                </div>

                <div className="col-md-6">
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
              </div>
            </section>
          </div>

          {/* UPLOAD IMAGES */}

          <div className="col-lg-6">
            <section className="nx-form-card nx-image-card h-100">
              <div className="nx-form-card-header">
                <div>
                  <h2>Product Images</h2>
                  <p>
                    Upload product photos from
                    your computer.
                  </p>
                </div>

                <span className="nx-image-count">
                  {
                    uploadImages.filter(
                      Boolean
                    ).length
                  }{" "}
                  / 4
                </span>
              </div>

              <div className="nx-image-upload-grid">
                {uploadImages.map(
                  (image, index) => (
                    <div
                      className="nx-image-input-card"
                      key={index}
                    >
                      <div className="nx-image-input-title">
                        <span>
                          Image {index + 1}
                        </span>

                        <small>Upload</small>
                      </div>

                      <div className="nx-image-preview">
                        {image ? (
                          <>
                            <img
                              src={image}
                              alt={`Uploaded product ${
                                index + 1
                              }`}
                            />

                            <button
                              type="button"
                              className="nx-remove-image"
                              onClick={() =>
                                handleRemoveUploadedImage(
                                  index
                                )
                              }
                              aria-label={`Remove image ${
                                index + 1
                              }`}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <label
                            htmlFor={`product-image-${index}`}
                            className="nx-image-upload-placeholder"
                          >
                            <i className="bi bi-cloud-arrow-up" />

                            <span>
                              Choose Photo
                            </span>

                            <small>
                              JPG, PNG, WEBP
                            </small>
                          </label>
                        )}
                      </div>

                      <input
                        id={`product-image-${index}`}
                        type="file"
                        accept="image/*"
                        className="nx-hidden-file-input"
                        onChange={(event) =>
                          handleImageUpload(
                            event,
                            index
                          )
                        }
                      />

                      {!image && (
                        <label
                          htmlFor={`product-image-${index}`}
                          className="nx-upload-button"
                        >
                          <i className="bi bi-upload" />
                          Choose Image
                        </label>
                      )}
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* URL IMAGES */}

          <div className="col-lg-6">
            <section className="nx-form-card nx-image-card h-100">
              <div className="nx-form-card-header">
                <div>
                  <h2>
                    Product Image URLs
                  </h2>

                  <p>
                    Add images using direct
                    image URLs.
                  </p>
                </div>

                <span className="nx-image-count">
                  {
                    imageUrls.filter(
                      Boolean
                    ).length
                  }{" "}
                  / 4
                </span>
              </div>

              <div className="nx-url-image-list">
                {imageUrls.map(
                  (url, index) => (
                    <div
                      className="nx-url-image-row"
                      key={index}
                    >
                      <div className="nx-url-image-preview">
                        {url &&
                        !urlErrors[index] ? (
                          <img
                            src={url}
                            alt={`URL product ${
                              index + 1
                            }`}
                            onError={() =>
                              handleUrlImageError(
                                index
                              )
                            }
                            onLoad={() =>
                              handleUrlImageLoad(
                                index
                              )
                            }
                          />
                        ) : (
                          <div className="nx-url-placeholder">
                            <i className="bi bi-link-45deg" />

                            <span>
                              {url
                                ? "Invalid image"
                                : "Preview"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="nx-url-input-area">
                        <label
                          htmlFor={`image-url-${index}`}
                        >
                          Image URL {index + 1}
                        </label>

                        <div className="nx-url-input-wrapper">
                          <i className="bi bi-link-45deg" />

                          <input
                            id={`image-url-${index}`}
                            type="url"
                            value={url}
                            onChange={(event) =>
                              handleUrlChange(
                                event,
                                index
                              )
                            }
                            placeholder="https://example.com/product.jpg"
                          />

                          {url && (
                            <button
                              type="button"
                              className="nx-clear-url"
                              onClick={() =>
                                handleRemoveUrl(
                                  index
                                )
                              }
                              aria-label={`Remove image URL ${
                                index + 1
                              }`}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {urlErrors[index] && (
                          <small className="nx-url-error">
                            Unable to load image
                            from this URL.
                          </small>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>

          {/* IMAGE VALIDATION */}

          <div className="col-12">
            <div className="nx-image-summary">
              <div className="nx-image-summary-top">
                <div>
                  <strong>
                    Product Images
                  </strong>

                  <span>
                    {totalImages} / 4 images
                    added
                  </span>
                </div>

                <div
                  className={`nx-image-status ${
                    totalImages === 4
                      ? "complete"
                      : ""
                  }`}
                >
                  <i
                    className={`bi ${
                      totalImages === 4
                        ? "bi-check-circle-fill"
                        : "bi-info-circle"
                    }`}
                  />

                  {totalImages === 4
                    ? "All 4 product images are ready."
                    : "Add exactly 4 images using upload or URL."}
                </div>
              </div>

              {imageError && (
                <p className="nx-image-validation-error">
                  {imageError}
                </p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="col-12">
            <section className="nx-form-card">
              <div className="nx-form-card-header">
                <div>
                  <h2>Description</h2>

                  <p>
                    Provide clear information
                    about the product.
                  </p>
                </div>
              </div>

              <div className="nx-description-fields">
                <div className="nx-field">
                  <label htmlFor="shortDescription">
                    Short Description
                  </label>

                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={
                      formData.shortDescription
                    }
                    onChange={handleChange}
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
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows={6}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* SPECIFICATIONS */}

          <div className="col-12">
            <section className="nx-form-card">
              <div className="nx-form-card-header">
                <div>
                  <h2>Specifications</h2>

                  <p>
                    Add technical
                    specifications and
                    product details.
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
                  value={
                    formData.specifications
                  }
                  onChange={handleChange}
                  rows={7}
                />
              </div>
            </section>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="nx-form-actions">
          <button
            type="button"
            className="nx-cancel-button"
            onClick={() =>
              navigate("/admin/products")
            }
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