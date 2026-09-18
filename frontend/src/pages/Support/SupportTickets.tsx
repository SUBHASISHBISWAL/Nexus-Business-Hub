import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./SupportTickets.css";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: "Normal" | "Medium" | "High" | "Urgent";
  status:
    | "In Progress"
    | "Awaiting Response"
    | "Resolved"
    | "Open";
  updated: string;
  created: string;
  order?: string;
  product?: string;
  description?: string;
  attachment?: string;
};

const STORAGE_KEY = "nexus_support_tickets";

const defaultTickets: Ticket[] = [
  {
    id: "TKT-1024",
    subject: "Gateway connectivity issue",
    category: "Technical Support",
    priority: "High",
    status: "In Progress",
    updated: "2h ago",
    created: "18 Sep 2026",
  },
  {
    id: "TKT-1021",
    subject: "Invoice clarification",
    category: "Orders & Payments",
    priority: "Medium",
    status: "Awaiting Response",
    updated: "5h ago",
    created: "18 Sep 2026",
  },
  {
    id: "TKT-1018",
    subject: "Product replacement request",
    category: "Returns & Warranty",
    priority: "High",
    status: "Resolved",
    updated: "1d ago",
    created: "17 Sep 2026",
  },
  {
    id: "TKT-1015",
    subject: "Shipment delivery update",
    category: "Shipping & Delivery",
    priority: "Normal",
    status: "Open",
    updated: "2d ago",
    created: "16 Sep 2026",
  },
  {
    id: "TKT-1012",
    subject: "Product configuration assistance",
    category: "Technical Support",
    priority: "Normal",
    status: "Resolved",
    updated: "3d ago",
    created: "15 Sep 2026",
  },
];

function SupportTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [tickets, setTickets] =
    useState<Ticket[]>(defaultTickets);

  /*
   * Load tickets from localStorage.
   *
   * CreateTicket.tsx saves newly created tickets using
   * the same STORAGE_KEY.
   */
  useEffect(() => {
    const loadTickets = () => {
      try {
        const storedTickets =
          localStorage.getItem(STORAGE_KEY);

        if (!storedTickets) {
          setTickets(defaultTickets);
          return;
        }

        const parsedTickets: Ticket[] =
          JSON.parse(storedTickets);

        if (Array.isArray(parsedTickets)) {
          setTickets(parsedTickets);
        } else {
          setTickets(defaultTickets);
        }
      } catch (error) {
        console.error(
          "Unable to load support tickets:",
          error
        );

        setTickets(defaultTickets);
      }
    };

    loadTickets();

    /*
     * Listen for storage changes.
     * This also keeps the list synced if localStorage
     * changes from another browser tab.
     */
    window.addEventListener("storage", loadTickets);

    return () => {
      window.removeEventListener(
        "storage",
        loadTickets
      );
    };
  }, []);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        !query ||
        [
          ticket.id,
          ticket.subject,
          ticket.category,
          ticket.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tickets,
    search,
    statusFilter,
    priorityFilter,
  ]);

  return (
    <div className="nx-support-tickets-page">

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="container nx-tickets-breadcrumb">
        <Link to="/support">Support</Link>

        <span>/</span>

        <span>My Support Requests</span>
      </div>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="container nx-tickets-header">

        <div>
          <span className="nx-support-label">
            SUPPORT CENTER
          </span>

          <h1>
            My Support
            <br />
            <strong>Requests.</strong>
          </h1>

          <p>
            Track your support requests, view updates and
            continue conversations with our support team.
          </p>
        </div>

        <Link
          to="/support/create-ticket"
          className="nx-tickets-create-btn"
        >
          <i className="bi bi-plus-lg"></i>
          Create Support Ticket
        </Link>

      </section>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <section className="container nx-ticket-summary">

        <div className="nx-ticket-summary-card">
          <div className="nx-ticket-summary-icon blue">
            <i className="bi bi-ticket-perforated"></i>
          </div>

          <div>
            <span>Total Requests</span>

            <strong>
              {tickets.length}
            </strong>
          </div>
        </div>

        <div className="nx-ticket-summary-card">
          <div className="nx-ticket-summary-icon orange">
            <i className="bi bi-hourglass-split"></i>
          </div>

          <div>
            <span>Open Requests</span>

            <strong>
              {
                tickets.filter(
                  (ticket) =>
                    ticket.status !== "Resolved"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="nx-ticket-summary-card">
          <div className="nx-ticket-summary-icon green">
            <i className="bi bi-check-circle"></i>
          </div>

          <div>
            <span>Resolved</span>

            <strong>
              {
                tickets.filter(
                  (ticket) =>
                    ticket.status === "Resolved"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="nx-ticket-summary-card">
          <div className="nx-ticket-summary-icon purple">
            <i className="bi bi-headset"></i>
          </div>

          <div>
            <span>Support Status</span>

            <strong>Online</strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          TICKETS SECTION
      ===================================================== */}

      <section className="container nx-tickets-content">

        <div className="nx-tickets-toolbar">

          <div className="nx-tickets-toolbar-title">
            <h2>Support Requests</h2>

            <span>
              {filteredTickets.length} request
              {filteredTickets.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="nx-tickets-filters">

            {/* SEARCH */}

            <div className="nx-tickets-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tickets..."
                aria-label="Search support tickets"
              />
            </div>

            {/* STATUS */}

            <div className="nx-ticket-filter-select">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Awaiting Response">
                  Awaiting Response
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

              <i className="bi bi-chevron-down"></i>
            </div>

            {/* PRIORITY */}

            <div className="nx-ticket-filter-select">
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
              >
                <option value="All">
                  All Priority
                </option>

                <option value="Normal">
                  Normal
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

                <option value="Urgent">
                  Urgent
                </option>
              </select>

              <i className="bi bi-chevron-down"></i>
            </div>

          </div>

        </div>

        {/* ===================================================
            TICKET LIST
        =================================================== */}

        <div className="nx-tickets-list">

          {filteredTickets.map((ticket) => (

            <Link
              key={ticket.id}
              to={`/support/tickets/${ticket.id}`}
              className="nx-ticket-list-item"
            >

              {/* Ticket ID */}

              <div className="nx-ticket-list-id">
                <span>Ticket ID</span>

                <strong>
                  {ticket.id}
                </strong>
              </div>

              {/* Subject */}

              <div className="nx-ticket-list-subject">

                <strong>
                  {ticket.subject}
                </strong>

                <span>
                  {ticket.category}
                </span>

              </div>

              {/* Priority */}

              <div className="nx-ticket-list-priority">

                <span>Priority</span>

                <strong
                  className={`priority-${ticket.priority.toLowerCase()}`}
                >
                  <i></i>
                  {ticket.priority}
                </strong>

              </div>

              {/* Status */}

              <div className="nx-ticket-list-status">

                <span>Status</span>

                <strong
                  className={`status-${ticket.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <i></i>
                  {ticket.status}
                </strong>

              </div>

              {/* Updated */}

              <div className="nx-ticket-list-updated">

                <span>Last Updated</span>

                <strong>
                  {ticket.updated}
                </strong>

              </div>

              {/* Arrow */}

              <div className="nx-ticket-list-arrow">
                <i className="bi bi-chevron-right"></i>
              </div>

            </Link>

          ))}

        </div>

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {filteredTickets.length === 0 && (

          <div className="nx-tickets-empty">

            <div className="nx-tickets-empty-icon">
              <i className="bi bi-search"></i>
            </div>

            <h3>
              No support requests found
            </h3>

            <p>
              Try changing your search or filter
              criteria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPriorityFilter("All");
              }}
            >
              Reset Filters
            </button>

          </div>

        )}

        {/* ===================================================
            BOTTOM CTA
        =================================================== */}

        <div className="nx-tickets-bottom">

          <div>
            <i className="bi bi-question-circle"></i>

            <div>
              <strong>
                Can't find what you're looking for?
              </strong>

              <span>
                Create a new support request and our
                team will assist you.
              </span>
            </div>
          </div>

          <Link
            to="/support/create-ticket"
            className="nx-tickets-bottom-btn"
          >
            Create New Ticket

            <i className="bi bi-arrow-right"></i>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default SupportTickets;