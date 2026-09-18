import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const cartItems = cart.reduce<
    {
      product: (typeof cart)[number];
      quantity: number;
    }[]
  >((items, product) => {
    const existingItem = items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        product,
        quantity: 1,
      });
    }

    return items;
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <main className="cart-page">
      <div className="container">

        <div className="cart-header">
          <div>
            <span className="cart-eyebrow">
              SHOPPING CART
            </span>

            <h1>Shopping Cart</h1>

            <p>
              Review your selected products before checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              className="clear-cart-btn"
              onClick={clearCart}
            >
              <i className="bi bi-trash3"></i>
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <i className="bi bi-cart-x"></i>
            </div>

            <h2>Your Cart is Empty</h2>

            <p>
              You haven't added any products to your cart yet.
            </p>

            <Link
              to="/products"
              className="btn btn-primary"
            >
              Browse Products
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        ) : (
          <div className="row g-4">

            <div className="col-lg-8">
              <div className="cart-card">

                <div className="cart-card-header">
                  <div>
                    <span>SELECTED PRODUCTS</span>

                    <h3>Cart Items</h3>
                  </div>

                  <strong>
                    {cart.length}{" "}
                    {cart.length === 1 ? "Item" : "Items"}
                  </strong>
                </div>

                <div className="cart-items">

                  {cartItems.map((item) => {
                    const product = item.product;

                    return (
                      <div
                        className="cart-item"
                        key={product.id}
                      >

                        <div className="cart-product-image">
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        </div>

                        <div className="cart-product-details">
                          <h4>{product.name}</h4>

                          {"category" in product &&
                            product.category && (
                              <span className="cart-category">
                                {product.category}
                              </span>
                            )}

                          <div className="cart-product-price">
                            ₹
                            {product.price.toLocaleString(
                              "en-IN"
                            )}
                          </div>
                        </div>

                        <div className="cart-quantity-section">
                          <span className="quantity-label">
                            QUANTITY
                          </span>

                          <div className="quantity-control">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(product.id)
                              }
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              onClick={() =>
                                addToCart(product)
                              }
                              aria-label="Increase quantity"
                            >
                              +
                            </button>

                          </div>
                        </div>

                        <div className="cart-item-total">
                          <span>ITEM TOTAL</span>

                          <strong>
                            ₹
                            {(
                              product.price *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="cart-remove-btn"
                          onClick={() =>
                            removeFromCart(product.id)
                          }
                          aria-label={`Remove ${product.name}`}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>

                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            <div className="col-lg-4">

              <div className="cart-summary">

                <div className="summary-heading">
                  <span>ORDER SUMMARY</span>

                  <h3>Checkout Details</h3>
                </div>

                <div className="summary-row">
                  <span>Products</span>

                  <strong>{cart.length}</strong>
                </div>

                <div className="summary-row">
                  <span>Subtotal</span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>

                  <strong className="free-text">
                    FREE
                  </strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>

                  <strong>
                    ₹
                    {total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <Link
                  to="/checkout"
                  className="checkout-btn"
                >
                  Proceed to Checkout
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <Link
                  to="/products"
                  className="continue-shopping"
                >
                  <i className="bi bi-arrow-left"></i>
                  Continue Shopping
                </Link>

              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}