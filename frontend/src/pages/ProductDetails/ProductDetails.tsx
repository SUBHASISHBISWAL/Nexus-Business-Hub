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
import type { Product } from "../../types/product";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState<number>(0);

  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const [isZooming, setIsZooming] = useState<boolean>(false);

  /*
   * =========================================
   * GET PRODUCT FROM API
   * =========================================
   */

  useEffect(() => {
    const loadProduct = async () => {
      const numericId = Number(id);

      if (!id || isNaN(numericId)) {
        setError("Invalid product ID.");
        setLoading(false);
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
        setError("Unable to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  /*
   * =========================================
   * LOADING STATE
   * =========================================
   */

  if (loading) {
    return (
      <div className="nx-product-not-found">
        <span className="material-symbols-outlined">
          progress_activity
        </span>

        <h2>Loading Product...</h2>

        <p>
          Please wait while we load the product details.
        </p>
      </div>
    );
  }

  /*
   * =========================================
   * ERROR STATE
   * =========================================
   */

  if (error || !product) {
    return (
      <div className="nx-product-not-found">
        <span className="material-symbols-outlined">
          search_off
        </span>

        <h2>
          {error ? error : "Product Not Found"}
        </h2>

        <p>
          The product you are looking for could not be found or does not exist.
        </p>

        <Link to="/products" className="nx-back-products">
          Back to Products
        </Link>
      </div>
    );
  }

  /*
   * =========================================
   * PRODUCT GALLERY
   * =========================================
   */

  const productImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const activeImage =
    productImages[currentImage] || product.image || "";

  const isLiked = wishlist.includes(product.id);

  /*
   * =========================================
   * IMAGE MOUSE MOVE FOR ZOOM
   * =========================================
   */

  const handleImageMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  /*
   * =========================================
   * PREVIOUS / NEXT IMAGE
   * =========================================
   */

  const handlePreviousImage = () => {
    if (productImages.length === 0) return;
    setCurrentImage((previous) =>
      previous === 0 ? productImages.length - 1 : previous - 1
    );
  };

  const handleNextImage = () => {
    if (productImages.length === 0) return;
    setCurrentImage((previous) =>
      previous === productImages.length - 1 ? 0 : previous + 1
    );
  };

  /*
   * =========================================
   * QUANTITY CONTROLS
   * =========================================
   */

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
  };

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  /*
   * =========================================
   * CART ACTIONS
   * =========================================
   */

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }
    navigate("/cart");
  };

  return (
    <div className="nx-product-details-page">

      {/* =========================================
          BREADCRUMB
          ========================================= */}

      <div className="container nx-details-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* =========================================
          MAIN PRODUCT SECTION
          ========================================= */}

      <section className="container nx-product-details-container">

        <div className="nx-product-details-grid">

          {/* =========================================
              LEFT IMAGE SECTION
              ========================================= */}

          <div className="nx-details-image-section">

            <div className="nx-details-image-wrap">

              {/* MAIN IMAGE + MAGNIFIER */}

              <div
                className="nx-image-zoom-area"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
              >

                <img
                  src={activeImage}
                  alt={`${product.name} ${currentImage + 1}`}
                  className="nx-details-image"
                />

                {/* Previous Arrow */}

                {productImages.length > 1 && (
                  <button
                    type="button"
                    className="nx-image-arrow nx-image-arrow-left"
                    onClick={handlePreviousImage}
                    aria-label="Previous product image"
                  >
                    ❮
                  </button>
                )}

                {/* Next Arrow */}

                {productImages.length > 1 && (
                  <button
                    type="button"
                    className="nx-image-arrow nx-image-arrow-right"
                    onClick={handleNextImage}
                    aria-label="Next product image"
                  >
                    ❯
                  </button>
                )}

                {/* Magnifier */}

                {isZooming && activeImage && (
                  <div
                    className="nx-image-magnifier"
                    style={{
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      backgroundImage: `url(${activeImage})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                )}

              </div>

              {/* =====================================
                  IMAGE DOTS
                  ===================================== */}

              {productImages.length > 1 && (
                <div className="nx-image-dots">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={index === currentImage ? "active" : ""}
                      onClick={() => setCurrentImage(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      {index === currentImage ? "●" : "○"}
                    </button>
                  ))}
                </div>
              )}

              {/* =====================================
                  THUMBNAILS
                  ===================================== */}

              {productImages.length > 1 && (
                <div className="nx-product-thumbnails">
                  {productImages.map((image, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`nx-product-thumbnail ${
                        index === currentImage ? "active" : ""
                      }`}
                      onClick={() => setCurrentImage(index)}
                      aria-label={`Select product image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="nx-thumbnail-image"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>

          {/* =========================================
              RIGHT PRODUCT INFORMATION
              ========================================= */}

          <div className="nx-details-content">

            {/* Product Category */}

            <div className="nx-details-category">
              {product.category}
            </div>

            {/* Product Title */}

            <div className="nx-details-title-row">

              <h1>{product.name}</h1>

              <button
                type="button"
                className={`nx-details-wishlist ${isLiked ? "liked" : ""}`}
                onClick={() => toggleWishlist(product)}
                aria-label={
                  isLiked
                    ? `Remove ${product.name} from favorites`
                    : `Save ${product.name}`
                }
              >
                <i
                  className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
                ></i>
              </button>

            </div>

            {/* Rating */}

            <div className="nx-details-rating">

              <span className="nx-rating-stars">★★★★★</span>

              <strong>{product.rating}</strong>

              <span>({product.reviews ?? 0} reviews)</span>

            </div>

            {/* Price */}

            <div className="nx-details-price">

              <span className="nx-current-price">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.oldPrice && (
                <span className="nx-old-price">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}

            </div>

            {/* Badge */}

            <div className="nx-details-badge">
              {product.badge || (product.isActive ? "IN STOCK" : "CATALOG ITEM")}
            </div>

            {/* Stock */}

            <div className="nx-details-stock">

              <span className="nx-stock-dot"></span>

              <span>
                {product.stock ||
                  (product.stockQuantity !== undefined
                    ? `${product.stockQuantity} in stock`
                    : "In Stock")}
              </span>

            </div>

            {/* Product Short Description */}

            <div className="nx-details-description">

              <p>
                {product.description ||
                  product.summary ||
                  `${product.name} is designed for reliable everyday use, practical operations, and high efficiency.`}
              </p>

            </div>

            {/* Quick Specification */}

            <div className="nx-details-quick-spec">

              <div>
                <span>Product Category</span>
                <strong>{product.category}</strong>
              </div>

              <div>
                <span>Stock Quantity</span>
                <strong>
                  {product.stockQuantity !== undefined
                    ? `${product.stockQuantity} Units`
                    : "Available"}
                </strong>
              </div>

            </div>

            {/* Quantity + Cart */}

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
              >
                <i className="bi bi-cart3"></i>
                Add to Cart
              </button>

              <button
                type="button"
                className="nx-buy-now-details"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

            </div>

            {/* Product Reference */}

            <div className="nx-product-reference">

              <span>Product ID</span>

              <strong>
                NX-{String(product.id).padStart(4, "0")}
              </strong>

            </div>

          </div>

        </div>

        {/* =========================================
            PRODUCT INFORMATION
            ========================================= */}

        <section className="nx-product-information">

          {/* =====================================
              PRODUCT SUMMARY
              ===================================== */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-file-text"></i>

              <div>
                <h2>Product Summary</h2>
                <p>Product overview and business application</p>
              </div>

            </div>

            <p className="nx-summary-text">
              {product.description ||
                product.summary ||
                `${product.name} is a verified solution in the ${product.category} catalog, engineered for reliable everyday use and continuous performance.`}
            </p>

          </div>

          {/* =====================================
              KEY FEATURES
              ===================================== */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-stars"></i>

              <div>
                <h2>Key Features</h2>
                <p>Core capabilities and product highlights</p>
              </div>

            </div>

            <div className="nx-professional-features">
              {(
                product.features || [
                  "Modern user-friendly design",
                  "Reliable performance for continuous operation",
                  "High quality materials and construction",
                  "Suitable for both professional and consumer use",
                  "Designed for convenient daily operation",
                ]
              ).map((feature, index) => (
                <div className="nx-professional-feature" key={index}>
                  <div className="nx-feature-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

          </div>

          {/* =====================================
              PRODUCT DETAILS
              ===================================== */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-info-circle"></i>

              <div>
                <h2>Product Details</h2>
                <p>General product information</p>
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
                      product.stockQuantity !== undefined
                        ? `${product.stockQuantity} in stock`
                        : "In Stock",
                  },
                  {
                    label: "Customer Rating",
                    value: `${product.rating} / 5.0`,
                  },
                  {
                    label: "Customer Reviews",
                    value: `${product.reviews ?? 0} Reviews`,
                  },
                  {
                    label: "Product ID",
                    value: `NX-${String(product.id).padStart(4, "0")}`,
                  },
                ]
              ).map((detail, index) => (
                <div className="nx-spec-row" key={index}>
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>

          </div>

          {/* =====================================
              TECHNICAL SPECIFICATIONS
              ===================================== */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-cpu"></i>

              <div>
                <h2>Technical Specifications</h2>
                <p>Technical configuration and specifications</p>
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
                      product.stockQuantity !== undefined
                        ? `${product.stockQuantity} Units`
                        : "In Stock",
                  },
                  {
                    label: "Catalog Status",
                    value: product.isActive ? "Active" : "Inactive",
                  },
                ]
              ).map((specification, index) => (
                <div className="nx-spec-row" key={index}>
                  <span>{specification.label}</span>
                  <strong>{specification.value}</strong>
                </div>
              ))}
            </div>

          </div>

          {/* =====================================
              BOTTOM FEATURES
              ===================================== */}

          <section className="nx-details-bottom">

            <div className="nx-bottom-card">
              <i className="bi bi-truck"></i>
              <div>
                <strong>Reliable Delivery</strong>
                <span>Secure shipping directly to your location</span>
              </div>
            </div>

            <div className="nx-bottom-card">
              <i className="bi bi-shield-check"></i>
              <div>
                <strong>Quality Assurance</strong>
                <span>Verified product catalog standards</span>
              </div>
            </div>

            <div className="nx-bottom-card">
              <i className="bi bi-headset"></i>
              <div>
                <strong>Technical Support</strong>
                <span>Support team available for product inquiries</span>
              </div>
            </div>

          </section>

        </section>

      </section>

    </div>
  );
}

export default ProductDetails;