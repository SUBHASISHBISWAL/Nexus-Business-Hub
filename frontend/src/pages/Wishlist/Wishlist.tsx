import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { products } from "../../data/products";
import type { Product } from "../../types/product";

import "./Wishlist.css";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [notification, setNotification] = useState<string>("");

  // Filter products that exist in wishlist
  const savedProducts = useMemo<Product[]>(() => {
    return products.filter((product) => wishlist.includes(product.id));
  }, [wishlist]);

  // Add individual product to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showNotification(`"${product.name}" added to your cart.`);
  };

  // Add all saved products to cart
  const handleAddAllToCart = () => {
    savedProducts.forEach((product) => addToCart(product));
    showNotification(`All ${savedProducts.length} items added to your cart.`);
  };

  // Remove individual product from wishlist
  const handleRemove = (productId: number) => {
    toggleWishlist(productId);
  };

  // Clear entire wishlist
  const handleClearWishlist = () => {
    wishlist.forEach((id) => toggleWishlist(id));
  };

  // Helper to show temporary notification banner
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3200);
  };

  return (
    <div className="wishlist-page">

      {/* =========================================
          TOAST NOTIFICATION
      ========================================= */}
      {notification && (
        <div className="wishlist-toast" role="status" aria-live="polite">
          <i className="bi bi-check-circle-fill"></i>
          <span>{notification}</span>
        </div>
      )}

      {/* =========================================
          WISHLIST HEADER
      ========================================= */}
      <section className="wishlist-header">
        <div className="container">
          <span className="wishlist-eyebrow">SAVED HARDWARE &amp; SOLUTIONS</span>
          <h1>My Wishlist</h1>
          <p>
            Review and manage products you saved for enterprise evaluation and purchase.
          </p>
        </div>
      </section>

      {/* =========================================
          WISHLIST CONTENT
      ========================================= */}
      <section className="wishlist-content">
        <div className="container">

          {/* =====================================
              EMPTY WISHLIST
          ===================================== */}
          {savedProducts.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-wishlist-icon">
                <i className="bi bi-heart"></i>
              </div>

              <h2>Your Wishlist is Empty</h2>

              <p>
                You haven&apos;t saved any hardware or software components yet.
                Explore our catalog to find enterprise solutions and save them for later.
              </p>

              <div className="empty-wishlist-actions">
                <Link to="/products" className="browse-products-btn">
                  Explore Products
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          ) : (

            /* =====================================
               WISHLIST PRODUCT GRID / TABLE
            ===================================== */
            <div className="wishlist-wrapper">

              {/* TOOLBAR */}
              <div className="wishlist-toolbar">
                <div className="wishlist-count-info">
                  <h2>Saved Products</h2>
                  <span className="wishlist-badge-count">
                    {savedProducts.length}{" "}
                    {savedProducts.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="wishlist-toolbar-actions">
                  <button
                    type="button"
                    className="wishlist-add-all-btn"
                    onClick={handleAddAllToCart}
                  >
                    <i className="bi bi-cart-plus"></i>
                    Add All to Cart
                  </button>

                  <button
                    type="button"
                    className="wishlist-clear-btn"
                    onClick={handleClearWishlist}
                  >
                    <i className="bi bi-trash3"></i>
                    Clear Wishlist
                  </button>

                  <Link to="/products" className="wishlist-back-btn">
                    <i className="bi bi-arrow-left"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* PRODUCT CARDS */}
              <div className="wishlist-grid">
                {savedProducts.map((product) => (
                  <article className="wishlist-card" key={product.id}>

                    {/* PRODUCT IMAGE & LINK */}
                    <div className="wishlist-card-visual">
                      <Link
                        to={`/products/${product.id}`}
                        className="wishlist-image-link"
                        aria-label={`View ${product.name}`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                        />
                      </Link>

                      {product.badge && (
                        <span className="wishlist-badge-tag">
                          {product.badge}
                        </span>
                      )}

                      <button
                        type="button"
                        className="wishlist-quick-remove"
                        onClick={() => handleRemove(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        title="Remove from wishlist"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>

                    {/* PRODUCT BODY */}
                    <div className="wishlist-card-body">
                      <div className="wishlist-card-meta">
                        <span className="wishlist-category-pill">
                          {product.category}
                        </span>

                        <span className="wishlist-sku">
                          SKU: NX-{product.id}
                        </span>
                      </div>

                      <h3 className="wishlist-product-title">
                        <Link to={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>

                      <p className="wishlist-product-specs">
                        {product.specs}
                      </p>

                      <div className="wishlist-card-stock">
                        <i className="bi bi-shield-check"></i>
                        <span>{product.stock || "In Stock"}</span>
                      </div>

                      {/* PRICING */}
                      <div className="wishlist-price-row">
                        <div className="wishlist-price-wrap">
                          <span className="wishlist-current-price">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.oldPrice && (
                            <span className="wishlist-old-price">
                              ₹{product.oldPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        <div className="wishlist-rating">
                          <i className="bi bi-star-fill"></i>
                          <span>{product.rating}</span>
                          <small>({product.reviews})</small>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="wishlist-card-actions">
                        <button
                          type="button"
                          className="wishlist-btn-cart"
                          onClick={() => handleAddToCart(product)}
                        >
                          <i className="bi bi-bag-plus"></i>
                          Add to Cart
                        </button>

                        <button
                          type="button"
                          className="wishlist-btn-details"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          Details
                        </button>
                      </div>
                    </div>

                  </article>
                ))}
              </div>

              {/* BOTTOM NAVIGATION */}
              <div className="wishlist-bottom-bar">
                <Link to="/products" className="wishlist-continue-link">
                  <i className="bi bi-arrow-left"></i>
                  Back to Products Catalog
                </Link>

                <Link to="/cart" className="wishlist-view-cart-link">
                  View Shopping Cart
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
