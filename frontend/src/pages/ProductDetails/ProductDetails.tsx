import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { products } from "../../data/products";
import type { Product } from "../../types/product";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { wishlist, toggleWishlist } = useWishlist();

  const product = products.find(
    (item) => item.id === Number(id)
  ) as Product | undefined;

  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  if (!product) {
    return (
      <div className="nx-details-page">
        <div className="container nx-details-not-found">
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

  return (
    <div className="nx-details-page">
      <div className="container nx-details-shell">

        {/* Breadcrumb */}
        <div className="nx-details-breadcrumb">
          <Link to="/products">
            Products
          </Link>

          <i className="bi bi-chevron-right"></i>

          <span>
            {product.category}
          </span>

          <i className="bi bi-chevron-right"></i>

          <span>
            {product.name}
          </span>
        </div>

        {/* Notification */}
        {notice && (
          <div
            className="nx-details-notice"
            role="status"
          >
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

              <img
                src={product.image}
                alt={product.name}
                className="nx-details-image"
              />

              {/* Badge */}
              {product.badge && (
                <span className="nx-details-badge">
                  {product.badge}
                </span>
              )}

              {/* Wishlist */}
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
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
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
          </div>

          {/* RIGHT - PRODUCT INFORMATION */}
          <div className="nx-details-info">

            {/* Category */}
            <div className="nx-details-category">
              {product.category} · {product.group}
            </div>

            {/* Product Name */}
            <h1>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="nx-details-rating">

              <div className="nx-stars">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <i
                      key={index}
                      className={`bi ${
                        index <
                        Math.round(product.rating)
                          ? "bi-star-fill"
                          : "bi-star"
                      }`}
                    ></i>
                  )
                )}
              </div>

              <strong>
                {product.rating}
              </strong>

              <span>
                ({product.reviews} reviews)
              </span>

            </div>

            {/* Divider */}
            <div className="nx-details-divider"></div>

            {/* Price */}
            <div className="nx-details-price">

              <span className="nx-current-price">
                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}
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

            {/* Saving */}
            {product.oldPrice && (
              <div className="nx-saving-text">
                Save ₹
                {(
                  product.oldPrice -
                  product.price
                ).toLocaleString("en-IN")}
              </div>
            )}

            {/* Product Description */}
            <p className="nx-details-description">
              {product.specs}
            </p>

            {/* Technical Specifications */}
            <div className="nx-details-spec-box">

              <div className="nx-spec-title">
                <i className="bi bi-cpu"></i>

                Technical Specifications
              </div>

              <div className="nx-spec-row">
                <span>
                  Product Group
                </span>

                <strong>
                  {product.group}
                </strong>
              </div>

              <div className="nx-spec-row">
                <span>
                  Category
                </span>

                <strong>
                  {product.category}
                </strong>
              </div>

              <div className="nx-spec-row">
                <span>
                  Specifications
                </span>

                <strong>
                  {product.specs}
                </strong>
              </div>

              <div className="nx-spec-row">
                <span>
                  Availability
                </span>

                <strong>
                  {product.stock}
                </strong>
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

                  <span>
                    {quantity}
                  </span>

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

      </div>
    </div>
  );
}

export default ProductDetails;