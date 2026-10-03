import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { getProductById } from "../../services/productService";
import { ProductDetailsSkeleton } from "../../components/skeleton";
import { useInitialLoading } from "../../context/InitialLoadingContext";
import type { Product } from "../../types/product";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();
  const { markAppReady } = useInitialLoading();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [isImageViewerOpen, setIsImageViewerOpen] =
    useState<boolean>(false);

  const loadProduct = async () => {
    const numericId = Number(id);

    if (!id || isNaN(numericId)) {
      setError("Invalid product ID.");
      setLoading(false);
      markAppReady();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getProductById(numericId);

      if (!data) {
        setError("Product not found.");
        setProduct(null);
      } else {
        setProduct(data);
        setCurrentImage(0);
        setQuantity(1);
      }
    } catch (err) {
      console.error("Failed to load product details:", err);
      setProduct(null);
      setError(
        "Unable to load product details. Please try again."
      );
    } finally {
      setLoading(false);
      markAppReady();
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const productImages: string[] =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const handlePreviousImage = () => {
    if (productImages.length <= 1) return;

    setCurrentImage((previous) =>
      previous === 0
        ? productImages.length - 1
        : previous - 1
    );
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) return;

    setCurrentImage((previous) =>
      previous === productImages.length - 1
        ? 0
        : previous + 1
    );
  };

  const openImageViewer = () => {
    if (!productImages.length) return;
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImageViewer();
      }

      if (event.key === "ArrowLeft") {
        handlePreviousImage();
      }

      if (event.key === "ArrowRight") {
        handleNextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isImageViewerOpen, productImages.length]);

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="nx-product-not-found" role="alert">
        <span className="material-symbols-outlined">
          search_off
        </span>

        <h2>Unable to load content</h2>

        <p>
          {error || "The product you are looking for could not be found or does not exist."}
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
          <button
            type="button"
            className="nx-error-retry-btn"
            onClick={loadProduct}
            aria-label="Retry loading product"
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Retry</span>
          </button>

          <Link
            to="/products"
            className="nx-back-products"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const activeImage =
    productImages[currentImage] ||
    product.image ||
    "";

  const isLiked = wishlist.includes(product.id);

  const stockText =
    product.stock ||
    (product.stockQuantity !== undefined
      ? `${product.stockQuantity} in stock`
      : "In Stock");

  const isInStock =
    product.isActive !== false &&
    (product.stockQuantity === undefined ||
      product.stockQuantity > 0);

  return (
    <div className="nx-product-details-page">

      {/* Breadcrumb */}
      <div className="container nx-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>

        <Link to="/products">
          Products
        </Link>

        <span>/</span>

        <span className="nx-breadcrumb-current">
          {product.name}
        </span>
      </div>

      {/* Main Product */}
      <main className="container nx-product-details-container">

        <section className="nx-product-main-card">

          {/* Product Gallery */}
          <div className="nx-details-image-section">

            <div className="nx-details-image-wrap">

              <div
                className="nx-image-zoom-area"
                onClick={openImageViewer}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    openImageViewer();
                  }
                }}
                aria-label="Open product image viewer"
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={`${product.name} ${currentImage + 1}`}
                    className="nx-details-image"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
                    }}
                  />
                ) : (
                  <div className="nx-image-placeholder">
                    <i className="bi bi-image"></i>
                    <span>No image available</span>
                  </div>
                )}

                {productImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="nx-image-arrow nx-image-arrow-left"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePreviousImage();
                      }}
                      aria-label="Previous product image"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    <button
                      type="button"
                      className="nx-image-arrow nx-image-arrow-right"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Next product image"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </>
                )}

                {activeImage && (
                  <span
                    className="nx-image-expand-icon"
                    aria-hidden="true"
                  >
                    <i className="bi bi-arrows-fullscreen"></i>
                  </span>
                )}
              </div>

              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="nx-image-counter">
                  {currentImage + 1} / {productImages.length}
                </div>
              )}

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="nx-product-thumbnails">
                  {productImages.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`nx-product-thumbnail ${
                        index === currentImage
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        setCurrentImage(index)
                      }
                      aria-label={`Select product image ${
                        index + 1
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${
                          index + 1
                        }`}
                        className="nx-thumbnail-image"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Dots */}
              {productImages.length > 1 && (
                <div className="nx-image-dots">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={
                        index === currentImage
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentImage(index)
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="nx-details-content">

            <div className="nx-details-category">
              {product.category}
            </div>

            <div className="nx-details-title-row">
              <h1>{product.name}</h1>

              <button
                type="button"
                className={`nx-details-wishlist ${
                  isLiked ? "liked" : ""
                }`}
                onClick={() =>
                  toggleWishlist(product)
                }
                aria-label={
                  isLiked
                    ? `Remove ${product.name} from favorites`
                    : `Save ${product.name}`
                }
              >
                <i
                  className={`bi ${
                    isLiked
                      ? "bi-heart-fill"
                      : "bi-heart"
                  }`}
                ></i>
              </button>
            </div>

            {/* Rating */}
            <div className="nx-details-rating">
              <span className="nx-rating-stars">
                ★★★★★
              </span>

              <strong>
                {product.rating}
              </strong>

              <span>
                ({product.reviews ?? 0} reviews)
              </span>
            </div>

            <div className="nx-details-divider"></div>

            {/* Price */}
            <div className="nx-details-price">
              <span className="nx-current-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="nx-old-price">
                  ₹
                  {product.oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              )}

              {product.oldPrice &&
                product.oldPrice > product.price && (
                  <span className="nx-discount">
                    {Math.round(
                      ((product.oldPrice -
                        product.price) /
                        product.oldPrice) *
                        100
                    )}
                    % off
                  </span>
                )}
            </div>

            {/* Stock */}
            <div className="nx-details-stock-row">
              <span
                className={`nx-stock-dot ${
                  isInStock ? "" : "out"
                }`}
              ></span>

              <span className="nx-stock-text">
                {isInStock
                  ? stockText
                  : "Out of stock"}
              </span>

              {product.badge && (
                <span className="nx-details-badge">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="nx-details-description">
              <p>
                {product.description ||
                  product.summary ||
                  `${product.name} is designed for reliable everyday use, practical operations, and high efficiency.`}
              </p>
            </div>

            {/* Quick Details */}
            <div className="nx-details-quick-spec">

              <div className="nx-quick-spec-item">
                <span>Category</span>
                <strong>
                  {product.category}
                </strong>
              </div>

              <div className="nx-quick-spec-item">
                <span>Availability</span>
                <strong>
                  {product.stockQuantity !==
                  undefined
                    ? `${product.stockQuantity} Units`
                    : "Available"}
                </strong>
              </div>

            </div>

            {/* Purchase */}
            <div className="nx-details-purchase">

              <div className="nx-quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="nx-add-cart-details"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <i className="bi bi-cart3"></i>
                Add to Cart
              </button>

              <button
                type="button"
                className="nx-buy-now-details"
                onClick={handleBuyNow}
                disabled={!isInStock}
              >
                Buy Now
              </button>

            </div>

            {/* Product ID */}
            <div className="nx-product-reference">
              <span>Product ID</span>
              <strong>
                NX-
                {String(product.id).padStart(4, "0")}
              </strong>
            </div>

          </div>
        </section>

        {/* Product Information */}
        <section className="nx-product-information">

          {/* Summary */}
          <div className="nx-info-card">

            <div className="nx-info-title">
              <i className="bi bi-file-text"></i>

              <div>
                <h2>Product Summary</h2>
                <p>
                  Overview of this product
                </p>
              </div>
            </div>

            <p className="nx-summary-text">
              {product.description ||
                product.summary ||
                `${product.name} is a verified solution in the ${product.category} catalog, designed for reliable everyday use and continuous performance.`}
            </p>

          </div>

          {/* Features */}
          <div className="nx-info-card">

            <div className="nx-info-title">
              <i className="bi bi-stars"></i>

              <div>
                <h2>Key Features</h2>
                <p>
                  Product highlights
                </p>
              </div>
            </div>

            <div className="nx-professional-features">
              {(
                product.features || [
                  "Modern user-friendly design",
                  "Reliable performance for continuous operation",
                  "High quality materials and construction",
                  "Suitable for professional and everyday use",
                  "Designed for convenient daily operation",
                ]
              ).map((feature, index) => (
                <div
                  className="nx-professional-feature"
                  key={index}
                >
                  <div className="nx-feature-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Details */}
          <div className="nx-info-card">

            <div className="nx-info-title">
              <i className="bi bi-info-circle"></i>

              <div>
                <h2>Product Details</h2>
                <p>
                  General product information
                </p>
              </div>
            </div>

            <div className="nx-spec-table">
              {(
                product.details || [
                  {
                    label: "Category",
                    value: product.category,
                  },
                  {
                    label: "Stock Availability",
                    value:
                      product.stockQuantity !==
                      undefined
                        ? `${product.stockQuantity} in stock`
                        : "In Stock",
                  },
                  {
                    label: "Customer Rating",
                    value: `${product.rating} / 5.0`,
                  },
                  {
                    label: "Customer Reviews",
                    value: `${
                      product.reviews ?? 0
                    } Reviews`,
                  },
                  {
                    label: "Product ID",
                    value: `NX-${String(
                      product.id
                    ).padStart(4, "0")}`,
                  },
                ]
              ).map((detail, index) => (
                <div
                  className="nx-spec-row"
                  key={index}
                >
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>

          </div>

          {/* Technical Specifications */}
          <div className="nx-info-card">

            <div className="nx-info-title">
              <i className="bi bi-cpu"></i>

              <div>
                <h2>
                  Technical Specifications
                </h2>
                <p>
                  Product configuration
                </p>
              </div>
            </div>

            <div className="nx-spec-table">
              {(
                product.specifications || [
                  {
                    label: "Product Name",
                    value: product.name,
                  },
                  {
                    label: "Category",
                    value: product.category,
                  },
                  {
                    label: "Inventory Level",
                    value:
                      product.stockQuantity !==
                      undefined
                        ? `${product.stockQuantity} Units`
                        : "In Stock",
                  },
                  {
                    label: "Catalog Status",
                    value: product.isActive
                      ? "Active"
                      : "Inactive",
                  },
                ]
              ).map(
                (specification, index) => (
                  <div
                    className="nx-spec-row"
                    key={index}
                  >
                    <span>
                      {specification.label}
                    </span>

                    <strong>
                      {specification.value}
                    </strong>
                  </div>
                )
              )}
            </div>

          </div>

          {/* Service Features */}
          <section className="nx-details-bottom">

            <div className="nx-bottom-card">
              <i className="bi bi-truck"></i>

              <div>
                <strong>
                  Reliable Delivery
                </strong>

                <span>
                  Secure shipping to your location
                </span>
              </div>
            </div>

            <div className="nx-bottom-card">
              <i className="bi bi-shield-check"></i>

              <div>
                <strong>
                  Quality Assurance
                </strong>

                <span>
                  Verified product catalog standards
                </span>
              </div>
            </div>

            <div className="nx-bottom-card">
              <i className="bi bi-headset"></i>

              <div>
                <strong>
                  Customer Support
                </strong>

                <span>
                  Support for product inquiries
                </span>
              </div>
            </div>

          </section>

        </section>
      </main>

      {/* Fullscreen Image Viewer */}
      {isImageViewerOpen && activeImage && (
        <div
          className="nx-image-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={closeImageViewer}
        >

          <button
            type="button"
            className="nx-viewer-close"
            onClick={closeImageViewer}
            aria-label="Close image viewer"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          {productImages.length > 1 && (
            <div className="nx-viewer-counter">
              {currentImage + 1} /{" "}
              {productImages.length}
            </div>
          )}

          {productImages.length > 1 && (
            <button
              type="button"
              className="nx-viewer-arrow nx-viewer-arrow-left"
              onClick={(event) => {
                event.stopPropagation();
                handlePreviousImage();
              }}
              aria-label="Previous image"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}

          <div
            className="nx-viewer-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={activeImage}
              alt={`${product.name} ${currentImage + 1}`}
              className="nx-viewer-image"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60";
              }}
            />

            {productImages.length > 1 && (
              <div className="nx-viewer-thumbnails">
                {productImages.map(
                  (image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={
                        index === currentImage
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentImage(index)
                      }
                    >
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <button
              type="button"
              className="nx-viewer-arrow nx-viewer-arrow-right"
              onClick={(event) => {
                event.stopPropagation();
                handleNextImage();
              }}
              aria-label="Next image"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}

        </div>
      )}
    </div>
  );
}

export default ProductDetails;