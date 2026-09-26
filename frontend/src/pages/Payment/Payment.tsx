import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartContext";
import { createOrder } from "../../services/orderService";
import { processPayment } from "../../services/paymentService";
import "./Payment.css";

type PaymentMethod =
  | "upi"
  | "card"
  | "netbanking"
  | "other";

type CheckoutAddress = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

type CheckoutData = {
  address: CheckoutAddress;
  billingAddress: CheckoutAddress;
  sameBillingAddress: boolean;

  coupon: string;
  couponApplied: boolean;

  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
};

type PaymentResult = {
  orderId: number;
  orderNumber: string;
  paymentStatus: string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  paymentDate: string;
  shipment?: {
    trackingNumber: string;
    carrier: string;
    shipmentStatus: string;
    estimatedDeliveryDate: string;
  } | null;
};

function Payment() {
  const navigate = useNavigate();

  const cartContext = useContext(CartContext);

  const cart = cartContext?.cart ?? [];

  const clearCart = cartContext?.clearCart;

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [upiId, setUpiId] = useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [bank, setBank] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const [paymentResult, setPaymentResult] =
    useState<PaymentResult | null>(null);

  const [checkoutData, setCheckoutData] =
    useState<CheckoutData | null>(null);

  // =========================================================
  // LOAD CHECKOUT DATA
  // =========================================================

  useEffect(() => {
    const savedCheckout =
      sessionStorage.getItem("checkoutData");

    if (!savedCheckout) {
      navigate("/checkout", {
        replace: true,
      });

      return;
    }

    try {
      const parsed =
        JSON.parse(savedCheckout) as CheckoutData;

      setCheckoutData(parsed);
    } catch (err) {
      console.error(
        "Invalid checkout data:",
        err
      );

      sessionStorage.removeItem(
        "checkoutData"
      );

      navigate("/checkout", {
        replace: true,
      });
    }
  }, [navigate]);

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const subtotal = useMemo(() => {
    if (checkoutData) {
      return checkoutData.subtotal;
    }

    return cart.reduce(
      (total, product) =>
        total + product.price,
      0
    );
  }, [checkoutData, cart]);

  const shipping = checkoutData
    ? checkoutData.shipping
    : subtotal >= 5000
      ? 0
      : 250;

  const discount = checkoutData
    ? checkoutData.discount
    : 0;

  const tax = checkoutData
    ? checkoutData.tax
    : Math.round(
        (subtotal + shipping - discount) *
          0.18
      );

  const total = checkoutData
    ? checkoutData.total
    : subtotal + shipping - discount + tax;

  // =========================================================
  // FORMAT
  // =========================================================

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================================================
  // PAYMENT VALIDATION
  // =========================================================

  const validatePayment = () => {
    setError("");

    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        setError(
          "Please enter your UPI ID."
        );

        return false;
      }

      if (
        !upiId.includes("@") ||
        upiId.length < 5
      ) {
        setError(
          "Please enter a valid UPI ID."
        );

        return false;
      }
    }

    if (paymentMethod === "card") {
      const cleanCardNumber =
        cardNumber.replace(/\s/g, "");

      if (
        cleanCardNumber.length !== 16
      ) {
        setError(
          "Please enter a valid 16-digit card number."
        );

        return false;
      }

      if (!cardName.trim()) {
        setError(
          "Please enter the cardholder name."
        );

        return false;
      }

      if (!expiry.trim()) {
        setError(
          "Please enter the card expiry date."
        );

        return false;
      }

      if (cvv.length !== 3) {
        setError(
          "Please enter a valid 3-digit CVV."
        );

        return false;
      }
    }

    if (paymentMethod === "netbanking") {
      if (!bank) {
        setError(
          "Please select your bank."
        );

        return false;
      }
    }

    return true;
  };

  // =========================================================
  // PAYMENT METHOD NAME
  // =========================================================

  const getPaymentMethodName = () => {
    if (paymentMethod === "upi") {
      return "UPI";
    }

    if (paymentMethod === "card") {
      return "Card";
    }

    if (
      paymentMethod === "netbanking"
    ) {
      return "Net Banking";
    }

    return "Other";
  };

  // =========================================================
  // IMAGE
  // =========================================================

  const getProductImage = (
    product: typeof cart[number]
  ) => {
    const image =
      (product as typeof product & {
        image?: string;
      }).image;

    if (image) {
      if (image.startsWith("/src/")) {
        return image;
      }

      return `/src/assets/product-images/${image}`;
    }

    const imageNumber =
      ((product.id - 1) % 16) + 1;

    return `/src/assets/product-images/product${imageNumber}.jpg`;
  };

  // =========================================================
  // CREATE ORDER + PROCESS PAYMENT
  // =========================================================

  const handlePayNow = async () => {
    if (processing) {
      return;
    }

    if (cart.length === 0) {
      navigate("/cart");
      return;
    }

    if (!validatePayment()) {
      return;
    }

    if (!checkoutData) {
      setError(
        "Checkout information is missing. Please return to checkout."
      );

      return;
    }

    try {
      setProcessing(true);
      setError("");

      // -----------------------------------------------------
      // STEP 1: CREATE ORDER
      // -----------------------------------------------------

      const orderPayload = {
        subtotal: checkoutData.subtotal,

        shippingAmount:
          checkoutData.shipping,

        discountAmount:
          checkoutData.discount,

        taxAmount:
          checkoutData.tax,

        totalAmount:
          checkoutData.total,

        paymentMethod:
          getPaymentMethodName(),

        address: {
          fullName:
            checkoutData.address.fullName,

          phone:
            checkoutData.address.phone,

          addressLine:
            checkoutData.address.addressLine,

          city:
            checkoutData.address.city,

          state:
            checkoutData.address.state,

          pincode:
            checkoutData.address.pincode,
        },

        items: cart.map((product) => ({
          productId: product.id,

          productName:
            product.name,

          productImage:
            getProductImage(product)
              .replace(
                "/src/assets/product-images/",
                ""
              ),

          unitPrice:
            product.price,

          quantity: 1,
        })),
      };

      const createdOrder =
        await createOrder(
          orderPayload
        );

      // -----------------------------------------------------
      // STEP 2: PROCESS PAYMENT
      // -----------------------------------------------------

      const paymentResponse =
        await processPayment({
          orderId:
            createdOrder.id,

          paymentMethod:
            getPaymentMethodName(),
        });

      // -----------------------------------------------------
      // STEP 3: SUCCESS
      // -----------------------------------------------------

      setPaymentResult(
        paymentResponse
      );

      setPaymentSuccess(true);

      // Clear checkout data
      sessionStorage.removeItem(
        "checkoutData"
      );

      // Clear cart
      clearCart?.();

    } catch (err: any) {
      console.error(
        "Payment failed:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Payment could not be completed. Please try again.";

      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (paymentSuccess && paymentResult) {
  return (
    <div className="nx-payment-page nx-payment-success-page">
      <div className="container nx-payment-success-shell">

        {/* SUCCESS HEADER */}
        <div className="nx-success-hero">
          <div className="nx-success-check">
            <div className="nx-success-check-ring"></div>
            <i className="bi bi-check-lg"></i>
          </div>

          <span className="nx-success-eyebrow">
            ORDER CONFIRMED
          </span>

          <h1>Order successfully placed</h1>

          <p>
            Your payment has been verified and your order
            has been successfully confirmed.
          </p>

          <div className="nx-success-order-ref">
            <span>ORDER</span>
            <strong>{paymentResult.orderNumber}</strong>
          </div>
        </div>

        {/* SUCCESS CONTENT */}
        <div className="nx-success-grid">

          {/* LEFT SIDE */}
          <div className="nx-success-main">

            {/* PAYMENT DETAILS */}
            <section className="nx-success-card">

              <div className="nx-success-card-header">

                <div className="nx-success-card-icon payment">
                  <i className="bi bi-credit-card-2-front"></i>
                </div>

                <div>
                  <span>TRANSACTION</span>
                  <h2>Payment details</h2>
                </div>

                <div className="nx-success-paid-badge">
                  <i className="bi bi-check-circle-fill"></i>
                  Paid
                </div>

              </div>

              <div className="nx-success-payment-grid">

                <div>
                  <span>AMOUNT PAID</span>

                  <strong className="nx-success-amount">
                    {formatPrice(paymentResult.amount)}
                  </strong>
                </div>

                <div>
                  <span>PAYMENT METHOD</span>

                  <strong>
                    {paymentResult.paymentMethod}
                  </strong>
                </div>

                <div>
                  <span>TRANSACTION ID</span>

                  <strong className="nx-success-mono">
                    {paymentResult.transactionId}
                  </strong>
                </div>

                <div>
                  <span>PAYMENT STATUS</span>

                  <strong className="nx-success-status">
                    <i className="bi bi-check-circle-fill"></i>
                    {paymentResult.paymentStatus}
                  </strong>
                </div>

              </div>
            </section>

            {/* ORDER INFORMATION */}
            <section className="nx-success-card">

              <div className="nx-success-card-header">

                <div className="nx-success-card-icon order">
                  <i className="bi bi-box-seam"></i>
                </div>

                <div>
                  <span>ORDER INFORMATION</span>
                  <h2>Order details</h2>
                </div>

              </div>

              <div className="nx-order-confirmation-content">

                <div className="nx-order-confirmation-icon">
                  <i className="bi bi-check2-circle"></i>
                </div>

                <div>
                  <strong>
                    Your order has been confirmed
                  </strong>

                  <p>
                    We've received your order and payment.
                    You can view the complete order information
                    from your order details page.
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* RIGHT SIDE */}
          <aside className="nx-success-sidebar">

            <div className="nx-success-summary">

              <div className="nx-success-summary-top">
                <span>ORDER CONFIRMATION</span>

                <i className="bi bi-shield-check"></i>
              </div>

              <div className="nx-success-summary-amount">

                <span>Total paid</span>

                <strong>
                  {formatPrice(paymentResult.amount)}
                </strong>

              </div>

              <div className="nx-success-summary-divider"></div>

              <div className="nx-success-summary-row">

                <span>Order ID</span>

                <strong>
                  {paymentResult.orderNumber}
                </strong>

              </div>

              <div className="nx-success-summary-row">

                <span>Payment</span>

                <strong>
                  {paymentResult.paymentMethod}
                </strong>

              </div>

              <div className="nx-success-summary-row">

                <span>Status</span>

                <strong className="success">
                  <i className="bi bi-check-circle-fill"></i>
                  Paid
                </strong>

              </div>

              <div className="nx-success-summary-divider"></div>

              {/* PRIMARY BUTTON */}
              <button
                type="button"
                className="nx-success-primary-btn"
                onClick={() =>
                  navigate(`/orders/${paymentResult.orderId}`)
                }
              >
                <i className="bi bi-box-seam"></i>

                View Order Details

                <i className="bi bi-arrow-right"></i>
              </button>

              {/* SECONDARY BUTTON */}
              <button
                type="button"
                className="nx-success-secondary-btn"
                onClick={() => navigate("/orders")}
              >
                View My Orders
              </button>

              {/* SHOPPING */}
              <button
                type="button"
                className="nx-success-shopping-btn"
                onClick={() => navigate("/products")}
              >
                <i className="bi bi-arrow-left"></i>

                Continue Shopping
              </button>

              {/* SECURITY */}
              <div className="nx-success-secure">

                <i className="bi bi-shield-lock-fill"></i>

                <span>
                  Secure order confirmation
                </span>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}



  // =========================================================
  // PAYMENT PAGE
  // =========================================================

  return (
    <div className="nx-payment-page">
      <div className="container">

        {/* HEADER */}

        <div className="nx-payment-header">

          <div>
            <span>SECURE CHECKOUT</span>

            <h1>
              Complete Payment
            </h1>

            <p>
              Choose your preferred payment
              method to complete your order.
            </p>
          </div>

          <div className="nx-payment-secure">
            <i className="bi bi-shield-lock"></i>

            <div>
              <strong>
                Secure Payment
              </strong>

              <span>
                Protected checkout
              </span>
            </div>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div
            className="nx-payment-error"
            role="alert"
          >
            <i className="bi bi-exclamation-circle"></i>

            <span>{error}</span>
          </div>
        )}

        {/* MAIN GRID */}

        <div className="nx-payment-grid">

          {/* LEFT */}

          <main className="nx-payment-main">

            {/* PAYMENT METHODS */}

            <section className="nx-payment-method-card">

              <div className="nx-payment-section-header">
                <div>
                  <span>PAYMENT METHOD</span>

                  <h2>
                    Select payment option
                  </h2>
                </div>
              </div>

              <div className="nx-payment-methods">

                <button
                  type="button"
                  className={
                    paymentMethod === "upi"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                >
                  <i className="bi bi-phone"></i>

                  <span>
                    <strong>UPI</strong>
                    <small>
                      Google Pay, PhonePe, Paytm
                    </small>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "card"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                >
                  <i className="bi bi-credit-card"></i>

                  <span>
                    <strong>
                      Credit / Debit Card
                    </strong>

                    <small>
                      Visa, Mastercard, RuPay
                    </small>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod ===
                    "netbanking"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "netbanking"
                    )
                  }
                >
                  <i className="bi bi-bank"></i>

                  <span>
                    <strong>
                      Net Banking
                    </strong>

                    <small>
                      All major banks
                    </small>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

                <button
                  type="button"
                  className={
                    paymentMethod === "other"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPaymentMethod("other")
                  }
                >
                  <i className="bi bi-wallet2"></i>

                  <span>
                    <strong>
                      Other Payment
                    </strong>

                    <small>
                      Additional payment methods
                    </small>
                  </span>

                  <i className="bi bi-chevron-right"></i>
                </button>

              </div>

              {/* UPI */}

              {paymentMethod === "upi" && (
                <div className="nx-payment-form">

                  <label>
                    UPI ID
                  </label>

                  <input
                    type="text"
                    value={upiId}
                    onChange={(event) =>
                      setUpiId(
                        event.target.value
                      )
                    }
                    placeholder="example@upi"
                  />

                  <small>
                    Enter your registered UPI ID.
                  </small>

                </div>
              )}

              {/* CARD */}

              {paymentMethod === "card" && (
                <div className="nx-payment-form">

                  <label>
                    Card Number
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(event) =>
                      setCardNumber(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .replace(
                            /(.{4})/g,
                            "$1 "
                          )
                          .trim()
                      )
                    }
                    placeholder="1234 5678 9012 3456"
                  />

                  <div className="nx-payment-form-row">

                    <div>
                      <label>
                        Cardholder Name
                      </label>

                      <input
                        type="text"
                        value={cardName}
                        onChange={(event) =>
                          setCardName(
                            event.target.value
                          )
                        }
                        placeholder="Name on card"
                      />
                    </div>

                    <div>
                      <label>
                        Expiry
                      </label>

                      <input
                        type="text"
                        maxLength={5}
                        value={expiry}
                        onChange={(event) =>
                          setExpiry(
                            event.target.value
                          )
                        }
                        placeholder="MM/YY"
                      />
                    </div>

                    <div>
                      <label>
                        CVV
                      </label>

                      <input
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(event) =>
                          setCvv(
                            event.target.value.replace(
                              /\D/g,
                              ""
                            )
                          )
                        }
                        placeholder="•••"
                      />
                    </div>

                  </div>

                </div>
              )}

              {/* NET BANKING */}

              {paymentMethod ===
                "netbanking" && (
                <div className="nx-payment-form">

                  <label>
                    Select Bank
                  </label>

                  <select
                    value={bank}
                    onChange={(event) =>
                      setBank(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select your bank
                    </option>

                    <option value="SBI">
                      State Bank of India
                    </option>

                    <option value="HDFC">
                      HDFC Bank
                    </option>

                    <option value="ICICI">
                      ICICI Bank
                    </option>

                    <option value="AXIS">
                      Axis Bank
                    </option>

                    <option value="KOTAK">
                      Kotak Mahindra Bank
                    </option>
                  </select>

                </div>
              )}

              {/* OTHER */}

              {paymentMethod === "other" && (
                <div className="nx-other-payment-info">

                  <i className="bi bi-info-circle"></i>

                  <div>
                    <strong>
                      Payment method selected
                    </strong>

                    <p>
                      Continue to complete your
                      secure payment.
                    </p>
                  </div>

                </div>
              )}

            </section>

            {/* ORDER ITEMS */}

            <section className="nx-payment-items-card">

              <div className="nx-payment-section-header">

                <div>
                  <span>YOUR ORDER</span>

                  <h2>
                    Order items
                  </h2>
                </div>

                <span>
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "Item"
                    : "Items"}
                </span>

              </div>

              <div className="nx-payment-items">

                {cart.map((product) => (
                  <div
                    className="nx-payment-item"
                    key={product.id}
                  >

                    <div className="nx-payment-item-image">

                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={product.name}
                      />

                    </div>

                    <div className="nx-payment-item-info">

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        Qty: 1
                      </span>

                    </div>

                    <strong>
                      {formatPrice(
                        product.price
                      )}
                    </strong>

                  </div>
                ))}

              </div>

            </section>

          </main>

          {/* RIGHT SUMMARY */}

          <aside className="nx-payment-summary">

            <div className="nx-payment-summary-header">

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Payment summary
              </h2>

            </div>

            <div className="nx-payment-summary-row">
              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(subtotal)}
              </strong>
            </div>

            <div className="nx-payment-summary-row">
              <span>
                Shipping
              </span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : formatPrice(shipping)}
              </strong>
            </div>

            {discount > 0 && (
              <div className="nx-payment-summary-row nx-payment-discount">
                <span>
                  Discount
                </span>

                <strong>
                  -{formatPrice(discount)}
                </strong>
              </div>
            )}

            <div className="nx-payment-summary-row">
              <span>
                GST / Tax
              </span>

              <strong>
                {formatPrice(tax)}
              </strong>
            </div>

            <div className="nx-payment-summary-divider"></div>

            <div className="nx-payment-total">
              <span>
                Total Payable
              </span>

              <strong>
                {formatPrice(total)}
              </strong>
            </div>

            <button
              type="button"
              className="nx-pay-now-button"
              onClick={handlePayNow}
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="nx-payment-spinner"></span>

                  Processing Payment...
                </>
              ) : (
                <>
                  Pay{" "}
                  {formatPrice(total)}

                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>

            <div className="nx-payment-security">

              <i className="bi bi-shield-check"></i>

              <div>
                <strong>
                  Secure checkout
                </strong>

                <span>
                  Your payment details are
                  securely processed.
                </span>
              </div>

            </div>

            <button
              type="button"
              className="nx-payment-back"
              onClick={() =>
                navigate("/checkout")
              }
              disabled={processing}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Checkout
            </button>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default Payment;