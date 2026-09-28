import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPayments.css";

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

const getMethodIcon = (method: string) => {
  if (method === "UPI") return "bi-phone";
  if (method === "Credit Card") return "bi-credit-card-2-front";
  if (method === "Debit Card") return "bi-credit-card";
  if (method === "Net Banking") return "bi-bank";
  return "bi-cash-stack";
};

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

export default function AdminPayments() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.transactionId.toLowerCase().includes(query) ||
        payment.orderId.toLowerCase().includes(query) ||
        payment.customerName.toLowerCase().includes(query) ||
        payment.customerEmail.toLowerCase().includes(query) ||
        payment.method.toLowerCase().includes(query) ||
        payment.status.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [search, statusFilter, methodFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const visiblePayments = filteredPayments.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const totalProcessed = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  const pendingPayments = payments.filter(
    (payment) => payment.status === "Pending"
  ).length;

  const refundedAmount = payments
    .filter((payment) => payment.status === "Refunded")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = [
      "Transaction ID",
      "Order ID",
      "Customer",
      "Email",
      "Amount",
      "Payment Method",
      "Status",
      "Date",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.transactionId,
      payment.orderId,
      payment.customerName,
      payment.customerEmail,
      payment.amount,
      payment.method,
      payment.status,
      payment.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexus-payment-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="nx-admin-payments-page">
      <div className="nx-admin-payments-breadcrumb">
        <span>Admin</span>
        <i className="bi bi-chevron-right" />
        <span>Commerce</span>
        <i className="bi bi-chevron-right" />
        <strong>Payments</strong>
      </div>

      <div className="nx-admin-payments-header">
        <div>
          <h1>Payments</h1>
          <p>Monitor, review and manage payment transactions.</p>
        </div>

        <button
          type="button"
          className="nx-admin-payments-export-btn"
          onClick={handleExport}
        >
          <i className="bi bi-download" />
          Export
        </button>
      </div>

      <div className="nx-admin-payments-summary-grid">
        <div className="nx-admin-payments-summary-card">
          <div className="nx-admin-payments-summary-icon blue">
            <i className="bi bi-wallet2" />
          </div>

          <div>
            <span>Total processed</span>
            <strong>{formatCurrency(totalProcessed)}</strong>
            <small>Successful transactions</small>
          </div>
        </div>

        <div className="nx-admin-payments-summary-card">
          <div className="nx-admin-payments-summary-icon green">
            <i className="bi bi-check2-circle" />
          </div>

          <div>
            <span>Successful payments</span>
            <strong>{successfulPayments}</strong>
            <small>Completed successfully</small>
          </div>
        </div>

        <div className="nx-admin-payments-summary-card">
          <div className="nx-admin-payments-summary-icon orange">
            <i className="bi bi-hourglass-split" />
          </div>

          <div>
            <span>Pending payments</span>
            <strong>{pendingPayments}</strong>
            <small>Awaiting confirmation</small>
          </div>
        </div>

        <div className="nx-admin-payments-summary-card">
          <div className="nx-admin-payments-summary-icon purple">
            <i className="bi bi-arrow-counterclockwise" />
          </div>

          <div>
            <span>Refunded</span>
            <strong>{formatCurrency(refundedAmount)}</strong>
            <small>Refunded transaction value</small>
          </div>
        </div>
      </div>

      <section className="nx-admin-payments-card">
        <div className="nx-admin-payments-card-header">
          <div>
            <h2>Payment transactions</h2>
            <p>Review and manage recent payment activity.</p>
          </div>

          <span className="nx-admin-payments-count">
            {filteredPayments.length} transactions
          </span>
        </div>

        <div className="nx-admin-payments-filters">
          <div className="nx-admin-payments-search">
            <i className="bi bi-search" />
            <input
              type="text"
              value={search}
              placeholder="Search transaction, order, customer or email..."
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(event) => {
              setMethodFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>

          {(search || statusFilter !== "All" || methodFilter !== "All") && (
            <button
              type="button"
              className="nx-admin-payments-clear-btn"
              onClick={clearFilters}
            >
              Clear
            </button>
          )}
        </div>

        <div className="nx-admin-payments-table-wrap">
          <table className="nx-admin-payments-table">
            <thead>
              <tr>
                <th>TRANSACTION</th>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>PAYMENT METHOD</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {visiblePayments.length > 0 ? (
                visiblePayments.map((payment) => (
                  <tr key={payment.transactionId}>
                    <td>
                      <button
                        type="button"
                        className="nx-admin-payments-transaction-link"
                        onClick={() =>
                          navigate(
                            `/admin/payments/${payment.transactionId}`
                          )
                        }
                      >
                        {payment.transactionId}
                      </button>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="nx-admin-payments-order-link"
                        onClick={() =>
                          navigate(`/admin/orders/${payment.orderId}`)
                        }
                      >
                        {payment.orderId}
                      </button>
                    </td>

                    <td>
                      <div className="nx-admin-payments-customer">
                        <div className="nx-admin-payments-avatar">
                          {payment.customerName.charAt(0)}
                        </div>

                        <div>
                          <strong>{payment.customerName}</strong>
                          <span>{payment.customerEmail}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="nx-admin-payments-method">
                        <span>
                          <i
                            className={`bi ${getMethodIcon(
                              payment.method
                            )}`}
                          />
                        </span>
                        {payment.method}
                      </div>
                    </td>

                    <td>
                      <span className="nx-admin-payments-amount">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`nx-payment-status ${payment.status.toLowerCase()}`}
                      >
                        <i
                          className={`bi ${getStatusIcon(payment.status)}`}
                        />
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      <span className="nx-admin-payments-date">
                        {payment.date}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="nx-admin-payments-view-btn"
                        onClick={() =>
                          navigate(
                            `/admin/payments/${payment.transactionId}`
                          )
                        }
                      >
                        View details
                        <i className="bi bi-arrow-right" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="nx-admin-payments-empty">
                      <div>
                        <i className="bi bi-search" />
                      </div>
                      <h3>No payments found</h3>
                      <p>
                        Try changing your search or filter criteria.
                      </p>
                      <button type="button" onClick={clearFilters}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nx-admin-payments-table-footer">
          <span>
            Showing{" "}
            <strong>
              {filteredPayments.length === 0
                ? 0
                : (safePage - 1) * rowsPerPage + 1}
              -
              {Math.min(safePage * rowsPerPage, filteredPayments.length)}
            </strong>{" "}
            of <strong>{filteredPayments.length}</strong>
          </span>

          <div>
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              <i className="bi bi-chevron-left" />
            </button>

            <span>
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}