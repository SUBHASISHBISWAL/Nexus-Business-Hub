import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../data/products";
import type { Product } from "../../types/product";

import product1Image from "../../assets/product-images/product1.jpg";
import product1Image2 from "../../assets/product-images/product1-2.jpg";
import product1Image3 from "../../assets/product-images/product1-3.jpg";
import product1Image4 from "../../assets/product-images/product1-4.jpg";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  const product = products.find((item) => item.id === Number(id)) as
    Product | undefined;

  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  // Amazon-style image magnifier
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const [isZooming, setIsZooming] = useState(false);

  /*
   * Product Images
   *
   * Product 1 has 4 different images.
   * Other products currently use their existing image.
   */
  const productImages = product
    ? product.id === 1
      ? [product1Image, product1Image2, product1Image3, product1Image4]
      : [product.image, product.image, product.image, product.image]
    : [];

  if (!product) {
    return (
      <div className="nx-details-page">
        <div className="container nx-details-not-found">
          <span className="material-symbols-outlined">search_off</span>

          <h2>Product Not Found</h2>

          <p>The product you are looking for does not exist.</p>

          <Link to="/products" className="nx-back-products">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isLiked = wishlist.includes(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    setNotice(`${product.name} added to cart`);

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleIncrease = () => {
    setQuantity((current) => current + 1);
  };

  const handleRequestQuote = () => {
    setNotice("Quote request submitted successfully");

    window.setTimeout(() => {
      setNotice("");
    }, 2600);
  };

  const handlePreviousImage = () => {
    setCurrentImage((current) =>
      current === 0 ? productImages.length - 1 : current - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImage((current) =>
      current === productImages.length - 1 ? 0 : current + 1,
    );
  };

  // Amazon-style cursor tracking
  const handleImageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;

    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x,
      y,
    });
  };

  return (
    <div className="nx-details-page">
      <div className="container nx-details-shell">
        {/* Breadcrumb */}
        <div className="nx-details-breadcrumb">
          <Link to="/products">Products</Link>

          <i className="bi bi-chevron-right"></i>

          <span>{product.category}</span>

          <i className="bi bi-chevron-right"></i>

          <span>{product.name}</span>
        </div>

        {/* Notification */}
        {notice && (
          <div className="nx-details-notice" role="status">
            <i className="bi bi-check-circle-fill"></i>

            <span>{notice}</span>
          </div>
        )}

        {/* Back Button */}
        <button
          type="button"
          className="nx-back-button"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Products
        </button>

        {/* Product Details Card */}
        <section className="nx-details-card">
          {/* LEFT - PRODUCT IMAGE */}
          <div className="nx-details-image-section">
            <div className="nx-details-image-wrap">
              {/* Previous Image Button */}
              <button
                type="button"
                className="nx-image-arrow nx-image-arrow-left"
                onClick={handlePreviousImage}
                aria-label="Previous product image"
              >
                ❮
              </button>

              {/* Product Image + Amazon Magnifier */}
              <div
                className="nx-image-zoom-area"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
              >
                <img
                  src={productImages[currentImage]}
                  alt={`${product.name} ${currentImage + 1}`}
                  className="nx-details-image"
                />

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

              {/* Next Image Button */}
              <button
                type="button"
                className="nx-image-arrow nx-image-arrow-right"
                onClick={handleNextImage}
                aria-label="Next product image"
              >
                ❯
              </button>

              {/* Badge */}
              {product.badge && (
                <span className="nx-details-badge">{product.badge}</span>
              )}

              {/* Wishlist */}
              <button
                type="button"
                className={`nx-details-wishlist ${isLiked ? "liked" : ""}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={
                  isLiked
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
              >
                <i
                  className={`bi ${isLiked ? "bi-heart-fill" : "bi-heart"}`}
                ></i>
              </button>

              {/* Image Dots */}
              <div className="nx-image-dots">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`nx-image-dot ${
                      currentImage === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`View product image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Product Thumbnails */}
              <div className="nx-product-thumbnails">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`nx-product-thumbnail ${
                      currentImage === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="nx-thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT - PRODUCT INFORMATION */}
          <div className="nx-details-info">
            {/* Category */}
            <div className="nx-details-category">
              {product.category} · {product.group}
            </div>

            {/* Product Name */}
            <h1>{product.name}</h1>

            {/* Rating */}
            <div className="nx-details-rating">
              <div className="nx-stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i
                    key={index}
                    className={`bi ${
                      index < Math.round(product.rating)
                        ? "bi-star-fill"
                        : "bi-star"
                    }`}
                  ></i>
                ))}
              </div>

              <strong>{product.rating}</strong>

              <span>({product.reviews} reviews)</span>
            </div>

            {/* Divider */}
            <div className="nx-details-divider"></div>

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

            {/* Saving */}
            {product.oldPrice && (
              <div className="nx-saving-text">
                Save ₹
                {(product.oldPrice - product.price).toLocaleString("en-IN")}
              </div>
            )}

            {/* Product Description */}
            <p className="nx-details-description">{product.specs}</p>

            {/* Technical Specifications */}
            <div className="nx-details-spec-box">
              <div className="nx-spec-title">
                <i className="bi bi-cpu"></i>
                Technical Specifications
              </div>

              <div className="nx-spec-row">
                <span>Product Group</span>

                <strong>{product.group}</strong>
              </div>

              <div className="nx-spec-row">
                <span>Category</span>

                <strong>{product.category}</strong>
              </div>

              <div className="nx-spec-row">
                <span>Specifications</span>

                <strong>{product.specs}</strong>
              </div>

              <div className="nx-spec-row">
                <span>Availability</span>

                <strong>{product.stock}</strong>
              </div>
            </div>

            {/* Stock */}
            <div className="nx-details-stock">
              <span className="nx-stock-dot"></span>

              {product.stock}
            </div>

            {/* Add To Cart */}
            {!product.requestOnly && (
              <div className="nx-details-actions">
                {/* Quantity */}
                <div className="nx-quantity">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    aria-label="Decrease quantity"
                  >
                    <i className="bi bi-dash"></i>
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    aria-label="Increase quantity"
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                {/* Add Cart */}
                <button
                  type="button"
                  className="nx-add-cart-button"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            )}

            {/* Request Quote */}
            {product.requestOnly && (
              <button
                type="button"
                className="nx-request-button"
                onClick={handleRequestQuote}
              >
                <i className="bi bi-send"></i>
                Request a Quote
              </button>
            )}
          </div>
        </section>

        {/* Bottom Features */}
        <section className="nx-details-bottom">
          <div className="nx-bottom-card">
            <i className="bi bi-truck"></i>

            <div>
              <strong>Reliable Delivery</strong>

              <span>Secure enterprise shipping</span>
            </div>
          </div>

          <div className="nx-bottom-card">
            <i className="bi bi-shield-check"></i>

            <div>
              <strong>Enterprise Quality</strong>

              <span>Certified industrial products</span>
            </div>
          </div>

          <div className="nx-bottom-card">
            <i className="bi bi-headset"></i>

            <div>
              <strong>Technical Support</strong>

              <span>Expert assistance available</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetails;
