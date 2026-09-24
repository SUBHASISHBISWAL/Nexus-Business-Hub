import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import "./OrderTracking.css";

type Address = {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type Payment = {
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  amount: number;
  paymentDate: string;
};

type Shipment = {
  trackingNumber: string;
  carrier: string;
  shipmentStatus: string;
  shippedDate?: string | null;
  estimatedDeliveryDate?: string | null;
  deliveredDate?: string | null;
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
  address?: Address | null;
  orderItems: OrderItem[];
  payment?: Payment | null;
  shipment?: Shipment | null;
};

function OrderTracking() {
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

        const data = await getOrderById(Number(id));

        setOrder(data);
      } catch (err) {
        console.error("Failed to load order tracking:", err);
        setError("Unable to load tracking information.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date?: string | null) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImage = (image: string) => {
    if (!image) {
      return "/src/assets/product-images/product1.jpg";
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `/src/assets/product-images/${image}`;
  };

  if (loading) {
    return (
      <div className="nx-order-tracking-page">
        <div className="container nx-order-tracking-container">
          <div className="nx-tracking-state">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p>Loading tracking information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="nx-order-tracking-page">
        <div className="container nx-order-tracking-container">
          <div className="nx-tracking-error">
            <i className="bi bi-exclamation-circle"></i>

            <h2>Unable to load order</h2>

            <p>{error || "Order not found."}</p>

            <button type="button" onClick={() => navigate("/order-history")}>
              Back to Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shipment = order.shipment;
  const address = order.address;
  const payment = order.payment;

  const isShipped =
    Boolean(shipment?.shippedDate) ||
    shipment?.shipmentStatus?.toLowerCase() === "shipped";

  const isDelivered =
    Boolean(shipment?.deliveredDate) ||
    shipment?.shipmentStatus?.toLowerCase() === "delivered";

  return (
    <div className="nx-order-tracking-page">
      <div className="container nx-order-tracking-container">
        {/* PAGE HEADER */}
        <div className="nx-tracking-header">
          <div>
            <span className="nx-tracking-eyebrow">ORDER TRACKING</span>

            <h1>Track Your Order</h1>

            <p>Order #{order.orderNumber}</p>
          </div>

          <div className="nx-tracking-order-meta">
            <span>ORDER DATE</span>
            <strong>{formatDate(order.orderDate)}</strong>
          </div>
        </div>

        {/* ORDER STATUS BANNER */}
        <div className="nx-tracking-status-banner">
          <div className="nx-tracking-status-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div>
            <span>CURRENT ORDER STATUS</span>

            <strong>{order.orderStatus}</strong>

            <p>Your order is being processed by Nexus Logistics.</p>
          </div>

          <div className="nx-tracking-payment-badge">
            <i className="bi bi-check-circle-fill"></i>
            {order.paymentStatus}
          </div>
        </div>

        {/* SHIPMENT SUMMARY */}
        {shipment && (
          <div className="nx-tracking-summary">
            <div className="nx-tracking-summary-item">
              <span>TRACKING NUMBER</span>

              <strong>{shipment.trackingNumber}</strong>
            </div>

            <div className="nx-tracking-summary-item">
              <span>CARRIER</span>

              <strong>{shipment.carrier}</strong>
            </div>

            <div className="nx-tracking-summary-item">
              <span>SHIPMENT STATUS</span>

              <strong>{shipment.shipmentStatus}</strong>
            </div>

            <div className="nx-tracking-summary-item">
              <span>ESTIMATED DELIVERY</span>

              <strong>{formatDate(shipment.estimatedDeliveryDate)}</strong>
            </div>
          </div>
        )}

        {/* SHIPMENT PROGRESS */}
        {shipment && (
          <section className="nx-tracking-card">
            <div className="nx-tracking-card-heading">
              <div>
                <span>SHIPMENT</span>
                <h2>Shipment Progress</h2>
              </div>

              <span className="nx-live-status">
                <i></i>
                LIVE STATUS
              </span>
            </div>

            <div className="nx-vertical-tracking">
              {/* ORDER PLACED */}
              <div className="nx-vertical-step completed">
                <div className="nx-vertical-line-area">
                  <div className="nx-vertical-dot">
                    <i className="bi bi-check-lg"></i>
                  </div>
                </div>

                <div className="nx-vertical-content">
                  <strong>Order Placed</strong>

                  <small>{formatDate(order.orderDate)}</small>

                  <p>Your order has been successfully placed.</p>
                </div>
              </div>

              {/* PROCESSING */}
              <div
                className={`nx-vertical-step ${
                  isShipped || isDelivered ? "completed" : "active"
                }`}
              >
                <div className="nx-vertical-line-area">
                  <div className="nx-vertical-dot">
                    {isShipped || isDelivered ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-box-seam"></i>
                    )}
                  </div>
                </div>

                <div className="nx-vertical-content">
                  <strong>Processing</strong>

                  <small>
                    {isShipped || isDelivered ? "Completed" : "In progress"}
                  </small>

                  <p>Your order is being prepared for shipment.</p>
                </div>
              </div>

              {/* SHIPPED */}
              <div
                className={`nx-vertical-step ${
                  isShipped || isDelivered ? "completed" : ""
                }`}
              >
                <div className="nx-vertical-line-area">
                  <div className="nx-vertical-dot">
                    {isShipped || isDelivered ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-truck"></i>
                    )}
                  </div>
                </div>

                <div className="nx-vertical-content">
                  <strong>Shipped</strong>

                  <small>
                    {shipment.shippedDate
                      ? formatDate(shipment.shippedDate)
                      : "Pending"}
                  </small>

                  <p>
                    {isShipped
                      ? "Your order has been handed over to the carrier."
                      : "Waiting for shipment dispatch."}
                  </p>
                </div>
              </div>

              {/* OUT FOR DELIVERY */}
              <div
                className={`nx-vertical-step ${isDelivered ? "completed" : ""}`}
              >
                <div className="nx-vertical-line-area">
                  <div className="nx-vertical-dot">
                    {isDelivered ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-bicycle"></i>
                    )}
                  </div>
                </div>

                <div className="nx-vertical-content">
                  <strong>Out for Delivery</strong>

                  <small>{isDelivered ? "Completed" : "Pending"}</small>

                  <p>
                    {isDelivered
                      ? "Your shipment was out for delivery."
                      : "This step will update after dispatch."}
                  </p>
                </div>
              </div>

              {/* DELIVERED */}
              <div
                className={`nx-vertical-step last-step ${
                  isDelivered ? "completed" : ""
                }`}
              >
                <div className="nx-vertical-line-area">
                  <div className="nx-vertical-dot">
                    {isDelivered ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className="bi bi-house-check"></i>
                    )}
                  </div>
                </div>

                <div className="nx-vertical-content">
                  <strong>Delivered</strong>

                  <small>
                    {shipment.deliveredDate
                      ? formatDate(shipment.deliveredDate)
                      : `Expected by ${formatDate(
                          shipment.estimatedDeliveryDate,
                        )}`}
                  </small>

                  <p>
                    {isDelivered
                      ? "Your order has been delivered successfully."
                      : "Delivery is pending."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LOWER INFORMATION */}
        <div className="nx-tracking-lower-grid">
          {/* DELIVERY ADDRESS */}
          {address && (
            <section className="nx-tracking-info-card">
              <div className="nx-info-card-heading">
                <div className="nx-info-card-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <span>DELIVERY</span>
                  <h2>Delivery Address</h2>
                </div>
              </div>

              <div className="nx-address-content">
                <strong>{address.fullName}</strong>

                <p>{address.addressLine}</p>

                <p>
                  {address.city}, {address.state}
                </p>

                <p>PIN: {address.pincode}</p>

                <div className="nx-address-phone">
                  <i className="bi bi-telephone"></i>
                  {address.phone}
                </div>
              </div>
            </section>
          )}

          {/* PAYMENT */}
          {payment && (
            <section className="nx-tracking-info-card">
              <div className="nx-info-card-heading">
                <div className="nx-info-card-icon">
                  <i className="bi bi-credit-card"></i>
                </div>

                <div>
                  <span>PAYMENT</span>
                  <h2>Payment Details</h2>
                </div>
              </div>

              <div className="nx-payment-details">
                <div>
                  <span>Payment Method</span>
                  <strong>{payment.paymentMethod}</strong>
                </div>

                <div>
                  <span>Payment Status</span>

                  <strong className="nx-paid-text">
                    <i className="bi bi-check-circle-fill"></i>
                    {payment.paymentStatus}
                  </strong>
                </div>

                <div>
                  <span>Transaction ID</span>

                  <strong>{payment.transactionId || "N/A"}</strong>
                </div>

                <div>
                  <span>Amount Paid</span>

                  <strong>{formatPrice(payment.amount)}</strong>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ORDER ITEMS */}
        <section className="nx-tracking-card nx-order-items-card">
          <div className="nx-tracking-card-heading">
            <div>
              <span>ORDER CONTENT</span>
              <h2>Order Items</h2>
            </div>

            <span className="nx-items-count">
              {order.orderItems.length}{" "}
              {order.orderItems.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <div className="nx-order-items-list">
            {order.orderItems.map((item) => (
              <div className="nx-order-item" key={item.id}>
                <div className="nx-order-item-image">
                  <img
                    src={getImage(item.productImage)}
                    alt={item.productName}
                  />
                </div>

                <div className="nx-order-item-details">
                  <strong>{item.productName}</strong>

                  <span>Product ID: {item.productId}</span>

                  <small>Quantity: {item.quantity}</small>
                </div>

                <div className="nx-order-item-price">
                  <span>
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </span>

                  <strong>{formatPrice(item.totalPrice)}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER TOTALS */}
          <div className="nx-order-totals">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(order.subtotal)}</strong>
            </div>

            <div>
              <span>Shipping</span>
              <strong>
                {order.shippingAmount === 0
                  ? "FREE"
                  : formatPrice(order.shippingAmount)}
              </strong>
            </div>

            <div>
              <span>Discount</span>
              <strong className="nx-discount-text">
                -{formatPrice(order.discountAmount)}
              </strong>
            </div>

            <div>
              <span>Tax</span>
              <strong>{formatPrice(order.taxAmount)}</strong>
            </div>

            <div className="nx-total-row">
              <span>Total Amount</span>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="nx-tracking-actions">
          <button
            type="button"
            className="nx-tracking-secondary-btn"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Order Details
          </button>

          <button
            type="button"
            className="nx-tracking-primary-btn"
            onClick={() => navigate("/order-history")}
          >
            View Order History
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
