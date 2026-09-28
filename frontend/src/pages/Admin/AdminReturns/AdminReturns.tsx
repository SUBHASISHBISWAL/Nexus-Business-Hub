import React, { useMemo, useState } from "react";
import "./AdminReturns.css";

type ReturnStatus = "Pending" | "Approved" | "Rejected" | "Refunded";

type ReturnItem = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  reason: string;
  amount: number;
  status: ReturnStatus;
  requestedDate: string;
};

const returnsData: ReturnItem[] = [
  {
    id: "RET-3001",
    orderId: "ORD-10284",
    customer: "Rahul Sharma",
    product: "Dell Latitude 5440",
    reason: "Damaged product",
    amount: 55000,
    status: "Pending",
    requestedDate: "24 Sep 2026",
  },
  {
    id: "RET-3002",
    orderId: "ORD-10279",
    customer: "Priya Das",
    product: "Logitech MX Keys",
    reason: "Wrong item received",
    amount: 8500,
    status: "Approved",
    requestedDate: "23 Sep 2026",
  },
  {
    id: "RET-3003",
    orderId: "ORD-10271",
    customer: "Amit Kumar",
    product: "Samsung Galaxy S24",
    reason: "Product not as expected",
    amount: 72000,
    status: "Refunded",
    requestedDate: "22 Sep 2026",
  },
  {
    id: "RET-3004",
    orderId: "ORD-10265",
    customer: "Neha Singh",
    product: "HP Wireless Keyboard",
    reason: "Defective product",
    amount: 2200,
    status: "Pending",
    requestedDate: "21 Sep 2026",
  },
  {
    id: "RET-3005",
    orderId: "ORD-10258",
    customer: "Sourav Patra",
    product: "Microsoft 365 Business",
    reason: "Duplicate purchase",
    amount: 12999,
    status: "Approved",
    requestedDate: "20 Sep 2026",
  },
  {
    id: "RET-3006",
    orderId: "ORD-10246",
    customer: "Ananya Mishra",
    product: "Ergonomic Office Chair",
    reason: "Damaged product",
    amount: 8000,
    status: "Refunded",
    requestedDate: "18 Sep 2026",
  },
  {
    id: "RET-3007",
    orderId: "ORD-10239",
    customer: "Vikash Rout",
    product: "Kingston 1TB SSD",
    reason: "Performance issue",
    amount: 6500,
    status: "Rejected",
    requestedDate: "17 Sep 2026",
  },
  {
    id: "RET-3008",
    orderId: "ORD-10231",
    customer: "Pooja Nair",
    product: "Apple Magic Mouse",
    reason: "Wrong item received",
    amount: 7200,
    status: "Pending",
    requestedDate: "16 Sep 2026",
  },
  {
    id: "RET-3009",
    orderId: "ORD-10224",
    customer: "Arjun Mehta",
    product: "Lenovo ThinkPad E14",
    reason: "Defective product",
    amount: 62000,
    status: "Approved",
    requestedDate: "15 Sep 2026",
  },
  {
    id: "RET-3010",
    orderId: "ORD-10216",
    customer: "Riya Sen",
    product: "Cisco Business Router",
    reason: "Product not as expected",
    amount: 18500,
    status: "Refunded",
    requestedDate: "14 Sep 2026",
  },
  {
    id: "RET-3011",
    orderId: "ORD-10208",
    customer: "Manish Gupta",
    product: "Dell Monitor 24-inch",
    reason: "Damaged product",
    amount: 14500,
    status: "Pending",
    requestedDate: "13 Sep 2026",
  },
  {
    id: "RET-3012",
    orderId: "ORD-10197",
    customer: "Sneha Das",
    product: "TP-Link Wi-Fi Adapter",
    reason: "Wrong item received",
    amount: 1800,
    status: "Rejected",
    requestedDate: "12 Sep 2026",
  },
];

const returnsPerPage = 7;

const AdminReturns: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReturns = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return returnsData.filter((item) => {
      const matchesSearch =
        !searchValue ||
        item.id.toLowerCase().includes(searchValue) ||
        item.orderId.toLowerCase().includes(searchValue) ||
        item.customer.toLowerCase().includes(searchValue) ||
        item.product.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesReason =
        reasonFilter === "All" || item.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [search, statusFilter, reasonFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReturns.length / returnsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReturns = filteredReturns.slice(
    (safeCurrentPage - 1) * returnsPerPage,
    safeCurrentPage * returnsPerPage
  );

  const totalReturns = returnsData.length;
  const pendingReturns = returnsData.filter(
    (item) => item.status === "Pending"
  ).length;
  const approvedReturns = returnsData.filter(
    (item) => item.status === "Approved"
  ).length;
  const refundedReturns = returnsData.filter(
    (item) => item.status === "Refunded"
  ).length;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleReasonChange = (value: string) => {
    setReasonFilter(value);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setStatusFilter("All");
    setReasonFilter("All");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = [
      "Return ID",
      "Order ID",
      "Customer",
      "Product",
      "Reason",
      "Amount",
      "Status",
      "Requested Date",
    ];

    const rows = filteredReturns.map((item) => [
      item.id,
      item.orderId,
      item.customer,
      item.product,
      item.reason,
      item.amount,
      item.status,
      item.requestedDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "returns-refunds.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleView = (returnId: string) => {
    window.location.href = `/admin/returns/${returnId}`;
  };

  return (
    <div className="nx-admin-returns-page">
      <div className="nx-admin-returns-breadcrumb">
        <span>Admin</span>
        <i className="bi bi-chevron-right" />
        <strong>Returns & Refunds</strong>
      </div>

      <div className="nx-admin-returns-header">
        <div>
          <h1>Returns & Refunds</h1>
          <p>
            Review product returns, refund requests and customer claims.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-returns-export-btn"
          onClick={handleExport}
        >
          <i className="bi bi-download" />
          Export
        </button>
      </div>

      <div className="nx-admin-returns-summary-grid">
        <div className="nx-admin-returns-summary-card">
          <div className="nx-admin-returns-summary-icon blue">
            <i className="bi bi-arrow-return-left" />
          </div>

          <div>
            <span>Total Returns</span>
            <strong>{totalReturns}</strong>
            <small>All return requests</small>
          </div>
        </div>

        <div className="nx-admin-returns-summary-card">
          <div className="nx-admin-returns-summary-icon orange">
            <i className="bi bi-hourglass-split" />
          </div>

          <div>
            <span>Pending Review</span>
            <strong>{pendingReturns}</strong>
            <small>Awaiting review</small>
          </div>
        </div>

        <div className="nx-admin-returns-summary-card">
          <div className="nx-admin-returns-summary-icon green">
            <i className="bi bi-check-circle" />
          </div>

          <div>
            <span>Approved</span>
            <strong>{approvedReturns}</strong>
            <small>Approved returns</small>
          </div>
        </div>

        <div className="nx-admin-returns-summary-card">
          <div className="nx-admin-returns-summary-icon purple">
            <i className="bi bi-wallet2" />
          </div>

          <div>
            <span>Refunded</span>
            <strong>{refundedReturns}</strong>
            <small>Completed refunds</small>
          </div>
        </div>
      </div>

      <section className="nx-admin-returns-card">
        <div className="nx-admin-returns-filters">
          <div className="nx-admin-returns-search">
            <i className="bi bi-search" />

            <input
              type="text"
              placeholder="Search return ID, order, customer..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={reasonFilter}
            onChange={(e) => handleReasonChange(e.target.value)}
          >
            <option value="All">All Reasons</option>
            <option value="Damaged product">Damaged product</option>
            <option value="Wrong item received">
              Wrong item received
            </option>
            <option value="Defective product">Defective product</option>
            <option value="Product not as expected">
              Product not as expected
            </option>
            <option value="Duplicate purchase">
              Duplicate purchase
            </option>
            <option value="Performance issue">
              Performance issue
            </option>
          </select>

          <button
            type="button"
            className="nx-admin-returns-clear-btn"
            onClick={handleClear}
          >
            <i className="bi bi-arrow-counterclockwise" />
            Clear
          </button>
        </div>

        <div className="nx-admin-returns-table-wrap">
          <table className="nx-admin-returns-table">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReturns.length > 0 ? (
                paginatedReturns.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button
                        type="button"
                        className="nx-admin-returns-id-link"
                        onClick={() => handleView(item.id)}
                      >
                        {item.id}
                      </button>
                    </td>

                    <td>
                      <span className="nx-admin-returns-order-link">
                        {item.orderId}
                      </span>
                    </td>

                    <td>
                      <div className="nx-admin-returns-customer">
                        <div className="nx-admin-returns-avatar">
                          {item.customer
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <span>{item.customer}</span>
                      </div>
                    </td>

                    <td>
                      <span className="nx-admin-returns-product">
                        {item.product}
                      </span>
                    </td>

                    <td>
                      <span className="nx-admin-returns-reason">
                        {item.reason}
                      </span>
                    </td>

                    <td className="nx-admin-returns-amount">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`nx-return-status ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="nx-admin-returns-date">
                      {item.requestedDate}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="nx-admin-returns-view-btn"
                        onClick={() => handleView(item.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="nx-admin-returns-empty">
                      <i className="bi bi-search" />
                      <strong>No returns found</strong>
                      <span>
                        Try adjusting your search or filters.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="nx-admin-returns-table-footer">
          <span>
            Showing{" "}
            {filteredReturns.length === 0
              ? 0
              : (safeCurrentPage - 1) * returnsPerPage + 1}
            -
            {Math.min(
              safeCurrentPage * returnsPerPage,
              filteredReturns.length
            )}{" "}
            of {filteredReturns.length}
          </span>

          <div>
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              <i className="bi bi-chevron-left" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={safeCurrentPage === page ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminReturns;