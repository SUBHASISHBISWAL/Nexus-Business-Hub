import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import "./ProductDetails.css";

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

const PRODUCTS_STORAGE_KEY =
  "nexus_business_products";

const fallbackProduct: StoredProduct = {
  id: "1",
  name: "Business Laptop Pro",
  sku: "NX-LAP-001",
  category: "Electronics",
  price: 55000,
  stock: 24,
  status: "Active",
  shortDescription:
    "Professional business laptop for enterprise productivity.",
  description:
    "Business Laptop Pro is designed for professional users with reliable performance, security and productivity features.",
  specifications:
    "Intel Core i7\n16GB RAM\n512GB SSD\nWi-Fi 6\nWindows 11 Pro",
  images: [],
  updated: "10 Sep 2026",
};

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] =
    useState<StoredProduct | null>(null);

  const [selectedImage, setSelectedImage] =
    useState(0);

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
      /*
       * Keep fallback product for the
       * original demo product.
       */
      if (String(id) === "1") {
        setProduct(fallbackProduct);
        setNotFound(false);
      } else {
        setNotFound(true);
      }

      return;
    }

    try {
      const storedProducts: StoredProduct[] =
        JSON.parse(storedData);

      if (!Array.isArray(storedProducts)) {
        setNotFound(true);
        return;
      }

      const foundProduct =
        storedProducts.find(
          (item) =>
            String(item.id) === String(id)
        );

      if (!foundProduct) {
        /*
         * Fallback for old demo route.
         */
        if (String(id) === "1") {
          setProduct(fallbackProduct);
          setNotFound(false);
        } else {
          setNotFound(true);
        }

        return;
      }

      setProduct(foundProduct);
      setNotFound(false);
      setSelectedImage(0);
    } catch (error) {
      console.error(
        "Unable to load product:",
        error
      );

      setNotFound(true);
    }
  }, [id]);

  /* =========================
     PREPARE IMAGES
  ========================= */

  const productImages =
    product?.images?.filter(
      (image) =>
        image &&
        typeof image.src === "string" &&
        image.src.trim() !== ""
    ) || [];

  /*
   * Show all saved images.
   * If no localStorage images exist,
   * use the fallback placeholder.
   */
  const hasImages =
    productImages.length > 0;

  const activeImage =
    hasImages
      ? productImages[
          Math.min(
            selectedImage,
            productImages.length - 1
          )
        ]
      : null;

  /* =========================
     SPECIFICATIONS
  ========================= */

  const specifications =
    product?.specifications
      ? product.specifications
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  /* =========================
     FORMAT PRICE
  ========================= */

  const formatPrice = (
    price: string | number
  ) => {
    const numericPrice =
      Number(price) || 0;

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(numericPrice);
  };

  /* =========================
     NOT FOUND
  ========================= */

  if (notFound || !product) {
    return (
      <div className="nx-product-details-page">

        <div className="nx-product-details-not-found">

          <div className="nx-product-not-found-icon">
            <i className="bi bi-box-seam" />
          </div>

          <h2>
            Product not found
          </h2>

          <p>
            The product you are trying to
            view does not exist.
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

  return (
    <div className="nx-product-details-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="nx-product-details-header">

        <div>

          <button
            type="button"
            className="nx-details-back"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            ← Back to Products
          </button>

          <div className="nx-details-title-row">

            <div>

              <h1>
                {product.name}
              </h1>

              <p>
                Product details, inventory
                and specifications
              </p>

            </div>

            <span
              className={`nx-product-status ${
                product.status
                  .toLowerCase()
                  .replace(/\s+/g, "-")
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
            navigate(
              `/admin/products/${product.id}/edit`
            )
          }
        >
          <i className="bi bi-pencil" />
          Edit Product
        </button>

      </div>

      {/* =========================
          MAIN GRID
      ========================= */}

      <div className="nx-product-details-grid">

        {/* =========================
            IMAGE GALLERY
        ========================= */}

        <section className="nx-details-card nx-product-image-card">

          <div className="nx-product-gallery">

            {/* MAIN IMAGE */}

            <div className="nx-product-main-image">

              {activeImage ? (

                <img
                  src={activeImage.src}
                  alt={`${product.name} ${
                    selectedImage + 1
                  }`}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    event.currentTarget.parentElement?.classList.add(
                      "image-fallback"
                    );
                  }}
                />

              ) : (

                <div className="nx-product-main-placeholder">

                  <i className="bi bi-image" />

                  <span>
                    No Product Image
                  </span>

                </div>

              )}

            </div>

            {/* THUMBNAILS */}

            {hasImages && (
              <div className="nx-product-thumbnails">

                {productImages.map(
                  (image, index) => (

                    <button
                      type="button"
                      key={`${image.src}-${index}`}
                      className={`nx-product-thumbnail ${
                        selectedImage === index
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                    >

                      <img
                        src={image.src}
                        alt={`${product.name} thumbnail ${
                          index + 1
                        }`}
                        onError={(
                          event
                        ) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />

                      <span>
                        {index + 1}
                      </span>

                    </button>

                  )
                )}

              </div>
            )}

            {/* IMAGE COUNT */}

            <div className="nx-product-image-count">

              {hasImages
                ? `${selectedImage + 1} / ${productImages.length}`
                : "0 / 4"}

            </div>

          </div>

        </section>

        {/* =========================
            BASIC INFO
        ========================= */}

        <section className="nx-details-card">

          <div className="nx-details-card-heading">

            <h2>
              Product Information
            </h2>

            <p>
              Basic product and catalog
              information.
            </p>

          </div>

          <div className="nx-info-list">

            <div className="nx-info-row">

              <span>
                Product Name
              </span>

              <strong>
                {product.name}
              </strong>

            </div>

            <div className="nx-info-row">

              <span>
                SKU
              </span>

              <strong>
                {product.sku}
              </strong>

            </div>

            <div className="nx-info-row">

              <span>
                Category
              </span>

              <strong>
                {product.category}
              </strong>

            </div>

            <div className="nx-info-row">

              <span>
                Status
              </span>

              <strong>
                {product.status}
              </strong>

            </div>

          </div>

        </section>

        {/* =========================
            PRICING
        ========================= */}

        <section className="nx-details-card">

          <div className="nx-details-card-heading">

            <h2>
              Pricing & Inventory
            </h2>

            <p>
              Current product availability.
            </p>

          </div>

          <div className="nx-metric-grid">

            <div className="nx-detail-metric">

              <span>
                Current Price
              </span>

              <strong>
                {formatPrice(
                  product.price
                )}
              </strong>

            </div>

            <div className="nx-detail-metric">

              <span>
                Stock Quantity
              </span>

              <strong>
                {product.stock}
              </strong>

            </div>

          </div>

          <div className="nx-stock-indicator">

            <div className="nx-stock-label">

              <span>
                Inventory Level
              </span>

              <strong
                className={
                  Number(
                    product.stock
                  ) <= 20
                    ? "low-stock"
                    : ""
                }
              >
                {Number(
                  product.stock
                ) === 0
                  ? "Out of Stock"
                  : Number(
                      product.stock
                    ) <= 20
                  ? "Low Stock"
                  : "Healthy"}
              </strong>

            </div>

            <div className="nx-stock-bar">

              <div
                className={`nx-stock-fill ${
                  Number(
                    product.stock
                  ) <= 20
                    ? "low"
                    : ""
                }`}
                style={{
                  width: `${Math.min(
                    Number(
                      product.stock
                    ) || 0,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <section className="nx-details-card nx-details-full">

          <div className="nx-details-card-heading">

            <h2>
              Description
            </h2>

            <p>
              Product overview and detailed
              information.
            </p>

          </div>

          <div className="nx-description-block">

            <h3>
              Short Description
            </h3>

            <p>
              {product.shortDescription ||
                "No short description available."}
            </p>

          </div>

          <div className="nx-description-block">

            <h3>
              Product Description
            </h3>

            <p>
              {product.description ||
                "No product description available."}
            </p>

          </div>

        </section>

        {/* =========================
            SPECIFICATIONS
        ========================= */}

        <section className="nx-details-card">

          <div className="nx-details-card-heading">

            <h2>
              Specifications
            </h2>

            <p>
              Technical product
              specifications.
            </p>

          </div>

          <div className="nx-specification-list">

            {specifications.length > 0 ? (

              specifications.map(
                (
                  specification,
                  index
                ) => (

                  <div
                    className="nx-specification-item"
                    key={`${specification}-${index}`}
                  >

                    <span className="nx-spec-dot" />

                    <span>
                      {specification}
                    </span>

                  </div>

                )
              )

            ) : (

              <div className="nx-no-specifications">
                No specifications available.
              </div>

            )}

          </div>

        </section>

        {/* =========================
            RECORD INFORMATION
        ========================= */}

        <section className="nx-details-card">

          <div className="nx-details-card-heading">

            <h2>
              Record Information
            </h2>

            <p>
              Product catalog timestamps.
            </p>

          </div>

          <div className="nx-info-list">

            <div className="nx-info-row">

              <span>
                Product ID
              </span>

              <strong>
                #{product.id}
              </strong>

            </div>

            <div className="nx-info-row">

              <span>
                Last Updated
              </span>

              <strong>
                {product.updated ||
                  "—"}
              </strong>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default ProductDetails;