import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

type OrderItem = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
};

type OrderData = {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  payment: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
};

const sampleOrders: Record<string, OrderData> = {
  "ORD-10284": {
    id: "ORD-10284",
    date: "18 Sep 2026, 10:42 AM",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },
    shippingAddress: {
      name: "Rahul Sharma",
      line1: "Flat 402, Green Valley Apartments",
      line2: "Sector 18",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      country: "India",
    },
    items: [
      {
        id: 1,
        name: "Smart IoT Gateway Pro",
        sku: "NX-IOT-001",
        quantity: 1,
        price: 24999,
        image: "/product1.jpg",
      },
      {
        id: 2,
        name: "Rugged M12 Sensor Cable",
        sku: "NX-CBL-004",
        quantity: 2,
        price: 2150,
        image: "/product4.jpg",
      },
    ],
    payment: "Paid",
    paymentMethod: "Credit Card",
    status: "Processing",
    subtotal: 29299,
    shipping: 500,
    tax: 5274,
  },

  "ORD-10283": {
    id: "ORD-10283",
    date: "18 Sep 2026, 09:18 AM",
    customer: {
      name: "Priya Das",
      email: "priya@example.com",
      phone: "+91 91234 56789",
    },
    shippingAddress: {
      name: "Priya Das",
      line1: "12 Lake View Road",
      line2: "Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      country: "India",
    },
    items: [
      {
        id: 1,
        name: "EdgeCompute R500",
        sku: "NX-EDGE-002",
        quantity: 1,
        price: 78500,
        image: "/product2.jpg",
      },
    ],
    payment: "Paid",
    paymentMethod: "UPI",
    status: "Shipped",
    subtotal: 78500,
    shipping: 0,
    tax: 14130,
  },
};

const defaultOrder: OrderData = {
  id: "ORD-10284",
  date: "18 Sep 2026, 10:42 AM",
  customer: {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
  },
  shippingAddress: {
    name: "Rahul Sharma",
    line1: "Flat 402, Green Valley Apartments",
    line2: "Sector 18",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    country: "India",
  },
  items: [
    {
      id: 1,
      name: "Smart IoT Gateway Pro",
      sku: "NX-IOT-001",
      quantity: 1,
      price: 24999,
      image: "/product1.jpg",
    },
  ],
  payment: "Paid",
  paymentMethod: "Credit Card",
  status: "Processing",
  subtotal: 24999,
  shipping: 500,
  tax: 4500,
};

const statusOptions = [
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const order = useMemo(() => {
    if (id && sampleOrders[id]) {
      return sampleOrders[id];
    }

    return defaultOrder;
  }, [id]);

  const [status, setStatus] = useState(order.status);
  const [savedStatus, setSavedStatus] = useState(order.status);
  const [notice, setNotice] = useState("");

  const total = order.subtotal + order.shipping + order.tax;

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const handleStatusUpdate = () => {
    setSavedStatus(status);
    setNotice("Order status updated successfully.");

    window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const timeline = [
    {
      title: "Order Placed",
      date: order.date,
      completed: true,
    },
    {
      title: "Order Processing",
      date:
        savedStatus === "Processing" ||
        savedStatus === "Shipped" ||
        savedStatus === "Delivered"
          ? "18 Sep 2026, 11:20 AM"
          : "",
      completed:
        savedStatus === "Processing" ||
        savedStatus === "Shipped" ||
        savedStatus === "Delivered",
    },
    {
      title: "Shipped",
      date:
        savedStatus === "Shipped" || savedStatus === "Delivered"
          ? "19 Sep 2026, 09:10 AM"
          : "",
      completed:
        savedStatus === "Shipped" || savedStatus === "Delivered",
    },
    {
      title: "Delivered",
      date: savedStatus === "Delivered" ? "21 Sep 2026, 04:30 PM" : "",
      completed: savedStatus === "Delivered",
    },
  ];

  return (
    <div className="nx-order-details-page">
      {/* HEADER */}
      <div className="nx-order-details-header">
        <div className="nx-order-details-heading">
          <button
            type="button"
            className="nx-order-back"
            onClick={() => navigate("/admin/orders")}
          >
            ← Back to Orders
          </button>

          <div>
            <div className="nx-order-title-row">
              <h1>{order.id}</h1>

              <span
                className={`nx-order-detail-status ${savedStatus
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {savedStatus}
              </span>
            </div>

            <p>Order placed on {order.date}</p>
          </div>
        </div>

        <button
          type="button"
          className="nx-order-print"
          onClick={() => window.print()}
        >
          Print Order
        </button>
      </div>

      {/* SUCCESS NOTICE */}
      {notice && (
        <div className="nx-order-notice">
          <span>✓</span>
          {notice}
        </div>
      )}

      <div className="nx-order-details-grid">
        {/* LEFT CONTENT */}
        <div className="nx-order-main-column">
          {/* CUSTOMER + SHIPPING */}
          <div className="nx-order-info-grid">
            <section className="nx-order-panel">
              <div className="nx-order-panel-header">
                <h2>Customer Details</h2>
              </div>

              <div className="nx-order-customer-info">
                <div className="nx-order-avatar">
                  {order.customer.name.charAt(0)}
                </div>

                <div>
                  <strong>{order.customer.name}</strong>
                  <span>{order.customer.email}</span>
                  <span>{order.customer.phone}</span>
                </div>
              </div>
            </section>

            <section className="nx-order-panel">
              <div className="nx-order-panel-header">
                <h2>Shipping Address</h2>
              </div>

              <div className="nx-order-address">
                <strong>{order.shippingAddress.name}</strong>

                <span>{order.shippingAddress.line1}</span>
                <span>{order.shippingAddress.line2}</span>

                <span>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                </span>

                <span>
                  {order.shippingAddress.pincode},{" "}
                  {order.shippingAddress.country}
                </span>
              </div>
            </section>
          </div>

          {/* ITEMS */}
          <section className="nx-order-panel nx-order-items-panel">
            <div className="nx-order-panel-header">
              <div>
                <h2>Order Items</h2>
                <p>{order.items.length} product(s) in this order</p>
              </div>
            </div>

            <div className="nx-order-items-table-wrapper">
              <table className="nx-order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="nx-order-product">
                          <div className="nx-order-product-image">
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          </div>

                          <div>
                            <strong>{item.name}</strong>
                            <span>Industrial Product</span>
                          </div>
                        </div>
                      </td>

                      <td className="nx-order-sku">{item.sku}</td>

                      <td>{item.quantity}</td>

                      <td>{formatCurrency(item.price)}</td>

                      <td className="nx-order-item-total">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ORDER TIMELINE */}
          <section className="nx-order-panel">
            <div className="nx-order-panel-header">
              <div>
                <h2>Order Timeline</h2>
                <p>Track the current progress of this order.</p>
              </div>
            </div>

            <div className="nx-order-timeline">
              {timeline.map((item, index) => (
                <div
                  className={`nx-timeline-item ${
                    item.completed ? "completed" : ""
                  }`}
                  key={item.title}
                >
                  <div className="nx-timeline-marker">
                    {item.completed ? "✓" : ""}
                  </div>

                  <div className="nx-timeline-content">
                    <strong>{item.title}</strong>

                    {item.date && <span>{item.date}</span>}

                    {!item.date && (
                      <span className="nx-timeline-pending">
                        Pending
                      </span>
                    )}
                  </div>

                  {index < timeline.length - 1 && (
                    <div
                      className={`nx-timeline-line ${
                        timeline[index + 1].completed
                          ? "completed"
                          : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="nx-order-side-column">
          {/* STATUS */}
          <section className="nx-order-panel">
            <div className="nx-order-panel-header">
              <h2>Order Status</h2>
            </div>

            <div className="nx-order-status-control">
              <label htmlFor="order-status">
                Current Status
              </label>

              <select
                id="order-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={status === savedStatus}
              >
                Update Status
              </button>
            </div>
          </section>

          {/* PAYMENT */}
          <section className="nx-order-panel">
            <div className="nx-order-panel-header">
              <h2>Payment</h2>
            </div>

            <div className="nx-payment-detail">
              <div>
                <span>Payment Status</span>

                <strong className="nx-paid-badge">
                  {order.payment}
                </strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{order.paymentMethod}</strong>
              </div>
            </div>
          </section>

          {/* ORDER SUMMARY */}
          <section className="nx-order-panel">
            <div className="nx-order-panel-header">
              <h2>Order Summary</h2>
            </div>

            <div className="nx-order-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(order.subtotal)}</strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>
                  {order.shipping === 0
                    ? "Free"
                    : formatCurrency(order.shipping)}
                </strong>
              </div>

              <div>
                <span>Tax</span>
                <strong>{formatCurrency(order.tax)}</strong>
              </div>

              <div className="nx-order-grand-total">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
          </section>

          {/* ORDER INFO */}
          <section className="nx-order-panel">
            <div className="nx-order-panel-header">
              <h2>Order Information</h2>
            </div>

            <div className="nx-order-meta">
              <div>
                <span>Order ID</span>
                <strong>{order.id}</strong>
              </div>

              <div>
                <span>Order Date</span>
                <strong>{order.date}</strong>
              </div>

              <div>
                <span>Items</span>
                <strong>{order.items.length}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default OrderDetails;