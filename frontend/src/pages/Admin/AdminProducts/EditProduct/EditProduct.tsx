import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "./EditProduct.css";

type ProductImage = {
  src: string;
  type: "upload" | "url";
};

type StoredProduct = {
  id: string | number;
  name: string;
  sku: string;
  category: string;
  price: string | number;
  stock: string | number;
  status: string;
  shortDescription?: string;
  description?: string;
  specifications?: string;
  images?: ProductImage[];
  updated: string;
};

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  status: string;
  shortDescription: string;
  description: string;
  specifications: string;
};

const PRODUCTS_STORAGE_KEY =
  "nexus_business_products";

const TOTAL_IMAGES = 4;

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  status: "Active",
  shortDescription: "",
  description: "",
  specifications: "",
};

const emptyImage = (): ProductImage => ({
  src: "",
  type: "upload",
});

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] =
    useState<ProductForm>(emptyForm);

  const [images, setImages] =
    useState<ProductImage[]>(
      Array.from(
        { length: TOTAL_IMAGES },
        emptyImage
      )
    );

  const [saved, setSaved] =
    useState(false);

  const [notFound, setNotFound] =
    useState(false);

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const storedData =
      localStorage.getItem(
        PRODUCTS_STORAGE_KEY
      );

    if (!storedData) {
      setNotFound(true);
      return;
    }

    try {
      const storedProducts: StoredProduct[] =
        JSON.parse(storedData);

      if (!Array.isArray(storedProducts)) {
        setNotFound(true);
        return;
      }

      const product =
        storedProducts.find(
          (item) =>
            String(item.id) === String(id)
        );

      if (!product) {
        setNotFound(true);
        return;
      }

      setNotFound(false);

      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category:
          product.category || "",
        price:
          product.price !== undefined
            ? String(product.price)
            : "",
        stock:
          product.stock !== undefined
            ? String(product.stock)
            : "",
        status:
          product.status || "Active",
        shortDescription:
          product.shortDescription || "",
        description:
          product.description || "",
        specifications:
          product.specifications || "",
      });

      /*
       * Always create exactly 4 image slots.
       * Existing images are loaded into their
       * respective slots.
       */
      const existingImages =
        Array.isArray(product.images)
          ? product.images
          : [];

      const fourImages =
        Array.from(
          { length: TOTAL_IMAGES },
          (_, index) =>
            existingImages[index] || {
              src: "",
              type: "upload",
            }
        );

      setImages(fourImages);
    } catch (error) {
      console.error(
        "Unable to load product:",
        error
      );

      setNotFound(true);
    }
  }, [id]);

  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     LOCAL IMAGE UPLOAD
  ========================= */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const uploadedImage: ProductImage = {
        src: reader.result as string,
        type: "upload",
      };

      setImages((previous) => {
        const updated = [...previous];

        updated[index] = uploadedImage;

        return updated;
      });
    };

    reader.onerror = () => {
      alert(
        "Unable to read the selected image."
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* =========================
     IMAGE URL CHANGE
  ========================= */

  const handleImageUrlChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value =
      event.target.value;

    setImages((previous) => {
      const updated = [...previous];

      updated[index] = {
        src: value,
        type: "url",
      };

      return updated;
    });
  };

  /* =========================
     REMOVE IMAGE
  ========================= */

  const handleRemoveImage = (
    index: number
  ) => {
    setImages((previous) => {
      const updated = [...previous];

      updated[index] = {
        src: "",
        type: "upload",
      };

      return updated;
    });
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      alert(
        "Product ID is missing."
      );
      return;
    }

    if (images.length !== TOTAL_IMAGES) {
      alert(
        "Please keep exactly 4 product image slots."
      );
      return;
    }

    const missingImages =
      images.some(
        (image) =>
          !image.src.trim()
      );

    if (missingImages) {
      alert(
        "Please add an image to all 4 image slots."
      );
      return;
    }

    const storedData =
      localStorage.getItem(
        PRODUCTS_STORAGE_KEY
      );

    if (!storedData) {
      alert(
        "Product data could not be found."
      );
      return;
    }

    try {
      const storedProducts: StoredProduct[] =
        JSON.parse(storedData);

      const productExists =
        storedProducts.some(
          (product) =>
            String(product.id) ===
            String(id)
        );

      if (!productExists) {
        alert(
          "Product could not be found."
        );
        return;
      }

      const updatedProducts =
        storedProducts.map(
          (product) => {
            if (
              String(product.id) !==
              String(id)
            ) {
              return product;
            }

            return {
              ...product,
              ...formData,
              price: formData.price,
              stock: formData.stock,
              images: images.map(
                (image) => ({
                  src: image.src.trim(),
                  type: image.type,
                })
              ),
              updated:
                new Date().toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                ),
            };
          }
        );

      localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(
          updatedProducts
        )
      );

      setSaved(true);

      window.setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error) {
      console.error(
        "Unable to update product:",
        error
      );

      alert(
        "Something went wrong while updating the product."
      );
    }
  };

  /* =========================
     NOT FOUND
  ========================= */

  if (notFound) {
    return (
      <div className="nx-edit-product-page">
        <div className="nx-edit-not-found">
          <div>
            <i className="bi bi-box-seam" />
          </div>

          <h2>
            Product not found
          </h2>

          <p>
            The product you are trying to
            edit does not exist.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="nx-edit-product-page">

      {/* HEADER */}

      <div className="nx-edit-header">

        <div>

          <button
            type="button"
            className="nx-edit-back"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            ← Back to Products
          </button>

          <h1>
            Edit Product
          </h1>

          <p>
            Update product information,
            pricing, inventory and images.
          </p>

        </div>

        <div className="nx-product-id">
          Product ID: #{id}
        </div>

      </div>

      {/* SUCCESS */}

      {saved && (
        <div className="nx-edit-success">

          <i className="bi bi-check-circle-fill" />

          <span>
            Product updated successfully.
            Redirecting to products...
          </span>

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

              <h2>
                Basic Information
              </h2>

              <p>
                Update the primary product
                information.
              </p>

            </div>

            <div className="nx-edit-fields">

              <div className="nx-edit-field">

                <label htmlFor="name">
                  Product Name{" "}
                  <span>*</span>
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
                  value={
                    formData.category
                  }
                  onChange={handleChange}
                  required
                >

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

              <div className="nx-edit-field">

                <label htmlFor="status">
                  Product Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    formData.status
                  }
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

          </section>

          {/* PRICING */}

          <section className="nx-edit-card">

            <div className="nx-edit-card-heading">

              <h2>
                Pricing & Inventory
              </h2>

              <p>
                Manage price and available
                stock.
              </p>

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
                    value={
                      formData.price
                    }
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="nx-edit-field">

                <label htmlFor="stock">
                  Stock Quantity{" "}
                  <span>*</span>
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={
                    formData.stock
                  }
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>

          {/* PRODUCT IMAGES */}

          <section className="nx-edit-card">

            <div className="nx-edit-card-heading">

              <div className="nx-edit-image-heading">

                <div>

                  <h2>
                    Product Images
                  </h2>

                  <p>
                    Replace images using
                    upload or image URL.
                  </p>

                </div>

                <span>
                  {
                    images.filter(
                      (image) =>
                        Boolean(
                          image.src.trim()
                        )
                    ).length
                  }{" "}
                  / 4
                </span>

              </div>

            </div>

            <div className="nx-edit-image-grid">

              {images.map(
                (image, index) => (

                  <div
                    className="nx-edit-image-item"
                    key={index}
                  >

                    {/* IMAGE PREVIEW */}

                    <div className="nx-edit-image-preview">

                      {image.src ? (

                        <>

                          <img
                            src={image.src}
                            alt={`Product ${
                              index + 1
                            }`}
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />

                          <div className="nx-edit-image-number">
                            Image {index + 1}
                          </div>

                          <button
                            type="button"
                            className="nx-edit-image-remove"
                            onClick={() =>
                              handleRemoveImage(
                                index
                              )
                            }
                            aria-label={`Remove image ${
                              index + 1
                            }`}
                          >
                            <i className="bi bi-x-lg" />
                          </button>

                        </>

                      ) : (

                        <div className="nx-edit-image-empty">

                          <i className="bi bi-image" />

                          <span>
                            Image {index + 1}
                          </span>

                          <small>
                            Add an image below
                          </small>

                        </div>

                      )}

                    </div>

                    {/* LOCAL UPLOAD */}

                    <label
                      htmlFor={`edit-image-${index}`}
                      className="nx-edit-upload-button"
                    >

                      <i className="bi bi-upload" />

                      {image.type ===
                      "upload"
                        ? "Upload Image"
                        : "Replace Upload"}

                    </label>

                    <input
                      id={`edit-image-${index}`}
                      type="file"
                      accept="image/*"
                      className="nx-edit-hidden-file"
                      onChange={(event) =>
                        handleImageUpload(
                          event,
                          index
                        )
                      }
                    />

                    {/* URL */}

                    <div className="nx-edit-url-box">

                      <i className="bi bi-link-45deg" />

                      <input
                        type="url"
                        value={
                          image.type ===
                          "url"
                            ? image.src
                            : ""
                        }
                        onChange={(event) =>
                          handleImageUrlChange(
                            event,
                            index
                          )
                        }
                        placeholder="Paste image URL"
                      />

                    </div>

                    {/* CURRENT SOURCE */}

                    {image.src && (
                      <div className="nx-edit-image-source">

                        <span>
                          Source:
                        </span>

                        <strong>
                          {image.type ===
                          "upload"
                            ? "Local Upload"
                            : "Image URL"}
                        </strong>

                      </div>
                    )}

                  </div>

                )
              )}

            </div>

            <small className="nx-edit-image-note">
              Exactly 4 images are required.
              You can use local upload or image
              URL for each slot.
            </small>

          </section>

          {/* DESCRIPTION */}

          <section className="nx-edit-card nx-edit-full">

            <div className="nx-edit-card-heading">

              <h2>
                Product Description
              </h2>

              <p>
                Update product summary and
                detailed description.
              </p>

            </div>

            <div className="nx-edit-description-fields">

              <div className="nx-edit-field">

                <label htmlFor="shortDescription">
                  Short Description
                </label>

                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={3}
                  value={
                    formData.shortDescription
                  }
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
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* SPECIFICATIONS */}

          <section className="nx-edit-card nx-edit-full">

            <div className="nx-edit-card-heading">

              <h2>
                Specifications
              </h2>

              <p>
                Update technical
                specifications.
              </p>

            </div>

            <div className="nx-edit-field">

              <label htmlFor="specifications">
                Specifications
              </label>

              <textarea
                id="specifications"
                name="specifications"
                rows={7}
                value={
                  formData.specifications
                }
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
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="nx-edit-save"
          >

            <i className="bi bi-check-lg" />

            Save Changes

          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProduct;