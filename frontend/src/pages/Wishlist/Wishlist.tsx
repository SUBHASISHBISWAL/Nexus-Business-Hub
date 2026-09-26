import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useWishlist } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { getProductById } from "../../services/productService";
import type { Product } from "../../types/product";

import "./Wishlist.css";

export default function Wishlist() {
  const {
    wishlist,
    wishlistProducts,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [notification, setNotification] = useState<string>("");
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync wishlist items from context & API
  useEffect(() => {
    if (wishlist.length === 0) {
      setSavedProducts([]);
      return;
    }

    const currentMap = new Map<number, Product>();

    // Seed map with products already available in context
    wishlistProducts.forEach((product) => {
      if (wishlist.includes(product.id)) {
        currentMap.set(product.id, product);
      }
    });

    const missingIds = wishlist.filter((id) => !currentMap.has(id));

    // If all products are already cached in context, render immediately
    if (missingIds.length === 0) {
      const items = wishlist
        .map((id) => currentMap.get(id))
        .filter((item): item is Product => item !== undefined);
      setSavedProducts(items);
      return;
    }

    // Otherwise, fetch missing products from the backend API
    let isMounted = true;
    setLoading(true);

    Promise.all(
      missingIds.map(async (id) => {
        try {
          return await getProductById(id);
        } catch {
          return null;
        }
      })
    ).then((fetched) => {
      if (!isMounted) return;

      fetched.forEach((item) => {
        if (item) {
          currentMap.set(item.id, item);
        }
      });

      const finalItems = wishlist
        .map((id) => currentMap.get(id))
        .filter((item): item is Product => item !== undefined);

      setSavedProducts(finalItems);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [wishlist, wishlistProducts]);

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
    removeFromWishlist(productId);
  };

  // Clear entire wishlist
  const handleClearWishlist = () => {
    clearWishlist();
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
          {!loading && savedProducts.length === 0 ? (
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
                        {product.specs ||
                          product.description ||
                          `${product.category} · Stock: ${product.stockQuantity ?? 0}`}
                      </p>

                      <div className="wishlist-card-stock">
                        <i className="bi bi-shield-check"></i>
                        <span>
                          {product.stock ||
                            (product.stockQuantity !== undefined
                              ? `${product.stockQuantity} in stock`
                              : "In Stock")}
                        </span>
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
                          <small>({product.reviews ?? 0})</small>
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
