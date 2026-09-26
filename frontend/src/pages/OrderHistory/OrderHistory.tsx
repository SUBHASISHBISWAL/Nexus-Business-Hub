import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";
import { getOrders } from "../../services/orderService";

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

  OrderItems: {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];

  Payment?: {
    paymentMethod: string;
    transactionId: string;
    paymentStatus: string;
    amount: number;
    paymentDate: string;
  } | null;
};

function OrderHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrders();

        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getProductImage = (image: string) => {
    if (!image) {
      return "/src/assets/product-images/product1.jpg";
    }

    if (image.startsWith("/")) {
      return image;
    }

    return `/src/assets/product-images/${image}`;
  };

  /*
   * LOADING STATE
   */
  if (loading) {
    return (
      <div className="nx-order-history-page">
        <div className="container nx-order-history-container">
          <div className="nx-order-history-loading">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">
                Loading...
              </span>
            </div>

            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ERROR STATE
   */
  if (error) {
    return (
      <div className="nx-order-history-page">
        <div className="container nx-order-history-container">
          <div className="nx-order-history-error">
            <i className="bi bi-exclamation-circle"></i>

            <h2>Unable to load orders</h2>

            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-order-history-page">
      <div className="container nx-order-history-container">

        {/* PAGE HEADER */}
        <div className="nx-order-history-heading">
          <div>
            <span className="nx-order-history-eyebrow">
              ACCOUNT
            </span>

            <h1>Order History</h1>

            <p>
              View your previous orders, payment details and
              order status.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="nx-order-history-empty">
            <i className="bi bi-bag-x"></i>

            <h2>No orders found</h2>

            <p>
              You haven't placed any orders yet.
            </p>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="nx-order-history-list">

          {orders.map((order) => {
            const firstItem = order.OrderItems?.[0];

            return (
              <article
                className="nx-order-history-card"
                key={order.id}
              >

                {/* CARD HEADER */}
                <div className="nx-order-card-header">

                  <div className="nx-order-header-item">
                    <span>ORDER ID</span>

                    <strong>
                      {order.orderNumber}
                    </strong>
                  </div>

                  <div className="nx-order-header-item">
                    <span>ORDER DATE</span>

                    <strong>
                      {new Date(
                        order.orderDate
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </strong>
                  </div>

                  <div className="nx-order-header-item">
                    <span>PAYMENT</span>

                    <strong className="nx-order-payment-status">
                      <i className="bi bi-check-circle-fill"></i>

                      {order.paymentStatus}
                    </strong>
                  </div>

                  <div className="nx-order-header-item nx-order-status">
                    <span>ORDER STATUS</span>

                    <strong>
                      <i className="bi bi-circle-fill"></i>

                      {order.orderStatus}
                    </strong>
                  </div>

                </div>

                {/* PRODUCT CONTENT */}
                <div className="nx-order-card-content">

                  <div className="nx-order-product">

                    {/* PRODUCT IMAGE */}
                    <div className="nx-order-product-image">
                      <img
                        src={getProductImage(
                          firstItem?.productImage || ""
                        )}
                        alt={
                          firstItem?.productName ||
                          "Product"
                        }
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="nx-order-product-details">

                      <span className="nx-order-product-label">
                        PRODUCT
                      </span>

                      <h2>
                        {firstItem?.productName ||
                          "Product"}
                      </h2>

                      <p>
                        Product ID:{" "}
                        {firstItem?.productId || "-"}
                      </p>

                      <div className="nx-order-product-meta">

                        <span>
                          <i className="bi bi-box"></i>

                          Quantity:{" "}
                          {firstItem?.quantity || 1}
                        </span>

                        <span>
                          <i className="bi bi-shield-check"></i>

                          Verified Order
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* ORDER AMOUNT */}
                  <div className="nx-order-amount">

                    <span>ORDER TOTAL</span>

                    <strong>
                      {formatPrice(order.totalAmount)}
                    </strong>

                    <small>
                      Inclusive of applicable taxes
                    </small>

                  </div>

                </div>

                {/* CARD FOOTER */}
                <div className="nx-order-card-footer">

                  {/* PAYMENT METHOD */}
                  <div className="nx-order-footer-item">

                    <i className="bi bi-credit-card"></i>

                    <div>
                      <span>Payment Method</span>

                      <strong>
                        {order.Payment?.paymentMethod ||
                          "Pending"}
                      </strong>
                    </div>

                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="nx-order-footer-item">

                    <i className="bi bi-check2-circle"></i>

                    <div>
                      <span>Payment Status</span>

                      <strong className="success">
                        {order.Payment?.paymentStatus ||
                          order.paymentStatus}
                      </strong>
                    </div>

                  </div>

                  {/* ORDER STATUS */}
                  <div className="nx-order-footer-item">

                    <i className="bi bi-box-seam"></i>

                    <div>
                      <span>Order Status</span>

                      <strong>
                        {order.orderStatus}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* VIEW ORDER DETAILS */}
                <div className="nx-order-card-action">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/orders/${order.id}`)
                    }
                  >
                    View Order Details

                    <i className="bi bi-arrow-right"></i>
                  </button>

                </div>

              </article>
            );
          })}

        </div>

      </div>
    </div>
  );
}

export default OrderHistory;