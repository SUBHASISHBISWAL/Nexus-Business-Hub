import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminTickets.css";

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  email: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Pending Customer" | "Resolved" | "Closed";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
};

const tickets: Ticket[] = [
  {
    id: "TKT-2048",
    subject: "Product received with damaged packaging",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    category: "Order Issue",
    priority: "High",
    status: "Open",
    assignedTo: "Support Team",
    createdAt: "24 Sep 2026, 09:15 AM",
    updatedAt: "24 Sep 2026, 09:15 AM",
    orderId: "ORD-10284",
  },
  {
    id: "TKT-2047",
    subject: "Request for invoice copy",
    customer: "Priya Das",
    email: "priya@example.com",
    category: "Billing",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Amit Kumar",
    createdAt: "24 Sep 2026, 08:40 AM",
    updatedAt: "24 Sep 2026, 10:05 AM",
    orderId: "ORD-10281",
  },
  {
    id: "TKT-2046",
    subject: "Shipment tracking information not updating",
    customer: "Arjun Mehta",
    email: "arjun@example.com",
    category: "Shipment",
    priority: "High",
    status: "Pending Customer",
    assignedTo: "Neha Singh",
    createdAt: "23 Sep 2026, 04:20 PM",
    updatedAt: "24 Sep 2026, 09:30 AM",
    orderId: "ORD-10279",
  },
  {
    id: "TKT-2045",
    subject: "Unable to apply discount coupon",
    customer: "Sneha Patel",
    email: "sneha@example.com",
    category: "Payment",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Amit Kumar",
    createdAt: "23 Sep 2026, 02:10 PM",
    updatedAt: "24 Sep 2026, 08:45 AM",
    orderId: "ORD-10276",
  },
  {
    id: "TKT-2044",
    subject: "Account password reset request",
    customer: "Vikash Singh",
    email: "vikash@example.com",
    category: "Account",
    priority: "Low",
    status: "Closed",
    assignedTo: "Support Team",
    createdAt: "22 Sep 2026, 05:35 PM",
    updatedAt: "23 Sep 2026, 11:20 AM",
  },
  {
    id: "TKT-2043",
    subject: "Payment deducted but order not confirmed",
    customer: "Ananya Roy",
    email: "ananya@example.com",
    category: "Payment",
    priority: "Critical",
    status: "Open",
    assignedTo: "Finance Team",
    createdAt: "22 Sep 2026, 03:50 PM",
    updatedAt: "24 Sep 2026, 09:50 AM",
    orderId: "ORD-10270",
  },
  {
    id: "TKT-2042",
    subject: "Request to change delivery address",
    customer: "Rohit Verma",
    email: "rohit@example.com",
    category: "Order Issue",
    priority: "High",
    status: "In Progress",
    assignedTo: "Neha Singh",
    createdAt: "22 Sep 2026, 01:25 PM",
    updatedAt: "23 Sep 2026, 04:15 PM",
    orderId: "ORD-10268",
  },
  {
    id: "TKT-2041",
    subject: "Product specification clarification",
    customer: "Karan Joshi",
    email: "karan@example.com",
    category: "Product",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Support Team",
    createdAt: "21 Sep 2026, 11:10 AM",
    updatedAt: "22 Sep 2026, 03:40 PM",
  },
  {
    id: "TKT-2040",
    subject: "Request for return and replacement",
    customer: "Meera Nair",
    email: "meera@example.com",
    category: "Returns",
    priority: "High",
    status: "Pending Customer",
    assignedTo: "Amit Kumar",
    createdAt: "21 Sep 2026, 09:45 AM",
    updatedAt: "23 Sep 2026, 10:30 AM",
    orderId: "ORD-10263",
  },
  {
    id: "TKT-2039",
    subject: "Incorrect item delivered",
    customer: "Aditya Das",
    email: "aditya@example.com",
    category: "Order Issue",
    priority: "Critical",
    status: "Open",
    assignedTo: "Support Team",
    createdAt: "20 Sep 2026, 04:05 PM",
    updatedAt: "24 Sep 2026, 08:15 AM",
    orderId: "ORD-10259",
  },
  {
    id: "TKT-2038",
    subject: "Need clarification about warranty coverage",
    customer: "Pooja Sharma",
    email: "pooja@example.com",
    category: "Warranty",
    priority: "Medium",
    status: "Closed",
    assignedTo: "Neha Singh",
    createdAt: "20 Sep 2026, 01:30 PM",
    updatedAt: "22 Sep 2026, 05:10 PM",
  },
  {
    id: "TKT-2037",
    subject: "Unable to download product invoice",
    customer: "Saurav Mishra",
    email: "saurav@example.com",
    category: "Billing",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "Amit Kumar",
    createdAt: "19 Sep 2026, 10:20 AM",
    updatedAt: "21 Sep 2026, 02:45 PM",
    orderId: "ORD-10251",
  },
];

const statusOptions = [
  "All Status",
  "Open",
  "In Progress",
  "Pending Customer",
  "Resolved",
  "Closed",
];

const priorityOptions = [
  "All Priority",
  "Critical",
  "High",
  "Medium",
  "Low",
];

const categoryOptions = [
  "All Categories",
  "Order Issue",
  "Billing",
  "Shipment",
  "Payment",
  "Account",
  "Product",
  "Returns",
  "Warranty",
];

function AdminTickets() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [currentPage, setCurrentPage] = useState(1);

  const ticketsPerPage = 8;

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        [
          ticket.id,
          ticket.subject,
          ticket.customer,
          ticket.email,
          ticket.category,
          ticket.assignedTo,
          ticket.orderId || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All Status" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priority" ||
        ticket.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All Categories" ||
        ticket.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / ticketsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedTickets = filteredTickets.slice(
    (safeCurrentPage - 1) * ticketsPerPage,
    safeCurrentPage * ticketsPerPage
  );

  const openCount = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const pendingCount = tickets.filter(
    (ticket) => ticket.status === "Pending Customer"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  const criticalCount = tickets.filter(
    (ticket) => ticket.priority === "Critical"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setPriorityFilter("All Priority");
    setCategoryFilter("All Categories");
    setCurrentPage(1);
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (
    value: string
  ) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePriorityChange = (
    value: string
  ) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (
    value: string
  ) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const getStatusClass = (status: string) => {
    return status
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const getPriorityClass = (priority: string) => {
    return priority.toLowerCase();
  };

  return (
    <div className="nx-admin-tickets">

      {/* ================= HEADER ================= */}

      <div className="nx-tickets-header">
        <div>
          <span className="nx-page-eyebrow">
            SUPPORT MANAGEMENT
          </span>

          <h1>Support Tickets</h1>

          <p>
            Manage customer requests, issues and support
            conversations.
          </p>
        </div>

        <button
          type="button"
          className="nx-create-ticket-btn"
          onClick={() =>
            navigate("/admin/tickets/create")
          }
        >
          <span>+</span>
          Create Ticket
        </button>
      </div>

      {/* ================= KPI CARDS ================= */}

      <div className="nx-ticket-kpi-grid">

        <div className="nx-ticket-kpi">
          <div className="nx-ticket-kpi-top">
            <span>Open Tickets</span>

            <div className="nx-kpi-icon open">
              ⊙
            </div>
          </div>

          <strong>{openCount}</strong>

          <small>
            Requires attention
          </small>
        </div>

        <div className="nx-ticket-kpi">
          <div className="nx-ticket-kpi-top">
            <span>In Progress</span>

            <div className="nx-kpi-icon progress">
              ◷
            </div>
          </div>

          <strong>{inProgressCount}</strong>

          <small>
            Currently being handled
          </small>
        </div>

        <div className="nx-ticket-kpi">
          <div className="nx-ticket-kpi-top">
            <span>Pending Customer</span>

            <div className="nx-kpi-icon pending">
              …
            </div>
          </div>

          <strong>{pendingCount}</strong>

          <small>
            Waiting for response
          </small>
        </div>

        <div className="nx-ticket-kpi">
          <div className="nx-ticket-kpi-top">
            <span>Resolved</span>

            <div className="nx-kpi-icon resolved">
              ✓
            </div>
          </div>

          <strong>{resolvedCount}</strong>

          <small>
            Resolved or closed
          </small>
        </div>

        <div className="nx-ticket-kpi critical-kpi">
          <div className="nx-ticket-kpi-top">
            <span>Critical</span>

            <div className="nx-kpi-icon critical">
              !
            </div>
          </div>

          <strong>{criticalCount}</strong>

          <small>
            Priority escalation
          </small>
        </div>
      </div>

      {/* ================= TOOLBAR ================= */}

      <div className="nx-ticket-toolbar">

        <div className="nx-ticket-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearchChange(
                event.target.value
              )
            }
            placeholder="Search ticket ID, customer, subject..."
          />
        </div>

        <div className="nx-ticket-filters">

          <select
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(
                event.target.value
              )
            }
          >
            {statusOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) =>
              handlePriorityChange(
                event.target.value
              )
            }
          >
            {priorityOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              handleCategoryChange(
                event.target.value
              )
            }
          >
            {categoryOptions.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>

          {(search ||
            statusFilter !== "All Status" ||
            priorityFilter !== "All Priority" ||
            categoryFilter !== "All Categories") && (
            <button
              type="button"
              className="nx-reset-filter-btn"
              onClick={resetFilters}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <section className="nx-ticket-table-card">

        <div className="nx-ticket-table-header">
          <div>
            <h2>All Tickets</h2>

            <span>
              {filteredTickets.length} tickets found
            </span>
          </div>

          <div className="nx-ticket-table-meta">
            Showing{" "}
            {filteredTickets.length === 0
              ? 0
              : (safeCurrentPage - 1) *
                  ticketsPerPage +
                1}
            -
            {Math.min(
              safeCurrentPage * ticketsPerPage,
              filteredTickets.length
            )}{" "}
            of {filteredTickets.length}
          </div>
        </div>

        {paginatedTickets.length > 0 ? (
          <div className="nx-ticket-table-wrapper">

            <table className="nx-ticket-table">

              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id}>

                    <td>
                      <div className="nx-ticket-id-cell">
                        <strong>
                          {ticket.id}
                        </strong>

                        <span>
                          {ticket.subject}
                        </span>

                        {ticket.orderId && (
                          <small>
                            Order #{ticket.orderId}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="nx-ticket-customer-cell">
                        <div className="nx-ticket-avatar">
                          {ticket.customer.charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {ticket.customer}
                          </strong>

                          <span>
                            {ticket.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="nx-ticket-category">
                        {ticket.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`nx-ticket-priority ${getPriorityClass(
                          ticket.priority
                        )}`}
                      >
                        <i />
                        {ticket.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`nx-ticket-status ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td>
                      <span className="nx-ticket-assignee">
                        {ticket.assignedTo}
                      </span>
                    </td>

                    <td>
                      <div className="nx-ticket-date">
                        <span>
                          {ticket.updatedAt}
                        </span>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="nx-ticket-view-btn"
                        onClick={() =>
                          navigate(
                            `/admin/tickets/${ticket.id}`
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
          </div>
        ) : (
          <div className="nx-ticket-empty">
            <div className="nx-empty-icon">
              ⌕
            </div>

            <h3>No tickets found</h3>

            <p>
              Try changing your search or filter
              criteria.
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ================= PAGINATION ================= */}

        {filteredTickets.length > 0 && (
          <div className="nx-ticket-pagination">

            <span>
              Page {safeCurrentPage} of {totalPages}
            </span>

            <div className="nx-pagination-controls">

              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
              >
                ←
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter((page) => {
                  if (totalPages <= 5) {
                    return true;
                  }

                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(
                      page - safeCurrentPage
                    ) <= 1
                  );
                })
                .map((page, index, pages) => {
                  const previousPage =
                    pages[index - 1];

                  const showEllipsis =
                    previousPage &&
                    page - previousPage > 1;

                  return (
                    <span
                      key={page}
                      className="nx-pagination-group"
                    >
                      {showEllipsis && (
                        <em>...</em>
                      )}

                      <button
                        type="button"
                        className={
                          page === safeCurrentPage
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setCurrentPage(page)
                        }
                      >
                        {page}
                      </button>
                    </span>
                  );
                })}

              <button
                type="button"
                disabled={
                  safeCurrentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                  )
                }
              >
                →
              </button>

            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default AdminTickets;