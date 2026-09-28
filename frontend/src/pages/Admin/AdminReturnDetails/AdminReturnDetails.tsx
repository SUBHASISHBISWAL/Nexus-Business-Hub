import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminReturnDetails.css";

type ReturnStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Refunded";

type ReturnData = {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  product: string;
  sku: string;
  reason: string;
  amount: number;
  status: ReturnStatus;
  requestedDate: string;
  approvedDate?: string;
  refundDate?: string;
  warehouse: string;
  pickupStatus: string;
  refundMethod: string;
  customerNote: string;
};

const returnsData: ReturnData[] = [
  {
    id: "RET-3001",
    orderId: "ORD-10284",
    customer: "Rahul Sharma",
    customerEmail: "rahul.sharma@email.com",
    product: "Dell Latitude 5420",
    sku: "DL-5420",
    reason: "Product damaged",
    amount: 55000,
    status: "Pending",
    requestedDate: "24 Sep 2026",
    warehouse: "Delhi Warehouse",
    pickupStatus: "Pickup pending",
    refundMethod: "Original payment method",
    customerNote:
      "The product was received with visible damage on the outer body.",
  },
  {
    id: "RET-3002",
    orderId: "ORD-10281",
    customer: "Priya Das",
    customerEmail: "priya.das@email.com",
    product: "Samsung Galaxy S24",
    sku: "SAM-S24",
    reason: "Wrong product",
    amount: 62000,
    status: "Approved",
    requestedDate: "23 Sep 2026",
    approvedDate: "24 Sep 2026",
    warehouse: "Kolkata Warehouse",
    pickupStatus: "Pickup scheduled",
    refundMethod: "Original payment method",
    customerNote:
      "The customer received a different model than the one ordered.",
  },
  {
    id: "RET-3003",
    orderId: "ORD-10276",
    customer: "Amit Kumar",
    customerEmail: "amit.kumar@email.com",
    product: "HP Wireless Keyboard",
    sku: "HP-KB-102",
    reason: "Not as expected",
    amount: 1500,
    status: "Refunded",
    requestedDate: "21 Sep 2026",
    approvedDate: "22 Sep 2026",
    refundDate: "23 Sep 2026",
    warehouse: "Delhi Warehouse",
    pickupStatus: "Returned",
    refundMethod: "UPI",
    customerNote:
      "The customer requested a return because the product did not meet expectations.",
  },
  {
    id: "RET-3004",
    orderId: "ORD-10270",
    customer: "Sneha Patel",
    customerEmail: "sneha.patel@email.com",
    product: "Logitech MX Master 3S",
    sku: "LOG-MX3S",
    reason: "Defective product",
    amount: 8900,
    status: "Approved",
    requestedDate: "20 Sep 2026",
    approvedDate: "21 Sep 2026",
    warehouse: "Mumbai Warehouse",
    pickupStatus: "In transit",
    refundMethod: "Original payment method",
    customerNote:
      "Mouse stopped working intermittently after initial setup.",
  },
  {
    id: "RET-3005",
    orderId: "ORD-10265",
    customer: "Arjun Mehta",
    customerEmail: "arjun.mehta@email.com",
    product: "Office Chair Pro",
    sku: "CHR-PRO-01",
    reason: "Damaged in transit",
    amount: 8000,
    status: "Rejected",
    requestedDate: "19 Sep 2026",
    warehouse: "Delhi Warehouse",
    pickupStatus: "Not applicable",
    refundMethod: "Original payment method",
    customerNote:
      "Return request was rejected after inspection found no qualifying damage.",
  },
];

function AdminReturnDetails() {
  const navigate = useNavigate();
  const { returnId } = useParams();

  const returnData = useMemo(() => {
    return returnsData.find(
      (item) => item.id === returnId
    );
  }, [returnId]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusClass = (status: ReturnStatus) => {
    switch (status) {
      case "Approved":
        return "approved";

      case "Rejected":
        return "rejected";

      case "Refunded":
        return "refunded";

      default:
        return "pending";
    }
  };

  if (!returnData) {
    return (
      <div className="nx-return-details-page">
        <div className="nx-return-not-found">
          <div className="nx-return-not-found-icon">
            <i className="bi bi-file-earmark-x" />
          </div>

          <h2>Return not found</h2>

          <p>
            The requested return record could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/returns")}
          >
            <i className="bi bi-arrow-left" />
            Back to Returns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-return-details-page">
      {/* ================= BREADCRUMB ================= */}
      <div className="nx-return-details-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/admin/returns")}
        >
          Returns & Refunds
        </button>

        <i className="bi bi-chevron-right" />

        <strong>{returnData.id}</strong>
      </div>

      {/* ================= HEADER ================= */}
      <div className="nx-return-details-header">
        <div>
          <h1>Return Details</h1>

          <p>
            Review return request, customer information and
            refund details.
          </p>
        </div>

        <div className="nx-return-details-header-actions">
          <button
            type="button"
            className="nx-return-back-btn"
            onClick={() => navigate("/admin/returns")}
          >
            <i className="bi bi-arrow-left" />
            Back
          </button>

          <button
            type="button"
            className="nx-return-print-btn"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer" />
            Print
          </button>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="nx-return-summary-grid">
        <div className="nx-return-summary-card">
          <div className="nx-return-summary-icon blue">
            <i className="bi bi-arrow-return-left" />
          </div>

          <div>
            <span>Return ID</span>
            <strong>{returnData.id}</strong>
            <small>{returnData.requestedDate}</small>
          </div>
        </div>

        <div className="nx-return-summary-card">
          <div className="nx-return-summary-icon purple">
            <i className="bi bi-receipt" />
          </div>

          <div>
            <span>Order ID</span>
            <strong>{returnData.orderId}</strong>
            <small>Original order</small>
          </div>
        </div>

        <div className="nx-return-summary-card">
          <div className="nx-return-summary-icon orange">
            <i className="bi bi-currency-rupee" />
          </div>

          <div>
            <span>Return Amount</span>
            <strong>{formatAmount(returnData.amount)}</strong>
            <small>Refund value</small>
          </div>
        </div>

        <div className="nx-return-summary-card">
          <div className="nx-return-summary-icon green">
            <i className="bi bi-check-circle" />
          </div>

          <div>
            <span>Status</span>

            <strong
              className={`nx-return-status ${getStatusClass(
                returnData.status
              )}`}
            >
              {returnData.status}
            </strong>

            <small>Current status</small>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="nx-return-details-grid">
        {/* ================= LEFT COLUMN ================= */}
        <div className="nx-return-details-main">
          {/* Product */}
          <section className="nx-return-details-card">
            <div className="nx-return-card-header">
              <div>
                <h2>Product Information</h2>
                <span>Item associated with this return</span>
              </div>
            </div>

            <div className="nx-return-product-box">
              <div className="nx-return-product-icon">
                <i className="bi bi-box-seam" />
              </div>

              <div className="nx-return-product-content">
                <strong>{returnData.product}</strong>

                <span>
                  SKU: {returnData.sku}
                </span>
              </div>

              <div className="nx-return-product-price">
                <span>Amount</span>
                <strong>
                  {formatAmount(returnData.amount)}
                </strong>
              </div>
            </div>

            <div className="nx-return-info-grid">
              <div>
                <span>Return Reason</span>
                <strong>{returnData.reason}</strong>
              </div>

              <div>
                <span>Warehouse</span>
                <strong>{returnData.warehouse}</strong>
              </div>

              <div>
                <span>Pickup Status</span>
                <strong>{returnData.pickupStatus}</strong>
              </div>

              <div>
                <span>Refund Method</span>
                <strong>{returnData.refundMethod}</strong>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="nx-return-details-card">
            <div className="nx-return-card-header">
              <div>
                <h2>Customer Information</h2>
                <span>Customer associated with this request</span>
              </div>
            </div>

            <div className="nx-return-customer-box">
              <div className="nx-return-customer-avatar">
                {returnData.customer
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="nx-return-customer-info">
                <strong>{returnData.customer}</strong>

                <span>{returnData.customerEmail}</span>

                <span>
                  <i className="bi bi-person" />
                  Customer
                </span>
              </div>
            </div>
          </section>

          {/* Customer Note */}
          <section className="nx-return-details-card">
            <div className="nx-return-card-header">
              <div>
                <h2>Customer Note</h2>
                <span>Reason provided with the return request</span>
              </div>
            </div>

            <div className="nx-return-note">
              <i className="bi bi-chat-left-text" />

              <p>{returnData.customerNote}</p>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="nx-return-details-side">
          {/* Status */}
          <section className="nx-return-details-card">
            <div className="nx-return-card-header">
              <div>
                <h2>Return Status</h2>
                <span>Current request status</span>
              </div>
            </div>

            <div className="nx-return-current-status">
              <span
                className={`nx-return-status-large ${getStatusClass(
                  returnData.status
                )}`}
              >
                {returnData.status}
              </span>

              <p>
                Return request was submitted on{" "}
                <strong>
                  {returnData.requestedDate}
                </strong>
                .
              </p>
            </div>

            <div className="nx-return-timeline">
              <div className="nx-return-timeline-item active">
                <div className="nx-return-timeline-dot">
                  <i className="bi bi-send" />
                </div>

                <div>
                  <strong>Return requested</strong>
                  <span>
                    {returnData.requestedDate}
                  </span>
                </div>
              </div>

              {returnData.approvedDate && (
                <div className="nx-return-timeline-item active">
                  <div className="nx-return-timeline-dot">
                    <i className="bi bi-check-lg" />
                  </div>

                  <div>
                    <strong>Return approved</strong>
                    <span>
                      {returnData.approvedDate}
                    </span>
                  </div>
                </div>
              )}

              {returnData.refundDate && (
                <div className="nx-return-timeline-item active">
                  <div className="nx-return-timeline-dot">
                    <i className="bi bi-currency-rupee" />
                  </div>

                  <div>
                    <strong>Refund processed</strong>
                    <span>
                      {returnData.refundDate}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Refund */}
          <section className="nx-return-details-card">
            <div className="nx-return-card-header">
              <div>
                <h2>Refund Information</h2>
                <span>Refund processing details</span>
              </div>
            </div>

            <div className="nx-return-refund-row">
              <span>Refund Amount</span>
              <strong>
                {formatAmount(returnData.amount)}
              </strong>
            </div>

            <div className="nx-return-refund-row">
              <span>Refund Method</span>
              <strong>
                {returnData.refundMethod}
              </strong>
            </div>

            <div className="nx-return-refund-row">
              <span>Refund Status</span>

              <strong
                className={`nx-return-refund-status ${getStatusClass(
                  returnData.status
                )}`}
              >
                {returnData.status === "Refunded"
                  ? "Processed"
                  : "Not processed"}
              </strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminReturnDetails;