import { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import type { Product } from "../../types/product";

import "./Cart.css";

type GroupedCartItem = {
  product: Product;
  quantity: number;
};

export default function Cart() {
  const navigate = useNavigate();

  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  // =========================================
  // GROUP SAME PRODUCTS
  // =========================================

  const groupedCart = useMemo<GroupedCartItem[]>(() => {
    const productMap = new Map<number, GroupedCartItem>();

    cart.forEach((product) => {
      const existingProduct = productMap.get(product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        productMap.set(product.id, {
          product,
          quantity: 1,
        });
      }
    });

    return Array.from(productMap.values());
  }, [cart]);

  // =========================================
  // TOTAL ITEMS
  // =========================================

  const totalItems = cart.length;

  // =========================================
  // SUBTOTAL
  // =========================================

  const subtotal = cart.reduce((total, product) => total + product.price, 0);

  // =========================================
  // DELIVERY
  // =========================================

  const delivery = 0;

  // =========================================
  // FINAL TOTAL
  // =========================================

  const total = subtotal + delivery;

  // =========================================
  // PROCEED TO CHECKOUT
  // =========================================

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-page">
      {/* =====================================
          CART HEADER
      ===================================== */}

      <section className="cart-header">
        <div className="container">
          <span className="cart-eyebrow">SHOPPING CART</span>

          <h1>Shopping Cart</h1>

          <p>Review your selected products before checkout.</p>
        </div>
      </section>

      {/* =====================================
          CART CONTENT
      ===================================== */}

      <section className="cart-content">
        <div className="container">
          {/* ===================================
              EMPTY CART
          =================================== */}

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <i className="bi bi-bag"></i>
              </div>

              <h2>Your Cart is Empty</h2>

              <p>
                You haven't added any products to your cart yet. Explore our
                products and find something you need.
              </p>

              <Link to="/products" className="browse-products-btn">
                Browse Products
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          ) : (
            /* ===================================
               CART WITH PRODUCTS
            =================================== */

            <div className="cart-layout">
              {/* =================================
                  LEFT SIDE
              ================================= */}

              <div className="cart-products">
                {/* CART HEADING */}

                <div className="cart-section-heading">
                  <div>
                    <h2>Your Selected Products</h2>

                    <p className="cart-items-subtitle">
                      {groupedCart.length}{" "}
                      {groupedCart.length === 1 ? "Product" : "Products"}
                      {" • "}
                      {totalItems} {totalItems === 1 ? "Item" : "Items"}
                    </p>
                  </div>

                  {/* CLEAR CART */}

                  <button
                    type="button"
                    className="clear-cart-btn"
                    onClick={clearCart}
                  >
                    <i className="bi bi-trash3"></i>
                    Clear Cart
                  </button>
                </div>

                {/* =================================
                    PRODUCT LIST
                ================================= */}

                <div className="cart-product-list">
                  {groupedCart.map(({ product, quantity }) => (
                    <div className="cart-product-card" key={product.id}>
                      {/* PRODUCT IMAGE */}

                      <div className="cart-product-image">
                        <img
                          src={
                            product.image.startsWith("/src/")
                              ? product.image
                              : `/src/assets/product-images/${product.image}`
                          }
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.src =
                              "/src/assets/product-images/product1.jpg";
                          }}
                        />
                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="cart-product-details">
                        <span className="cart-product-category">
                          {product.category}
                        </span>

                        <h3>{product.name}</h3>

                        <p>Product SKU: NX-{product.id}</p>

                        <div className="cart-unit-price">
                          ₹{product.price.toLocaleString("en-IN")}
                          {" / item"}
                        </div>
                      </div>

                      {/* QUANTITY */}

                      <div className="cart-product-quantity">
                        <span>Quantity</span>

                        <div className="quantity-control">
                          {/* MINUS */}

                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => decreaseQuantity(product.id)}
                            aria-label={`Decrease ${product.name} quantity`}
                          >
                            −
                          </button>

                          {/* NUMBER */}

                          <span className="quantity-number">{quantity}</span>

                          {/* PLUS */}

                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() => addToCart(product)}
                            aria-label={`Increase ${product.name} quantity`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* PRODUCT TOTAL */}

                      <div className="cart-product-price">
                        <strong>
                          ₹{(product.price * quantity).toLocaleString("en-IN")}
                        </strong>
                      </div>

                      {/* REMOVE PRODUCT */}

                      <button
                        type="button"
                        className="remove-cart-item"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        title="Remove product"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {/* =================================
                    CONTINUE SHOPPING
                ================================= */}

                <div className="cart-bottom-actions">
                  <Link to="/products" className="continue-shopping">
                    <i className="bi bi-arrow-left"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* =================================
                  RIGHT SIDE
                  ORDER SUMMARY
              ================================= */}

              <aside className="cart-summary">
                <h2>Order Summary</h2>

                {/* PRODUCT COUNT */}

                <div className="summary-row">
                  <span>Products</span>

                  <strong>
                    {totalItems} {totalItems === 1 ? "Item" : "Items"}
                  </strong>
                </div>

                {/* SUBTOTAL */}

                <div className="summary-row">
                  <span>Subtotal</span>

                  <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                </div>

                {/* DELIVERY */}

                <div className="summary-row">
                  <span>Delivery</span>

                  <strong>Free</strong>
                </div>

                {/* DIVIDER */}

                <div className="summary-divider"></div>

                {/* TOTAL */}

                <div className="summary-total">
                  <span>Total Payable</span>

                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>

                {/* CHECKOUT */}

                <button
                  type="button"
                  className="checkout-btn"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                  <i className="bi bi-arrow-right"></i>
                </button>

                {/* SECURITY NOTE */}

                <div className="checkout-note">
                  <i className="bi bi-shield-check"></i>

                  <span>Secure checkout and reliable enterprise delivery.</span>
                </div>
              </aside>
            </div>
          )}

          {/* =====================================
              CART BENEFITS
          ===================================== */}

          <div className="cart-benefits">
            {/* DELIVERY */}

            <div className="cart-benefit">
              <i className="bi bi-truck"></i>

              <div>
                <h3>Reliable Delivery</h3>

                <p>Fast and secure product delivery.</p>
              </div>
            </div>

            {/* SECURITY */}

            <div className="cart-benefit">
              <i className="bi bi-shield-check"></i>

              <div>
                <h3>Secure Shopping</h3>

                <p>Safe and protected checkout experience.</p>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="cart-benefit">
              <i className="bi bi-box-seam"></i>

              <div>
                <h3>Enterprise Products</h3>

                <p>Quality hardware and technology solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
