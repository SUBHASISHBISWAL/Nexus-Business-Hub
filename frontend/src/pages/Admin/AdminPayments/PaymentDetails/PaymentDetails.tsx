import { useNavigate, useParams } from "react-router-dom";
import "./PaymentDetails.css";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

type Payment = {
  transactionId: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  date: string;
};

const payments: Payment[] = [
  {
    transactionId: "PAY-20491",
    orderId: "ORD-10284",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.sharma@gmail.com",
    amount: 57499,
    method: "UPI",
    status: "Paid",
    date: "18 Sep 2026, 11:42 AM",
  },
  {
    transactionId: "PAY-20490",
    orderId: "ORD-10283",
    customerName: "Priya Das",
    customerEmail: "priya.das@gmail.com",
    amount: 78500,
    method: "Credit Card",
    status: "Paid",
    date: "18 Sep 2026, 10:18 AM",
  },
  {
    transactionId: "PAY-20489",
    orderId: "ORD-10282",
    customerName: "Amit Kumar",
    customerEmail: "amit.kumar@gmail.com",
    amount: 42150,
    method: "Net Banking",
    status: "Paid",
    date: "18 Sep 2026, 09:56 AM",
  },
  {
    transactionId: "PAY-20488",
    orderId: "ORD-10281",
    customerName: "Sneha Patel",
    customerEmail: "sneha.patel@gmail.com",
    amount: 12400,
    method: "Debit Card",
    status: "Pending",
    date: "17 Sep 2026, 05:24 PM",
  },
  {
    transactionId: "PAY-20487",
    orderId: "ORD-10280",
    customerName: "Arjun Singh",
    customerEmail: "arjun.singh@gmail.com",
    amount: 96500,
    method: "Credit Card",
    status: "Paid",
    date: "17 Sep 2026, 04:10 PM",
  },
  {
    transactionId: "PAY-20486",
    orderId: "ORD-10279",
    customerName: "Neha Mishra",
    customerEmail: "neha.mishra@gmail.com",
    amount: 26890,
    method: "UPI",
    status: "Paid",
    date: "17 Sep 2026, 02:48 PM",
  },
  {
    transactionId: "PAY-20485",
    orderId: "ORD-10278",
    customerName: "Vikash Rout",
    customerEmail: "vikash.rout@gmail.com",
    amount: 32800,
    method: "UPI",
    status: "Failed",
    date: "17 Sep 2026, 01:32 PM",
  },
  {
    transactionId: "PAY-20484",
    orderId: "ORD-10277",
    customerName: "Ananya Roy",
    customerEmail: "ananya.roy@gmail.com",
    amount: 55790,
    method: "Net Banking",
    status: "Paid",
    date: "16 Sep 2026, 06:22 PM",
  },
  {
    transactionId: "PAY-20483",
    orderId: "ORD-10276",
    customerName: "Rohit Mehta",
    customerEmail: "rohit.mehta@gmail.com",
    amount: 18450,
    method: "Cash on Delivery",
    status: "Pending",
    date: "16 Sep 2026, 04:45 PM",
  },
  {
    transactionId: "PAY-20482",
    orderId: "ORD-10275",
    customerName: "Kavita Singh",
    customerEmail: "kavita.singh@gmail.com",
    amount: 46200,
    method: "Credit Card",
    status: "Refunded",
    date: "16 Sep 2026, 03:12 PM",
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "Paid":
      return "bi-check-circle-fill";
    case "Pending":
      return "bi-clock-fill";
    case "Failed":
      return "bi-x-circle-fill";
    case "Refunded":
      return "bi-arrow-counterclockwise";
    default:
      return "bi-circle";
  }
};

export default function PaymentDetails() {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();

  const payment = payments.find(
    (item) =>
      item.transactionId.toLowerCase() ===
      (paymentId ?? "").toLowerCase()
  );

  const handlePrint = () => {
    window.print();
  };

  if (!payment) {
    return (
      <div className="nx-payment-details-page">
        <div className="nx-payment-not-found">
          <div className="nx-payment-not-found-icon">
            <i className="bi bi-receipt" />
          </div>

          <h1>Payment not found</h1>

          <p>
            The payment transaction you are looking for does not exist or
            may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/payments")}
          >
            <i className="bi bi-arrow-left" />
            Back to payments
          </button>
        </div>
      </div>
    );
  }

  const canRefund =
    payment.status === "Paid" || payment.status === "Pending";

  return (
    <div className="nx-payment-details-page">
      <div className="nx-payment-details-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin
        </button>

        <i className="bi bi-chevron-right" />

        <span>Commerce</span>

        <i className="bi bi-chevron-right" />

        <button
          type="button"
          onClick={() => navigate("/admin/payments")}
        >
          Payments
        </button>

        <i className="bi bi-chevron-right" />

        <strong>{payment.transactionId}</strong>
      </div>

      <div className="nx-payment-details-header">
        <div className="nx-payment-details-title-area">
          <button
            type="button"
            className="nx-payment-back-button"
            onClick={() => navigate("/admin/payments")}
          >
            <i className="bi bi-arrow-left" />
          </button>

          <div>
            <div className="nx-payment-title-line">
              <h1>{payment.transactionId}</h1>

              <span
                className={`nx-payment-detail-status ${payment.status.toLowerCase()}`}
              >
                <i className={`bi ${getStatusIcon(payment.status)}`} />
                {payment.status}
              </span>
            </div>

            <p>
              Payment transaction for order{" "}
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/orders/${payment.orderId}`)
                }
              >
                {payment.orderId}
              </button>
            </p>
          </div>
        </div>

        <div className="nx-payment-header-actions">
          <button
            type="button"
            className="nx-payment-secondary-button"
            onClick={handlePrint}
          >
            <i className="bi bi-printer" />
            Print receipt
          </button>

          {canRefund && (
            <button
              type="button"
              className="nx-payment-primary-button"
              onClick={() =>
                window.alert("Refund workflow will be connected to backend.")
              }
            >
              <i className="bi bi-arrow-counterclockwise" />
              Refund payment
            </button>
          )}
        </div>
      </div>

      <div className="nx-payment-details-layout">
        <main className="nx-payment-details-main">
          <section className="nx-payment-details-card">
            <div className="nx-payment-card-header">
              <div className="nx-payment-card-icon blue">
                <i className="bi bi-credit-card-2-front" />
              </div>

              <div>
                <h2>Payment overview</h2>
                <p>Transaction and payment information</p>
              </div>
            </div>

            <div className="nx-payment-amount-section">
              <span>Payment amount</span>
              <strong>{formatCurrency(payment.amount)}</strong>
              <small>{payment.method}</small>
            </div>

            <div className="nx-payment-information-grid">
              <div className="nx-payment-information-item">
                <span>Transaction ID</span>
                <strong className="nx-payment-monospace">
                  {payment.transactionId}
                </strong>
              </div>

              <div className="nx-payment-information-item">
                <span>Order ID</span>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/orders/${payment.orderId}`)
                  }
                >
                  {payment.orderId}
                </button>
              </div>

              <div className="nx-payment-information-item">
                <span>Payment method</span>
                <strong>{payment.method}</strong>
              </div>

              <div className="nx-payment-information-item">
                <span>Payment date</span>
                <strong>{payment.date}</strong>
              </div>
            </div>
          </section>

          <section className="nx-payment-details-card">
            <div className="nx-payment-card-header">
              <div className="nx-payment-card-icon purple">
                <i className="bi bi-shield-check" />
              </div>

              <div>
                <h2>Gateway information</h2>
                <p>Payment processor and reference details</p>
              </div>
            </div>

            <div className="nx-payment-information-grid">
              <div className="nx-payment-information-item">
                <span>Gateway</span>
                <strong>Razorpay</strong>
              </div>

              <div className="nx-payment-information-item">
                <span>Gateway transaction ID</span>
                <strong className="nx-payment-monospace">
                  rzp_txn_7F82K9M20491
                </strong>
              </div>

              <div className="nx-payment-information-item">
                <span>Currency</span>
                <strong>INR</strong>
              </div>

              <div className="nx-payment-information-item">
                <span>Payment mode</span>
                <strong>{payment.method}</strong>
              </div>
            </div>
          </section>

          <section className="nx-payment-details-card">
            <div className="nx-payment-card-header">
              <div className="nx-payment-card-icon green">
                <i className="bi bi-person" />
              </div>

              <div>
                <h2>Billing information</h2>
                <p>Customer information associated with this payment</p>
              </div>
            </div>

            <div className="nx-payment-customer">
              <div className="nx-payment-avatar">
                {payment.customerName.charAt(0)}
              </div>

              <div>
                <strong>{payment.customerName}</strong>
                <span>{payment.customerEmail}</span>
              </div>
            </div>

            <div className="nx-payment-address">
              <div className="nx-payment-address-icon">
                <i className="bi bi-geo-alt" />
              </div>

              <div>
                <span>Billing address</span>
                <p>
                  24, Sector 18
                  <br />
                  Noida, Uttar Pradesh 201301
                  <br />
                  India
                </p>
              </div>
            </div>
          </section>
        </main>

        <aside className="nx-payment-details-sidebar">
          <section className="nx-payment-details-card">
            <div className="nx-payment-sidebar-header">
              <h2>Transaction status</h2>
            </div>

            <div className="nx-payment-status-panel">
              <div
                className={`nx-payment-status-icon ${payment.status.toLowerCase()}`}
              >
                <i className={`bi ${getStatusIcon(payment.status)}`} />
              </div>

              <strong>{payment.status}</strong>

              <p>
                {payment.status === "Paid" &&
                  "Payment was successfully completed and confirmed."}

                {payment.status === "Pending" &&
                  "Payment is awaiting confirmation from the gateway."}

                {payment.status === "Failed" &&
                  "The payment attempt was not completed successfully."}

                {payment.status === "Refunded" &&
                  "The payment amount has been refunded to the customer."}
              </p>
            </div>
          </section>

          <section className="nx-payment-details-card">
            <div className="nx-payment-sidebar-header">
              <h2>Order summary</h2>
            </div>

            <div className="nx-payment-order-summary">
              <div>
                <span>Order</span>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/orders/${payment.orderId}`)
                  }
                >
                  {payment.orderId}
                </button>
              </div>

              <div>
                <span>Customer</span>
                <strong>{payment.customerName}</strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>{formatCurrency(payment.amount)}</strong>
              </div>

              <div>
                <span>Method</span>
                <strong>{payment.method}</strong>
              </div>
            </div>
          </section>

          <section className="nx-payment-details-card">
            <div className="nx-payment-sidebar-header">
              <h2>Quick actions</h2>
            </div>

            <div className="nx-payment-quick-actions">
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/orders/${payment.orderId}`)
                }
              >
                <span>
                  <i className="bi bi-box-seam" />
                </span>
                View order
                <i className="bi bi-chevron-right" />
              </button>

              <button type="button" onClick={handlePrint}>
                <span>
                  <i className="bi bi-printer" />
                </span>
                Print receipt
                <i className="bi bi-chevron-right" />
              </button>

              <button
                type="button"
                onClick={() =>
                  window.alert("Customer details page will be connected.")
                }
              >
                <span>
                  <i className="bi bi-person" />
                </span>
                Customer details
                <i className="bi bi-chevron-right" />
              </button>

              {canRefund && (
                <button
                  type="button"
                  onClick={() =>
                    window.alert(
                      "Refund workflow will be connected to backend."
                    )
                  }
                >
                  <span>
                    <i className="bi bi-arrow-counterclockwise" />
                  </span>
                  Refund payment
                  <i className="bi bi-chevron-right" />
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}