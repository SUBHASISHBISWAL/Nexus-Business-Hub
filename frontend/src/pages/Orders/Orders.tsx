import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import { OrdersSkeleton } from "../../components/skeleton/OrdersSkeleton";
import { ErrorState } from "../../components/common/ErrorState";
import { useInitialLoading } from "../../context/InitialLoadingContext";
import { isAuthenticated } from "../../utils/auth";
import "./Orders.css";

type Order = {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderItems: {
    id: number;
    productId: number;
    productName: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
};

function Orders() {
  const navigate = useNavigate();
  const { markAppReady } = useInitialLoading();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();

      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
      markAppReady();
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login?returnUrl=/orders");
      return;
    }
    loadOrders();
  }, [navigate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="nx-orders-page">
      <div className="container">

        {/* HEADER */}
        <div className="nx-orders-header">
          <div>
            <span>ACCOUNT</span>

            <h1>My Orders</h1>

            <p>
              View your recent orders, payment details and
              delivery status.
            </p>
          </div>

          <button
            type="button"
            className="nx-orders-shopping"
            onClick={() => navigate("/products")}
          >
            <i className="bi bi-bag"></i>
            Continue Shopping
          </button>
        </div>

        {/* SKELETON LOADING */}
        {loading && <OrdersSkeleton count={3} />}

        {/* ERROR */}
        {!loading && error && (
          <ErrorState
            title="Unable to load content"
            message={error}
            onRetry={loadOrders}
          />
        )}

        {/* EMPTY */}
        {!loading && !error && orders.length === 0 && (
          <div className="nx-orders-list">
            <article className="nx-order-card">
              <div className="nx-order-body">
                <div className="nx-order-info">
                  <div className="nx-order-info-item">
                    <span>ORDERS</span>
                    <strong>No orders found</strong>
                  </div>
                </div>

                <div className="nx-order-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                  >
                    Browse Products
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* ORDER LIST */}
        {!loading && !error && orders.length > 0 && (
          <div className="nx-orders-list">

            {orders.map((order) => (
              <article
                className="nx-order-card"
                key={order.id}
              >

                {/* TOP */}
                <div className="nx-order-top">

                  <div className="nx-order-id">
                    <span>ORDER ID</span>

                    <strong>{order.orderNumber}</strong>
                  </div>

                  <div className="nx-order-date">
                    <span>ORDER DATE</span>

                    <strong>
                      {formatDate(order.orderDate)}
                    </strong>
                  </div>

                  <div className="nx-order-status">
                    <span
                      className={`nx-status-dot ${order.orderStatus
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    ></span>

                    <strong>{order.orderStatus}</strong>
                  </div>

                </div>

                {/* BODY */}
                <div className="nx-order-body">

                  <div className="nx-order-info">

                    <div className="nx-order-info-item">
                      <span>ITEMS</span>

                      <strong>
                        {order.orderItems.length}{" "}
                        {order.orderItems.length === 1
                          ? "Item"
                          : "Items"}
                      </strong>
                    </div>

                    <div className="nx-order-info-item">
                      <span>PAYMENT</span>

                      <strong className="nx-paid">
                        <i className="bi bi-check-circle-fill"></i>
                        {order.paymentStatus}
                      </strong>
                    </div>

                    <div className="nx-order-info-item">
                      <span>TOTAL</span>

                      <strong>
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </strong>
                    </div>

                  </div>

                  {/* ACTIONS */}
                  <div className="nx-order-actions">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/orders/${order.id}`)
                      }
                    >
                      View Details
                      <i className="bi bi-arrow-right"></i>
                    </button>

                    <button
                      type="button"
                      className="nx-track-button"
                      onClick={() =>
                        navigate(
                          `/orders/${order.id}/tracking`
                        )
                      }
                    >
                      <i className="bi bi-truck"></i>
                      Track Order
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

        {/* HELP SECTION */}
        <div className="nx-orders-help">

          <div className="nx-orders-help-icon">
            <i className="bi bi-headset"></i>
          </div>

          <div>
            <strong>Need help with an order?</strong>

            <p>
              Contact our support team for order,
              delivery or payment assistance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/support")}
          >
            Contact Support
          </button>

        </div>

      </div>
    </div>
  );
}

export default Orders;