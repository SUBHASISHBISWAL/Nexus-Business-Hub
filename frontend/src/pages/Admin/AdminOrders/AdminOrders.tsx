import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

type Order = {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  payment: "Paid" | "Pending" | "Failed";
  status: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
};

const orders: Order[] = [
  {
    id: "ORD-10284",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    items: 2,
    total: 57499,
    payment: "Paid",
    status: "Processing",
    date: "18 Sep 2026",
  },
  {
    id: "ORD-10283",
    customer: "Priya Das",
    email: "priya@example.com",
    items: 1,
    total: 78500,
    payment: "Paid",
    status: "Shipped",
    date: "18 Sep 2026",
  },
  {
    id: "ORD-10282",
    customer: "Amit Kumar",
    email: "amit@example.com",
    items: 3,
    total: 42150,
    payment: "Paid",
    status: "Delivered",
    date: "17 Sep 2026",
  },
  {
    id: "ORD-10281",
    customer: "Sneha Patel",
    email: "sneha@example.com",
    items: 1,
    total: 12400,
    payment: "Pending",
    status: "Placed",
    date: "17 Sep 2026",
  },
  {
    id: "ORD-10280",
    customer: "Arjun Singh",
    email: "arjun@example.com",
    items: 4,
    total: 96500,
    payment: "Paid",
    status: "Delivered",
    date: "16 Sep 2026",
  },
  {
    id: "ORD-10279",
    customer: "Neha Mishra",
    email: "neha@example.com",
    items: 2,
    total: 26890,
    payment: "Paid",
    status: "Shipped",
    date: "16 Sep 2026",
  },
  {
    id: "ORD-10278",
    customer: "Vikash Rout",
    email: "vikash@example.com",
    items: 1,
    total: 32800,
    payment: "Failed",
    status: "Cancelled",
    date: "15 Sep 2026",
  },
  {
    id: "ORD-10277",
    customer: "Ananya Roy",
    email: "ananya@example.com",
    items: 2,
    total: 55790,
    payment: "Paid",
    status: "Processing",
    date: "15 Sep 2026",
  },
  {
    id: "ORD-10276",
    customer: "Sourav Das",
    email: "sourav@example.com",
    items: 3,
    total: 18900,
    payment: "Paid",
    status: "Delivered",
    date: "14 Sep 2026",
  },
  {
    id: "ORD-10275",
    customer: "Ritika Singh",
    email: "ritika@example.com",
    items: 1,
    total: 9600,
    payment: "Pending",
    status: "Placed",
    date: "14 Sep 2026",
  },
  {
    id: "ORD-10274",
    customer: "Manish Gupta",
    email: "manish@example.com",
    items: 2,
    total: 48800,
    payment: "Paid",
    status: "Delivered",
    date: "13 Sep 2026",
  },
  {
    id: "ORD-10273",
    customer: "Karan Mehta",
    email: "karan@example.com",
    items: 1,
    total: 44200,
    payment: "Paid",
    status: "Shipped",
    date: "13 Sep 2026",
  },
];

const statusOptions = [
  "All",
  "Placed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const paymentOptions = [
  "All",
  "Paid",
  "Pending",
  "Failed",
];

function AdminOrders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [page, setPage] = useState(1);

  const ordersPerPage = 8;

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || order.status === status;

      const matchesPayment =
        payment === "All" || order.payment === payment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [search, status, payment]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const paidOrders = filteredOrders.filter(
    (order) => order.payment === "Paid"
  ).length;

  const pendingOrders = filteredOrders.filter(
    (order) =>
      order.status === "Placed" ||
      order.status === "Processing"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setPayment("All");
    setPage(1);
  };

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="nx-admin-orders">
      {/* HEADER */}
      <div className="nx-orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders, payments and order status.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="nx-orders-summary">
        <div className="nx-order-summary-card">
          <span>Total Orders</span>
          <strong>{filteredOrders.length}</strong>
        </div>

        <div className="nx-order-summary-card">
          <span>Order Value</span>
          <strong>{formatCurrency(totalRevenue)}</strong>
        </div>

        <div className="nx-order-summary-card">
          <span>Paid Orders</span>
          <strong>{paidOrders}</strong>
        </div>

        <div className="nx-order-summary-card">
          <span>Pending Orders</span>
          <strong>{pendingOrders}</strong>
        </div>
      </div>

      {/* FILTERS */}
      <div className="nx-orders-toolbar">
        <div className="nx-orders-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search order ID, customer..."
          />
        </div>

        <div className="nx-order-filter">
          <label>Status</label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="nx-order-filter">
          <label>Payment</label>

          <select
            value={payment}
            onChange={(event) => {
              setPayment(event.target.value);
              setPage(1);
            }}
          >
            {paymentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="nx-clear-orders"
          onClick={resetFilters}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="nx-orders-card">
        <div className="nx-orders-table-wrapper">
          <table className="nx-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <button
                      type="button"
                      className="nx-order-id"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${order.id}`
                        )
                      }
                    >
                      {order.id}
                    </button>
                  </td>

                  <td>
                    <div className="nx-customer">
                      <strong>{order.customer}</strong>
                      <span>{order.email}</span>
                    </div>
                  </td>

                  <td>{order.items}</td>

                  <td className="nx-order-total">
                    {formatCurrency(order.total)}
                  </td>

                  <td>
                    <span
                      className={`nx-payment-badge ${order.payment
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.payment}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`nx-order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="nx-order-date">
                    {order.date}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="nx-view-order"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${order.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!paginatedOrders.length && (
            <div className="nx-orders-empty">
              <h3>No orders found</h3>
              <p>
                Try changing your search or filter options.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredOrders.length > 0 && (
          <div className="nx-orders-pagination">
            <span>
              Showing{" "}
              {(currentPage - 1) * ordersPerPage + 1}
              {" - "}
              {Math.min(
                currentPage * ordersPerPage,
                filteredOrders.length
              )}{" "}
              of {filteredOrders.length}
            </span>

            <div className="nx-pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setPage((previous) => previous - 1)
                }
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={
                    pageNumber === currentPage
                      ? "active"
                      : ""
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((previous) => previous + 1)
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;