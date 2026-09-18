import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../data/products";


import product1Image from "../../assets/product-images/product1.jpg";
import product1Image2 from "../../assets/product-images/product1-2.jpg";
import product1Image3 from "../../assets/product-images/product1-3.jpg";
import product1Image4 from "../../assets/product-images/product1-4.jpg";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const [isZooming, setIsZooming] = useState(false);

  if (!product) {
    return (
      <div className="nx-product-not-found">
        <span className="material-symbols-outlined">
          search_off
        </span>

        <h2>Product Not Found</h2>

        <p>
          The product you are looking for does not exist.
        </p>

        <Link
          to="/products"
          className="nx-back-products"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  /*
   * Product Gallery
   * Product 1 has four real images.
   * Other products currently use their main image
   * for all four gallery positions.
   */
  const productImages =
    product.id === 1
      ? [
          product1Image,
          product1Image2,
          product1Image3,
          product1Image4,
        ]
      : [
          product.image,
          product.image,
          product.image,
          product.image,
        ];

  const isLiked = wishlist.includes(product.id);

  /* Image Mouse Move */
  const handleImageMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * 100;

    const y =
      ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x,
      y,
    });
  };

  /* Previous Image */
  const handlePreviousImage = () => {
    setCurrentImage((previous) =>
      previous === 0
        ? productImages.length - 1
        : previous - 1
    );
  };

  /* Next Image */
  const handleNextImage = () => {
    setCurrentImage((previous) =>
      previous === productImages.length - 1
        ? 0
        : previous + 1
    );
  };

  /* Quantity */
  const decreaseQuantity = () => {
    setQuantity((previous) =>
      Math.max(1, previous - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((previous) => previous + 1);
  };

  /* Add To Cart */
  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }
  };

  /* Buy Now */
  const handleBuyNow = () => {
    for (let index = 0; index < quantity; index++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  return (
    <div className="nx-product-details-page">

      {/* Breadcrumb */}
      <div className="container nx-details-breadcrumb">
        <Link to="/">Home</Link>

        <span>/</span>

        <Link to="/products">Products</Link>

        <span>/</span>

        <span>{product.name}</span>
      </div>


      {/* MAIN PRODUCT SECTION */}
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
                onMouseEnter={() =>
                  setIsZooming(true)
                }
                onMouseLeave={() =>
                  setIsZooming(false)
                }
              >

                <img
                  src={productImages[currentImage]}
                  alt={`${product.name} ${
                    currentImage + 1
                  }`}
                  className="nx-details-image"
                />


                {/* Previous Arrow */}

                <button
                  type="button"
                  className="nx-image-arrow nx-image-arrow-left"
                  onClick={handlePreviousImage}
                  aria-label="Previous product image"
                >
                  ❮
                </button>


                {/* Next Arrow */}

                <button
                  type="button"
                  className="nx-image-arrow nx-image-arrow-right"
                  onClick={handleNextImage}
                  aria-label="Next product image"
                >
                  ❯
                </button>


                {/* Magnifier */}

                {isZooming && (
                  <div
                    className="nx-image-magnifier"
                    style={{
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      backgroundImage: `url(${productImages[currentImage]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                )}

              </div>


              {/* IMAGE DOTS */}

              <div className="nx-image-dots">

                {productImages.map(
                  (_, index) => (
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
                    >
                      {index === currentImage
                        ? "●"
                        : "○"}
                    </button>
                  )
                )}

              </div>


              {/* THUMBNAILS */}

              <div className="nx-product-thumbnails">

                {productImages.map(
                  (image, index) => (
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
                      />
                    </button>
                  )
                )}

              </div>

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
                className={`nx-details-wishlist ${
                  isLiked ? "liked" : ""
                }`}
                onClick={() =>
                  toggleWishlist(product.id)
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
                ({product.reviews} reviews)
              </span>

            </div>


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

            </div>


            {/* Badge */}

            <div className="nx-details-badge">
              {product.badge}
            </div>


            {/* Stock */}

            <div className="nx-details-stock">
              <span className="nx-stock-dot"></span>

              <span>{product.stock}</span>
            </div>


            {/* Product Short Description */}

            <div className="nx-details-description">

              <p>
                {product.summary ||
                  `${product.name} is designed for reliable industrial deployment, secure operation, and efficient performance in demanding business environments.`}
              </p>

            </div>


            {/* Quick Specification */}

            <div className="nx-details-quick-spec">

              <div>
                <span>Product Group</span>

                <strong>
                  {product.group}
                </strong>
              </div>

              <div>
                <span>Specifications</span>

                <strong>
                  {product.specs}
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

              <span>
                Product ID
              </span>

              <strong>
                NX-
                {String(product.id).padStart(
                  4,
                  "0"
                )}
              </strong>

            </div>

          </div>

        </div>


        {/* =========================================
            PRODUCT INFORMATION
            ========================================= */}

        <section className="nx-product-information">


          {/* PRODUCT SUMMARY */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-file-text"></i>

              <div>
                <h2>Product Summary</h2>

                <p>
                  Product overview and business
                  application
                </p>
              </div>

            </div>


            <p className="nx-summary-text">

              {product.summary ||
                `${product.name} is an enterprise-grade ${product.group.toLowerCase()} solution designed for reliable industrial deployment. It provides secure, stable and efficient operation for demanding business and industrial environments.`}

            </p>

          </div>


          {/* KEY FEATURES */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-stars"></i>

              <div>
                <h2>Key Features</h2>

                <p>
                  Core capabilities and product
                  highlights
                </p>
              </div>

            </div>


            <div className="nx-professional-features">

              {(
                product.features || [
                  "Industrial-grade hardware architecture",
                  "Reliable performance for continuous operation",
                  "Enterprise-ready security and deployment",
                  "Designed for demanding industrial environments",
                ]
              ).map(
                (feature, index) => (
                  <div
                    className="nx-professional-feature"
                    key={index}
                  >

                    <div className="nx-feature-icon">

                      <i className="bi bi-check-lg"></i>

                    </div>

                    <span>
                      {feature}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>


          {/* PRODUCT DETAILS */}

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
                    label: "Product Group",
                    value: product.group,
                  },
                  {
                    label: "Availability",
                    value: product.stock,
                  },
                  {
                    label: "Customer Rating",
                    value: `${product.rating} / 5`,
                  },
                  {
                    label: "Customer Reviews",
                    value: `${product.reviews} Reviews`,
                  },
                  {
                    label: "Product ID",
                    value: `NX-${String(
                      product.id
                    ).padStart(4, "0")}`,
                  },
                ]
              ).map(
                (detail, index) => (
                  <div
                    className="nx-spec-row"
                    key={index}
                  >

                    <span>
                      {detail.label}
                    </span>

                    <strong>
                      {detail.value}
                    </strong>

                  </div>
                )
              )}

            </div>

          </div>


          {/* TECHNICAL SPECIFICATIONS */}

          <div className="nx-info-card">

            <div className="nx-info-title">

              <i className="bi bi-cpu"></i>

              <div>
                <h2>
                  Technical Specifications
                </h2>

                <p>
                  Technical configuration and
                  specifications
                </p>
              </div>

            </div>


            <div className="nx-spec-table">

              {(
                product.specifications || [
                  {
                    label: "Core Specifications",
                    value: product.specs,
                  },
                  {
                    label: "Product Category",
                    value: product.category,
                  },
                  {
                    label: "Product Group",
                    value: product.group,
                  },
                  {
                    label: "Deployment",
                    value:
                      "Industrial / Enterprise",
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


          {/* =========================================
              BOTTOM FEATURES
              ========================================= */}

          <section className="nx-details-bottom">

            <div className="nx-bottom-card">

              <i className="bi bi-truck"></i>

              <div>
                <strong>
                  Reliable Delivery
                </strong>

                <span>
                  Secure enterprise shipping
                </span>
              </div>

            </div>


            <div className="nx-bottom-card">

              <i className="bi bi-shield-check"></i>

              <div>
                <strong>
                  Enterprise Quality
                </strong>

                <span>
                  Certified industrial products
                </span>
              </div>

            </div>


            <div className="nx-bottom-card">

              <i className="bi bi-headset"></i>

              <div>
                <strong>
                  Technical Support
                </strong>

                <span>
                  Expert assistance available
                </span>
              </div>

            </div>

          </section>

        </section>

      </section>

    </div>
  );
}

export default ProductDetails;