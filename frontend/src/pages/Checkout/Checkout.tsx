import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import "./Checkout.css";

type Address = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

function Checkout() {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  const cart = cartContext?.cart ?? [];

  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [billingAddress, setBillingAddress] =
    useState<Address>({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [sameBillingAddress, setSameBillingAddress] =
    useState(true);

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof Address, string>>
  >({});

  const [billingErrors, setBillingErrors] = useState<
    Partial<Record<keyof Address, string>>
  >({});

  /* =========================
     ORDER CALCULATIONS
  ========================= */

  const subtotal = useMemo(() => {
    return cart.reduce((total: number, item: any) => {
      const quantity = Number(item.quantity ?? 1);
      const price = Number(item.price ?? 0);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  const shipping =
    subtotal >= 5000 || subtotal === 0
      ? 0
      : 250;

  const discount =
    couponApplied &&
    coupon.trim().toUpperCase() === "NEXUS500"
      ? 500
      : 0;

  const taxableAmount = Math.max(
    subtotal + shipping - discount,
    0
  );

  const tax = taxableAmount * 0.18;

  const total = taxableAmount + tax;

  /* =========================
     DELIVERY ADDRESS
  ========================= */

  const updateAddress = (
    field: keyof Address,
    value: string
  ) => {
    setAddress((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validateDeliveryAddress = () => {
    const newErrors: Partial<
      Record<keyof Address, string>
    > = {};

    if (!address.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!address.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9]{10}$/.test(
        address.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!address.addressLine.trim()) {
      newErrors.addressLine =
        "Address is required.";
    }

    if (!address.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!address.state.trim()) {
      newErrors.state =
        "State is required.";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^[0-9]{6}$/.test(
        address.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     BILLING ADDRESS
  ========================= */

  const updateBillingAddress = (
    field: keyof Address,
    value: string
  ) => {
    setBillingAddress((previous) => ({
      ...previous,
      [field]: value,
    }));

    setBillingErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validateBillingAddress = () => {
    const newErrors: Partial<
      Record<keyof Address, string>
    > = {};

    if (!billingAddress.fullName.trim()) {
      newErrors.fullName =
        "Full name is required.";
    }

    if (!billingAddress.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9]{10}$/.test(
        billingAddress.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!billingAddress.addressLine.trim()) {
      newErrors.addressLine =
        "Address is required.";
    }

    if (!billingAddress.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!billingAddress.state.trim()) {
      newErrors.state =
        "State is required.";
    }

    if (!billingAddress.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^[0-9]{6}$/.test(
        billingAddress.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setBillingErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     COUPON
  ========================= */

  const handleApplyCoupon = () => {
    const normalizedCoupon =
      coupon.trim().toUpperCase();

    if (!normalizedCoupon) {
      setCouponMessage(
        "Please enter a coupon code."
      );
      setCouponApplied(false);
      return;
    }

    if (normalizedCoupon === "NEXUS500") {
      setCoupon(normalizedCoupon);
      setCouponApplied(true);

      setCouponMessage(
        "Coupon applied successfully. ₹500 discount added."
      );

      return;
    }

    setCouponApplied(false);
    setCouponMessage(
      "Invalid coupon code."
    );
  };

  /* =========================
     CONTINUE TO PAYMENT
  ========================= */

  const handleContinueToPayment = () => {
    const deliveryValid =
      validateDeliveryAddress();

    if (!deliveryValid) {
      return;
    }

    if (!sameBillingAddress) {
      const billingValid =
        validateBillingAddress();

      if (!billingValid) {
        return;
      }
    }

    /*
     * Save checkout information.
     * Payment.tsx will read this from sessionStorage.
     */

    const checkoutData = {
      address: {
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        addressLine:
          address.addressLine.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },

      billingAddress: sameBillingAddress
        ? {
            fullName:
              address.fullName.trim(),
            phone: address.phone.trim(),
            addressLine:
              address.addressLine.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            pincode:
              address.pincode.trim(),
          }
        : {
            fullName:
              billingAddress.fullName.trim(),
            phone:
              billingAddress.phone.trim(),
            addressLine:
              billingAddress.addressLine.trim(),
            city:
              billingAddress.city.trim(),
            state:
              billingAddress.state.trim(),
            pincode:
              billingAddress.pincode.trim(),
          },

      sameBillingAddress,

      coupon: couponApplied
        ? coupon.trim().toUpperCase()
        : "",

      couponApplied,

      subtotal,
      shipping,
      discount,
      tax,
      total,
    };

    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify(checkoutData)
    );

    navigate("/payment");
  };

  /* =========================
     EMPTY CART
  ========================= */

  if (!cart.length) {
    return (
      <div className="nx-checkout-page">
        <section className="container nx-checkout-empty">
          <div className="nx-checkout-empty-icon">
            <i className="bi bi-cart-x"></i>
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Add some products to your cart
            before continuing to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="nx-checkout-page">
      <section className="container nx-checkout-shell">

        {/* PAGE HEADER */}

        <div className="nx-checkout-header">
          <div>
            <span className="nx-checkout-eyebrow">
              NEXUS COMMERCE
            </span>

            <h1>Checkout</h1>

            <p>
              Review your details and continue
              to secure payment.
            </p>
          </div>

          <div className="nx-checkout-step">
            <span>STEP</span>
            <strong>2 / 3</strong>
          </div>
        </div>

        {/* CHECKOUT CONTENT */}

        <div className="nx-checkout-grid">

          {/* LEFT SIDE */}

          <div className="nx-checkout-main">

            {/* CONTACT DETAILS */}

            <section className="nx-checkout-card">
              <div className="nx-checkout-card-header">

                <div className="nx-section-number">
                  01
                </div>

                <div>
                  <h2>
                    Contact Details
                  </h2>

                  <p>
                    Enter the contact information
                    for this order.
                  </p>
                </div>

              </div>

              <div className="nx-form-grid">

                <div className="nx-form-group nx-full">

                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={address.fullName}
                    onChange={(event) =>
                      updateAddress(
                        "fullName",
                        event.target.value
                      )
                    }
                    placeholder="Enter your full name"
                  />

                  {errors.fullName && (
                    <small className="nx-field-error">
                      {errors.fullName}
                    </small>
                  )}

                </div>

                <div className="nx-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={address.phone}
                    onChange={(event) =>
                      updateAddress(
                        "phone",
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10)
                      )
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />

                  {errors.phone && (
                    <small className="nx-field-error">
                      {errors.phone}
                    </small>
                  )}

                </div>

              </div>
            </section>

            {/* DELIVERY ADDRESS */}

            <section className="nx-checkout-card">

              <div className="nx-checkout-card-header">

                <div className="nx-section-number">
                  02
                </div>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver
                    your order?
                  </p>
                </div>

              </div>

              <div className="nx-form-grid">

                <div className="nx-form-group nx-full">

                  <label htmlFor="addressLine">
                    Address
                  </label>

                  <textarea
                    id="addressLine"
                    value={address.addressLine}
                    onChange={(event) =>
                      updateAddress(
                        "addressLine",
                        event.target.value
                      )
                    }
                    placeholder="House / flat / street / area"
                    rows={3}
                  />

                  {errors.addressLine && (
                    <small className="nx-field-error">
                      {errors.addressLine}
                    </small>
                  )}

                </div>

                <div className="nx-form-group">

                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    value={address.city}
                    onChange={(event) =>
                      updateAddress(
                        "city",
                        event.target.value
                      )
                    }
                    placeholder="City"
                  />

                  {errors.city && (
                    <small className="nx-field-error">
                      {errors.city}
                    </small>
                  )}

                </div>

                <div className="nx-form-group">

                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    value={address.state}
                    onChange={(event) =>
                      updateAddress(
                        "state",
                        event.target.value
                      )
                    }
                    placeholder="State"
                  />

                  {errors.state && (
                    <small className="nx-field-error">
                      {errors.state}
                    </small>
                  )}

                </div>

                <div className="nx-form-group">

                  <label htmlFor="pincode">
                    Pincode
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    value={address.pincode}
                    onChange={(event) =>
                      updateAddress(
                        "pincode",
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />

                  {errors.pincode && (
                    <small className="nx-field-error">
                      {errors.pincode}
                    </small>
                  )}

                </div>

              </div>
            </section>

            {/* BILLING ADDRESS */}

            <section className="nx-checkout-card">

              <div className="nx-checkout-card-header">

                <div className="nx-section-number">
                  03
                </div>

                <div>
                  <h2>
                    Billing Address
                  </h2>

                  <p>
                    Use the delivery address
                    or provide another billing
                    address.
                  </p>
                </div>

              </div>

              <label className="nx-checkout-checkbox">

                <input
                  type="checkbox"
                  checked={sameBillingAddress}
                  onChange={(event) => {

                    const checked =
                      event.target.checked;

                    setSameBillingAddress(
                      checked
                    );

                    if (checked) {
                      setBillingErrors({});
                    }

                  }}
                />

                <span>
                  Billing address is the same
                  as delivery address
                </span>

              </label>

              {!sameBillingAddress && (
                <div className="nx-form-grid nx-billing-form">

                  {/* BILLING NAME */}

                  <div className="nx-form-group nx-full">

                    <label htmlFor="billingFullName">
                      Full Name
                    </label>

                    <input
                      id="billingFullName"
                      type="text"
                      value={
                        billingAddress.fullName
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "fullName",
                          event.target.value
                        )
                      }
                      placeholder="Billing full name"
                    />

                    {billingErrors.fullName && (
                      <small className="nx-field-error">
                        {
                          billingErrors.fullName
                        }
                      </small>
                    )}

                  </div>

                  {/* BILLING PHONE */}

                  <div className="nx-form-group">

                    <label htmlFor="billingPhone">
                      Phone Number
                    </label>

                    <input
                      id="billingPhone"
                      type="tel"
                      value={
                        billingAddress.phone
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "phone",
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 10)
                        )
                      }
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />

                    {billingErrors.phone && (
                      <small className="nx-field-error">
                        {billingErrors.phone}
                      </small>
                    )}

                  </div>

                  {/* BILLING ADDRESS */}

                  <div className="nx-form-group nx-full">

                    <label htmlFor="billingAddress">
                      Address
                    </label>

                    <textarea
                      id="billingAddress"
                      value={
                        billingAddress.addressLine
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "addressLine",
                          event.target.value
                        )
                      }
                      placeholder="Billing address"
                      rows={3}
                    />

                    {billingErrors.addressLine && (
                      <small className="nx-field-error">
                        {
                          billingErrors.addressLine
                        }
                      </small>
                    )}

                  </div>

                  {/* BILLING CITY */}

                  <div className="nx-form-group">

                    <label htmlFor="billingCity">
                      City
                    </label>

                    <input
                      id="billingCity"
                      type="text"
                      value={
                        billingAddress.city
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "city",
                          event.target.value
                        )
                      }
                      placeholder="City"
                    />

                    {billingErrors.city && (
                      <small className="nx-field-error">
                        {billingErrors.city}
                      </small>
                    )}

                  </div>

                  {/* BILLING STATE */}

                  <div className="nx-form-group">

                    <label htmlFor="billingState">
                      State
                    </label>

                    <input
                      id="billingState"
                      type="text"
                      value={
                        billingAddress.state
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "state",
                          event.target.value
                        )
                      }
                      placeholder="State"
                    />

                    {billingErrors.state && (
                      <small className="nx-field-error">
                        {billingErrors.state}
                      </small>
                    )}

                  </div>

                  {/* BILLING PINCODE */}

                  <div className="nx-form-group">

                    <label htmlFor="billingPincode">
                      Pincode
                    </label>

                    <input
                      id="billingPincode"
                      type="text"
                      value={
                        billingAddress.pincode
                      }
                      onChange={(event) =>
                        updateBillingAddress(
                          "pincode",
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 6)
                        )
                      }
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />

                    {billingErrors.pincode && (
                      <small className="nx-field-error">
                        {
                          billingErrors.pincode
                        }
                      </small>
                    )}

                  </div>

                </div>
              )}
            </section>

            {/* COUPON */}

            <section className="nx-checkout-card">

              <div className="nx-checkout-card-header">

                <div className="nx-section-number">
                  04
                </div>

                <div>
                  <h2>
                    Coupon
                  </h2>

                  <p>
                    Apply an available discount
                    code.
                  </p>
                </div>

              </div>

              <div className="nx-coupon-row">

                <input
                  type="text"
                  value={coupon}
                  onChange={(event) => {
                    setCoupon(
                      event.target.value
                    );
                    setCouponApplied(false);
                    setCouponMessage("");
                  }}
                  placeholder="Enter coupon code"
                />

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>

              </div>

              {couponMessage && (
                <div
                  className={`nx-coupon-message ${
                    couponApplied
                      ? "success"
                      : "error"
                  }`}
                >
                  <i
                    className={`bi ${
                      couponApplied
                        ? "bi-check-circle"
                        : "bi-info-circle"
                    }`}
                  ></i>

                  {couponMessage}
                </div>
              )}

              {!couponApplied && (
                <div className="nx-coupon-hint">
                  Try{" "}
                  <strong>NEXUS500</strong>{" "}
                  for ₹500 off.
                </div>
              )}

            </section>

          </div>

          {/* RIGHT ORDER SUMMARY */}

          <aside className="nx-checkout-summary">

            <div className="nx-summary-card">

              <div className="nx-summary-header">

                <div>
                  <span>
                    ORDER SUMMARY
                  </span>

                  <h2>
                    Your Order
                  </h2>
                </div>

                <span className="nx-item-count">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              {/* ITEMS */}

              <div className="nx-summary-items">

                {cart.map(
                  (
                    item: any,
                    index: number
                  ) => {

                    const quantity =
                      Number(
                        item.quantity ?? 1
                      );

                    const imageSrc =
                      item.image?.startsWith(
                        "/src/"
                      )
                        ? item.image
                        : `/src/assets/product-images/${item.image}`;

                    return (
                      <div
                        className="nx-summary-item"
                        key={
                          item.id ??
                          `${item.name}-${index}`
                        }
                      >

                        <div className="nx-summary-image">

                          <img
                            src={imageSrc}
                            alt={item.name}
                            onError={(event) => {
                              event.currentTarget.src =
                                "/src/assets/product-images/product1.jpg";
                            }}
                          />

                        </div>

                        <div className="nx-summary-item-info">

                          <h3>
                            {item.name}
                          </h3>

                          <span>
                            Qty: {quantity}
                          </span>

                        </div>

                        <strong>
                          ₹
                          {(
                            Number(
                              item.price
                            ) * quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

              {/* PRICE BREAKDOWN */}

              <div className="nx-summary-breakdown">

                <div className="nx-summary-row">

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>

                </div>

                <div className="nx-summary-row">

                  <span>
                    Shipping
                  </span>

                  <strong>
                    {shipping === 0
                      ? "FREE"
                      : `₹${shipping.toLocaleString(
                          "en-IN"
                        )}`}
                  </strong>

                </div>

                {discount > 0 && (
                  <div className="nx-summary-row nx-discount-row">

                    <span>
                      Discount
                    </span>

                    <strong>
                      -₹
                      {discount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                )}

                <div className="nx-summary-row">

                  <span>
                    GST / Tax (18%)
                  </span>

                  <strong>
                    ₹
                    {tax.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>

                </div>

              </div>

              {/* TOTAL */}

              <div className="nx-summary-total">

                <span>
                  Total Payable
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN",
                    {
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              {/* CONTINUE TO PAYMENT */}

              <button
                type="button"
                className="nx-continue-payment"
                onClick={
                  handleContinueToPayment
                }
              >
                Continue to Payment

                <i className="bi bi-arrow-right"></i>
              </button>

              <div className="nx-secure-checkout">

                <i className="bi bi-shield-check"></i>

                <span>
                  Secure checkout · Your
                  information is protected
                </span>

              </div>

            </div>

            {/* DELIVERY NOTE */}

            <div className="nx-delivery-note">

              <i className="bi bi-truck"></i>

              <div>

                <strong>
                  Fast Delivery
                </strong>

                <span>
                  Free shipping on orders
                  above ₹5,000.
                </span>

              </div>

            </div>

          </aside>

        </div>
      </section>
    </div>
  );
}

export default Checkout;