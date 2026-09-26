import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TicketDetails.css";

type Message = {
  id: number;
  sender: string;
  role: "customer" | "agent";
  message: string;
  date: string;
  time: string;
};

type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status:
    | "Open"
    | "In Progress"
    | "Pending Customer"
    | "Resolved"
    | "Closed";
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  orderId: string;
  orderDate: string;
  assignedTo: string;
  description: string;
  messages: Message[];
};

const tickets: Record<string, Ticket> = {
  "TKT-2048": {
    id: "TKT-2048",
    subject: "Product received with damaged packaging",
    category: "Order Issue",
    priority: "High",
    status: "Open",
    createdAt: "24 Sep 2026, 09:15 AM",
    updatedAt: "24 Sep 2026, 09:15 AM",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
    },
    orderId: "ORD-10284",
    orderDate: "18 Sep 2026",
    assignedTo: "Support Team",
    description:
      "Customer reported that the outer packaging was damaged when the shipment was delivered. The product appears to be working, but the customer wants the packaging condition reviewed and confirmation that the product is eligible for replacement if any internal damage is identified.",
    messages: [
      {
        id: 1,
        sender: "Rahul Sharma",
        role: "customer",
        message:
          "The package arrived today and the outer box is damaged. I have attached the condition details and would like to confirm whether I can request a replacement if the product has any internal damage.",
        date: "24 Sep 2026",
        time: "09:15 AM",
      },
      {
        id: 2,
        sender: "Support Team",
        role: "agent",
        message:
          "Thank you for contacting us. We have received your request and are reviewing the shipment details. Please keep the original packaging until the inspection is completed.",
        date: "24 Sep 2026",
        time: "09:32 AM",
      },
    ],
  },
};

const defaultTicket = tickets["TKT-2048"];

const statusOptions = [
  "Open",
  "In Progress",
  "Pending Customer",
  "Resolved",
  "Closed",
];

const priorityOptions = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const assigneeOptions = [
  "Support Team",
  "Amit Kumar",
  "Neha Singh",
  "Finance Team",
];

function TicketDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const ticket = useMemo(() => {
    return (id && tickets[id]) || defaultTicket;
  }, [id]);

  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignedTo);
  const [reply, setReply] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [notice, setNotice] = useState("");

  const statusClass = status.toLowerCase().replaceAll(" ", "-");
  const priorityClass = priority.toLowerCase();

  const showNotice = (message: string) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const handleReply = () => {
    if (!reply.trim()) {
      return;
    }

    setReply("");
    showNotice("Reply added to the conversation.");
  };

  const handleInternalNote = () => {
    if (!internalNote.trim()) {
      return;
    }

    setInternalNote("");
    showNotice("Internal note added successfully.");
  };

  const handleSaveChanges = () => {
    showNotice("Ticket changes saved successfully.");
  };

  return (
    <div className="nx-ticket-details-page">

      {/* ================= HEADER ================= */}

      <div className="nx-ticket-details-header">
        <div>
          <button
            type="button"
            className="nx-ticket-back"
            onClick={() => navigate("/admin/tickets")}
          >
            ← Support Tickets
          </button>

          <div className="nx-ticket-heading">
            <div>
              <div className="nx-ticket-title-row">
                <h1>{ticket.id}</h1>

                <span
                  className={`nx-ticket-status-badge ${statusClass}`}
                >
                  {status}
                </span>

                <span
                  className={`nx-ticket-priority-badge ${priorityClass}`}
                >
                  {priority} Priority
                </span>
              </div>

              <p>{ticket.subject}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="nx-ticket-header-action"
          onClick={() =>
            navigate(`/admin/orders/${ticket.orderId}`)
          }
        >
          View Order
        </button>
      </div>

      {/* ================= NOTICE ================= */}

      {notice && (
        <div className="nx-ticket-notice">
          <span>✓</span>
          {notice}
        </div>
      )}

      {/* ================= SUMMARY ================= */}

      <section className="nx-ticket-summary-card">

        <div className="nx-ticket-summary-item">
          <span>Category</span>
          <strong>{ticket.category}</strong>
        </div>

        <div className="nx-ticket-summary-item">
          <span>Created</span>
          <strong>{ticket.createdAt}</strong>
        </div>

        <div className="nx-ticket-summary-item">
          <span>Last Updated</span>
          <strong>{ticket.updatedAt}</strong>
        </div>

        <div className="nx-ticket-summary-item">
          <span>Assigned To</span>
          <strong>{assignee}</strong>
        </div>

      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="nx-ticket-details-layout">

        {/* ================= LEFT ================= */}

        <main className="nx-ticket-details-main">

          {/* ISSUE DETAILS */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Issue Details</h2>
                <p>Customer request and issue description</p>
              </div>
            </div>

            <div className="nx-ticket-issue-content">
              <div className="nx-ticket-subject-box">
                <span>Subject</span>
                <strong>{ticket.subject}</strong>
              </div>

              <div className="nx-ticket-description">
                <span>Description</span>
                <p>{ticket.description}</p>
              </div>
            </div>
          </section>

          {/* CONVERSATION */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Conversation</h2>
                <p>Customer and support communication</p>
              </div>

              <span className="nx-message-count">
                {ticket.messages.length} messages
              </span>
            </div>

            <div className="nx-ticket-conversation">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`nx-message ${
                    message.role === "customer"
                      ? "customer"
                      : "agent"
                  }`}
                >
                  <div className="nx-message-avatar">
                    {message.sender.charAt(0)}
                  </div>

                  <div className="nx-message-body">
                    <div className="nx-message-meta">
                      <strong>{message.sender}</strong>

                      <span>
                        {message.role === "customer"
                          ? "Customer"
                          : "Support"}
                      </span>

                      <small>
                        {message.date} · {message.time}
                      </small>
                    </div>

                    <div className="nx-message-content">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* REPLY */}

            <div className="nx-ticket-composer">
              <div className="nx-composer-label">
                <span>Reply to Customer</span>
              </div>

              <textarea
                value={reply}
                onChange={(event) =>
                  setReply(event.target.value)
                }
                placeholder="Write a response to the customer..."
              />

              <div className="nx-composer-footer">
                <span>
                  Your reply will be visible to the customer.
                </span>

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={!reply.trim()}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </section>

          {/* INTERNAL NOTES */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Internal Notes</h2>
                <p>
                  Private notes visible only to support staff
                </p>
              </div>
            </div>

            <div className="nx-ticket-note-area">
              <textarea
                value={internalNote}
                onChange={(event) =>
                  setInternalNote(event.target.value)
                }
                placeholder="Add an internal note for the support team..."
              />

              <div className="nx-note-footer">
                <span>Internal note</span>

                <button
                  type="button"
                  onClick={handleInternalNote}
                  disabled={!internalNote.trim()}
                >
                  Add Note
                </button>
              </div>
            </div>
          </section>

        </main>

        {/* ================= RIGHT SIDEBAR ================= */}

        <aside className="nx-ticket-details-sidebar">

          {/* STATUS */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Ticket Management</h2>
                <p>Update ticket ownership and status</p>
              </div>
            </div>

            <div className="nx-ticket-management">

              <label htmlFor="ticket-status">
                Status
              </label>

              <select
                id="ticket-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as Ticket["status"]
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

              <label htmlFor="ticket-priority">
                Priority
              </label>

              <select
                id="ticket-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as Ticket["priority"]
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

              <label htmlFor="ticket-assignee">
                Assigned To
              </label>

              <select
                id="ticket-assignee"
                value={assignee}
                onChange={(event) =>
                  setAssignee(event.target.value)
                }
              >
                {assigneeOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="nx-save-ticket-btn"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </section>

          {/* CUSTOMER */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Customer</h2>
              </div>
            </div>

            <div className="nx-ticket-customer-card">

              <div className="nx-ticket-customer-avatar">
                {ticket.customer.name.charAt(0)}
              </div>

              <strong>{ticket.customer.name}</strong>

              <span>{ticket.customer.email}</span>

              <span>{ticket.customer.phone}</span>

              <button
                type="button"
                className="nx-contact-customer-btn"
              >
                Contact Customer
              </button>

            </div>
          </section>

          {/* ORDER */}

          <section className="nx-ticket-panel">
            <div className="nx-ticket-panel-header">
              <div>
                <h2>Related Order</h2>
              </div>
            </div>

            <div className="nx-ticket-order-card">

              <div>
                <span>Order ID</span>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/orders/${ticket.orderId}`
                    )
                  }
                >
                  {ticket.orderId}
                </button>
              </div>

              <div>
                <span>Order Date</span>
                <strong>{ticket.orderDate}</strong>
              </div>

              <button
                type="button"
                className="nx-open-order-btn"
                onClick={() =>
                  navigate(
                    `/admin/orders/${ticket.orderId}`
                  )
                }
              >
                Open Order →
              </button>

            </div>
          </section>

        </aside>
      </div>

      {/* ================= BOTTOM ACTIONS ================= */}

      <section className="nx-ticket-bottom-actions">

        <button
          type="button"
          className="secondary"
          onClick={() => navigate("/admin/tickets")}
        >
          Back to Tickets
        </button>

        <div>
          <button
            type="button"
            className="secondary"
            onClick={() => window.print()}
          >
            Print Ticket
          </button>

          <button
            type="button"
            className="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>

      </section>
    </div>
  );
}

export default TicketDetails;