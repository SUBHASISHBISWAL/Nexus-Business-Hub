import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import "./OrderDetails.css";

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type Address = {
  id: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

type Payment = {
  id: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  amount: number;
  paymentDate: string;
};

type Shipment = {
  id: number;
  trackingNumber: string;
  carrier: string;
  shipmentStatus: string;
  shippedDate: string | null;
  estimatedDeliveryDate: string | null;
  deliveredDate: string | null;
};

type Order = {
  id: number;
  orderNumber: string;
  orderDate: string;
  subtotal: number;
  shippingAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  address: Address | null;
  orderItems: OrderItem[];
  payment: Payment | null;
  shipment: Shipment | null;
};

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError("Invalid order ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(Number(id));

        setOrder(data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(
          "Unable to load this order. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getImagePath = (image: string) => {
    if (!image) {
      return "/src/assets/product-images/product1.jpg";
    }

    if (image.startsWith("/src/")) {
      return image;
    }

    return `/src/assets/product-images/${image}`;
  };

  const itemCount = useMemo(() => {
    if (!order) {
      return 0;
    }

    return order.orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [order]);

  if (loading) {
    return (
      <div className="nx-order-details-page">
        <div className="container">
          <div className="nx-order-loading">
            <div className="nx-loading-icon">
              <i className="bi bi-box-seam"></i>
            </div>

            <h2>Loading order details...</h2>

            <p>
              Please wait while we retrieve your order information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="nx-order-details-page">
        <div className="container">
          <div className="nx-order-error">
            <div className="nx-error-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>

            <h2>Order unavailable</h2>

            <p>
              {error || "The requested order could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-order-details-page">
      <div className="container">

        {/* BREADCRUMB */}
        <div className="nx-order-breadcrumb">
          <Link to="/orders">
            <i className="bi bi-arrow-left"></i>
            My Orders
          </Link>

          <span>/</span>

          <span>{order.orderNumber}</span>
        </div>

        {/* HEADER */}
        <div className="nx-order-details-header">
          <div>
            <span className="nx-page-label">
              ORDER DETAILS
            </span>

            <h1>{order.orderNumber}</h1>

            <p>
              Placed on {formatDateTime(order.orderDate)}
            </p>
          </div>

          <div className="nx-order-header-actions">
            <span
              className={`nx-order-status-badge ${order.orderStatus
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <span></span>
              {order.orderStatus}
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(`/orders/${order.id}/tracking`)
              }
            >
              <i className="bi bi-truck"></i>
              Track Order
            </button>
          </div>
        </div>

        {/* ORDER OVERVIEW */}
        <div className="nx-order-overview">

          <div className="nx-overview-card">
            <div className="nx-overview-icon">
              <i className="bi bi-box-seam"></i>
            </div>

            <div>
              <span>ITEMS</span>
              <strong>
                {itemCount}{" "}
                {itemCount === 1 ? "Item" : "Items"}
              </strong>
            </div>
          </div>

          <div className="nx-overview-card">
            <div className="nx-overview-icon">
              <i className="bi bi-credit-card"></i>
            </div>

            <div>
              <span>PAYMENT</span>
              <strong>{order.paymentStatus}</strong>
            </div>
          </div>

          <div className="nx-overview-card">
            <div className="nx-overview-icon">
              <i className="bi bi-currency-rupee"></i>
            </div>

            <div>
              <span>TOTAL</span>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>

          <div className="nx-overview-card">
            <div className="nx-overview-icon">
              <i className="bi bi-calendar3"></i>
            </div>

            <div>
              <span>ORDER DATE</span>
              <strong>{formatDate(order.orderDate)}</strong>
            </div>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="nx-order-details-grid">

          {/* LEFT */}
          <div className="nx-order-details-main">

            {/* PRODUCTS */}
            <section className="nx-order-section">
              <div className="nx-section-heading">
                <div>
                  <span>ORDERED PRODUCTS</span>
                  <h2>Items in this order</h2>
                </div>

                <span className="nx-section-count">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="nx-order-items">
                {order.orderItems.map((item) => (
                  <article
                    className="nx-order-item"
                    key={item.id}
                  >
                    <div className="nx-order-item-image">
                      <img
                        src={getImagePath(item.productImage)}
                        alt={item.productName}
                        onError={(event) => {
                          event.currentTarget.src =
                            "/src/assets/product-images/product1.jpg";
                        }}
                      />
                    </div>

                    <div className="nx-order-item-content">
                      <span className="nx-item-category">
                        PRODUCT #{item.productId}
                      </span>

                      <h3>{item.productName}</h3>

                      <div className="nx-item-meta">
                        <span>
                          Unit Price:{" "}
                          <strong>
                            {formatPrice(item.unitPrice)}
                          </strong>
                        </span>

                        <span>
                          Quantity:{" "}
                          <strong>{item.quantity}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="nx-order-item-total">
                      <span>TOTAL</span>

                      <strong>
                        {formatPrice(item.totalPrice)}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* DELIVERY ADDRESS */}
            {order.address && (
              <section className="nx-order-section">
                <div className="nx-section-heading">
                  <div>
                    <span>DELIVERY DETAILS</span>
                    <h2>Shipping address</h2>
                  </div>

                  <i className="bi bi-geo-alt"></i>
                </div>

                <div className="nx-address-card">
                  <div className="nx-address-top">
                    <strong>{order.address.fullName}</strong>

                    <span>
                      <i className="bi bi-telephone"></i>
                      {order.address.phone}
                    </span>
                  </div>

                  <p>{order.address.addressLine}</p>

                  <p>
                    {order.address.city},{" "}
                    {order.address.state} -{" "}
                    {order.address.pincode}
                  </p>
                </div>
              </section>
            )}

            {/* PAYMENT */}
            {order.payment && (
              <section className="nx-order-section">
                <div className="nx-section-heading">
                  <div>
                    <span>PAYMENT INFORMATION</span>
                    <h2>Payment details</h2>
                  </div>

                  <i className="bi bi-shield-check"></i>
                </div>

                <div className="nx-payment-details">

                  <div className="nx-payment-row">
                    <span>Payment Method</span>

                    <strong>
                      {order.payment.paymentMethod}
                    </strong>
                  </div>

                  <div className="nx-payment-row">
                    <span>Transaction ID</span>

                    <strong className="nx-transaction-id">
                      {order.payment.transactionId}
                    </strong>
                  </div>

                  <div className="nx-payment-row">
                    <span>Payment Date</span>

                    <strong>
                      {formatDateTime(
                        order.payment.paymentDate
                      )}
                    </strong>
                  </div>

                  <div className="nx-payment-row">
                    <span>Payment Status</span>

                    <strong className="nx-payment-success">
                      <i className="bi bi-check-circle-fill"></i>
                      {order.payment.paymentStatus}
                    </strong>
                  </div>

                </div>
              </section>
            )}

            {/* SHIPMENT */}
            {order.shipment && (
              <section className="nx-order-section">
                <div className="nx-section-heading">
                  <div>
                    <span>SHIPMENT INFORMATION</span>
                    <h2>Delivery details</h2>
                  </div>

                  <i className="bi bi-truck"></i>
                </div>

                <div className="nx-shipment-details">

                  <div className="nx-shipment-item">
                    <span>TRACKING NUMBER</span>

                    <strong>
                      {order.shipment.trackingNumber}
                    </strong>
                  </div>

                  <div className="nx-shipment-item">
                    <span>CARRIER</span>

                    <strong>
                      {order.shipment.carrier}
                    </strong>
                  </div>

                  <div className="nx-shipment-item">
                    <span>SHIPMENT STATUS</span>

                    <strong>
                      {order.shipment.shipmentStatus}
                    </strong>
                  </div>

                  <div className="nx-shipment-item">
                    <span>ESTIMATED DELIVERY</span>

                    <strong>
                      {formatDate(
                        order.shipment.estimatedDeliveryDate
                      )}
                    </strong>
                  </div>

                </div>
              </section>
            )}

          </div>

          {/* RIGHT SUMMARY */}
          <aside className="nx-order-summary">

            <div className="nx-summary-header">
              <span>ORDER SUMMARY</span>
              <h2>Payment summary</h2>
            </div>

            <div className="nx-summary-products">
              {order.orderItems.map((item) => (
                <div
                  className="nx-summary-product"
                  key={item.id}
                >
                  <div className="nx-summary-product-image">
                    <img
                      src={getImagePath(item.productImage)}
                      alt={item.productName}
                      onError={(event) => {
                        event.currentTarget.src =
                          "/src/assets/product-images/product1.jpg";
                      }}
                    />
                  </div>

                  <div className="nx-summary-product-info">
                    <strong>{item.productName}</strong>

                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    {formatPrice(item.totalPrice)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="nx-summary-divider"></div>

            <div className="nx-summary-row">
              <span>Subtotal</span>
              <strong>
                {formatPrice(order.subtotal)}
              </strong>
            </div>

            <div className="nx-summary-row">
              <span>Shipping</span>

              <strong>
                {order.shippingAmount === 0
                  ? "FREE"
                  : formatPrice(order.shippingAmount)}
              </strong>
            </div>

            {order.discountAmount > 0 && (
              <div className="nx-summary-row nx-discount-row">
                <span>Discount</span>

                <strong>
                  -{formatPrice(order.discountAmount)}
                </strong>
              </div>
            )}

            <div className="nx-summary-row">
              <span>GST / Tax</span>

              <strong>
                {formatPrice(order.taxAmount)}
              </strong>
            </div>

            <div className="nx-summary-divider"></div>

            <div className="nx-summary-total">
              <span>Total Paid</span>

              <strong>
                {formatPrice(order.totalAmount)}
              </strong>
            </div>

            <div className="nx-summary-secure">
              <i className="bi bi-shield-lock"></i>

              <div>
                <strong>Secure transaction</strong>

                <span>
                  Your payment information is protected.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="nx-summary-track"
              onClick={() =>
                navigate(`/orders/${order.id}/tracking`)
              }
            >
              <i className="bi bi-truck"></i>
              Track Shipment
              <i className="bi bi-arrow-right"></i>
            </button>

          </aside>

        </div>

        {/* BOTTOM ACTIONS */}
        <div className="nx-order-bottom-actions">
          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to My Orders
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderDetails;