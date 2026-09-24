
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ShipmentDetails.css";

type ShipmentEvent = {
  title: string;
  location: string;
  date: string;
  time: string;
  completed: boolean;
};

type Shipment = {
  id: string;
  orderId: string;
  status: string;
  carrier: string;
  trackingNumber: string;
  service: string;
  origin: string;
  destination: string;
  shippedDate: string;
  estimatedDelivery: string;
  currentLocation: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  package: {
    weight: string;
    packages: number;
    dimensions: string;
    method: string;
  };
  orderDate: string;
  events: ShipmentEvent[];
};

const shipments: Record<string, Shipment> = {
  "SHP-5001": {
    id: "SHP-5001",
    orderId: "ORD-10284",
    status: "In Transit",
    carrier: "BlueDart",
    trackingNumber: "BD784512369IN",
    service: "Express Delivery",
    origin: "Delhi",
    destination: "Noida",
    shippedDate: "18 Sep 2026",
    estimatedDelivery: "20 Sep 2026",
    currentLocation: "Delhi → Noida",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },
    address: {
      line1: "Flat 402, Green Valley Apartments",
      line2: "Sector 18",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      country: "India",
    },
    package: {
      weight: "4.8 kg",
      packages: 2,
      dimensions: "42 × 30 × 18 cm",
      method: "Express",
    },
    orderDate: "18 Sep 2026",
    events: [
      {
        title: "Shipment Created",
        location: "Delhi Warehouse",
        date: "18 Sep 2026",
        time: "08:30 AM",
        completed: true,
      },
      {
        title: "Picked Up",
        location: "Delhi Distribution Center",
        date: "18 Sep 2026",
        time: "09:10 AM",
        completed: true,
      },
      {
        title: "In Transit",
        location: "Delhi → Noida",
        date: "19 Sep 2026",
        time: "07:45 AM",
        completed: true,
      },
      {
        title: "Out for Delivery",
        location: "Noida Delivery Hub",
        date: "",
        time: "",
        completed: false,
      },
      {
        title: "Delivered",
        location: "Customer Address",
        date: "",
        time: "",
        completed: false,
      },
    ],
  },
};

const defaultShipment = shipments["SHP-5001"];

const statusOptions = [
  "Pending",
  "Packed",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Delayed",
];

function ShipmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const shipment = useMemo(() => {
    return (id && shipments[id]) || defaultShipment;
  }, [id]);

  const [status, setStatus] = useState(shipment.status);
  const [notice, setNotice] = useState("");

  const handleStatusUpdate = () => {
    setNotice("Shipment status updated successfully.");

    window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const statusClass = status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="nx-shipment-details-page">

      {/* ================= HEADER ================= */}

      <div className="nx-shipment-page-header">
        <div>
          <button
            type="button"
            className="nx-shipment-back-btn"
            onClick={() => navigate("/admin/shipments")}
          >
            ← Shipments
          </button>

          <div className="nx-shipment-header-main">
            <div>
              <h1>{shipment.id}</h1>

              <p>
                Order #{shipment.orderId}
              </p>
            </div>

            <span
              className={`nx-shipment-status-badge ${statusClass}`}
            >
              {status}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="nx-shipment-print-btn"
          onClick={() => window.print()}
        >
          Print Shipment
        </button>
      </div>

      {/* ================= NOTICE ================= */}

      {notice && (
        <div className="nx-shipment-success">
          <span>✓</span>
          {notice}
        </div>
      )}

      {/* ================= SHIPMENT PROGRESS ================= */}

      <section className="nx-shipment-card nx-progress-card">
        <div className="nx-section-title">
          <h2>Shipment Progress</h2>
        </div>

        <div className="nx-shipment-progress">
          {shipment.events.map((event, index) => (
            <div
              key={event.title}
              className={`nx-progress-step ${
                event.completed ? "completed" : ""
              }`}
            >
              <div className="nx-progress-point">
                {event.completed ? "✓" : ""}
              </div>

              <span>{event.title}</span>

              {index < shipment.events.length - 1 && (
                <div
                  className={`nx-progress-line ${
                    shipment.events[index + 1].completed
                      ? "completed"
                      : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= INFORMATION GRID ================= */}

      <div className="nx-shipment-two-column">

        {/* SHIPMENT INFORMATION */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Shipment Information</h2>
          </div>

          <div className="nx-info-grid">
            <div className="nx-info-item">
              <span>Carrier</span>
              <strong>{shipment.carrier}</strong>
            </div>

            <div className="nx-info-item">
              <span>Tracking Number</span>
              <strong>{shipment.trackingNumber}</strong>
            </div>

            <div className="nx-info-item">
              <span>Origin</span>
              <strong>{shipment.origin}</strong>
            </div>

            <div className="nx-info-item">
              <span>Destination</span>
              <strong>{shipment.destination}</strong>
            </div>

            <div className="nx-info-item">
              <span>Shipped</span>
              <strong>{shipment.shippedDate}</strong>
            </div>

            <div className="nx-info-item">
              <span>Expected Delivery</span>
              <strong>{shipment.estimatedDelivery}</strong>
            </div>
          </div>
        </section>

        {/* CURRENT STATUS */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Current Status</h2>
          </div>

          <div className="nx-current-status">
            <div
              className={`nx-large-status ${statusClass}`}
            >
              {status}
            </div>

            <p>
              Shipment is currently moving from{" "}
              <strong>Delhi Distribution Center</strong>{" "}
              to <strong>Noida Delivery Hub</strong>.
            </p>

            <div className="nx-status-meta">
              <div>
                <span>Last Updated</span>
                <strong>19 Sep 2026 · 07:45 AM</strong>
              </div>

              <div>
                <span>Current Location</span>
                <strong>{shipment.currentLocation}</strong>
              </div>
            </div>

            <label
              className="nx-status-label"
              htmlFor="shipment-status"
            >
              Update Status
            </label>

            <select
              id="shipment-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="nx-status-select"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="nx-update-status-btn"
              onClick={handleStatusUpdate}
            >
              Update Status
            </button>
          </div>
        </section>
      </div>

      {/* ================= CUSTOMER + ORDER ================= */}

      <div className="nx-shipment-two-column">

        {/* CUSTOMER */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Customer</h2>
          </div>

          <div className="nx-customer-box">
            <div className="nx-customer-avatar">
              {shipment.customer.name.charAt(0)}
            </div>

            <div className="nx-customer-details">
              <strong>{shipment.customer.name}</strong>
              <span>{shipment.customer.email}</span>
              <span>{shipment.customer.phone}</span>
            </div>
          </div>
        </section>

        {/* ORDER */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Order</h2>
          </div>

          <div className="nx-order-box">
            <div>
              <span>Order ID</span>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/admin/orders/${shipment.orderId}`
                  )
                }
              >
                {shipment.orderId}
              </button>
            </div>

            <div>
              <span>Order Date</span>
              <strong>{shipment.orderDate}</strong>
            </div>

            <button
              type="button"
              className="nx-view-order-btn"
              onClick={() =>
                navigate(
                  `/admin/orders/${shipment.orderId}`
                )
              }
            >
              View Order →
            </button>
          </div>
        </section>
      </div>

      {/* ================= DELIVERY ADDRESS ================= */}

      <section className="nx-shipment-card nx-address-card">
        <div className="nx-section-title">
          <h2>Delivery Address</h2>
        </div>

        <div className="nx-address-content">
          <strong>{shipment.customer.name}</strong>

          <span>{shipment.address.line1}</span>
          <span>{shipment.address.line2}</span>

          <span>
            {shipment.address.city},{" "}
            {shipment.address.state}
          </span>

          <span>
            {shipment.address.pincode},{" "}
            {shipment.address.country}
          </span>
        </div>
      </section>

      {/* ================= PACKAGE + ACTIVITY ================= */}

      <div className="nx-shipment-two-column">

        {/* PACKAGE */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Package Details</h2>
          </div>

          <div className="nx-package-grid">

            <div>
              <span>Weight</span>
              <strong>{shipment.package.weight}</strong>
            </div>

            <div>
              <span>Packages</span>
              <strong>{shipment.package.packages}</strong>
            </div>

            <div>
              <span>Dimensions</span>
              <strong>{shipment.package.dimensions}</strong>
            </div>

            <div>
              <span>Method</span>
              <strong>{shipment.package.method}</strong>
            </div>

          </div>
        </section>

        {/* TRACKING ACTIVITY */}

        <section className="nx-shipment-card">
          <div className="nx-section-title">
            <h2>Tracking Activity</h2>
          </div>

          <div className="nx-activity-list">
            {shipment.events.map((event, index) => (
              <div
                key={`${event.title}-${index}`}
                className={`nx-activity-item ${
                  event.completed ? "active" : "upcoming"
                }`}
              >
                <div className="nx-activity-dot">
                  {event.completed ? "✓" : ""}
                </div>

                <div className="nx-activity-content">
                  <strong>{event.title}</strong>

                  <span>{event.location}</span>

                  {event.date ? (
                    <small>
                      {event.date} · {event.time}
                    </small>
                  ) : (
                    <small>Pending</small>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= ACTIONS ================= */}

      <section className="nx-shipment-card nx-actions-card">
        <div className="nx-section-title">
          <h2>Actions</h2>
        </div>

        <div className="nx-shipment-actions">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin/orders/${shipment.orderId}`
              )
            }
          >
            View Order
          </button>

          <button
            type="button"
            onClick={() => window.print()}
          >
            Print Shipment
          </button>

          <button type="button">
            Contact Customer
          </button>
        </div>
      </section>
    </div>
  );
}

export default ShipmentDetails;
