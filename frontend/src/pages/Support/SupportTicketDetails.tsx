
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import "./SupportTicketDetails.css";

type TicketMessage = {
  id: number;
  sender: "Customer" | "Support Team";
  message: string;
  date: string;
  time: string;
};

type TicketDetails = {
  id: string;
  subject: string;
  category: string;
  priority: "Normal" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Awaiting Response" | "Resolved";
  created: string;
  updated: string;
  messages: TicketMessage[];
};

const tickets: TicketDetails[] = [
  {
    id: "TKT-1024",
    subject: "Gateway connectivity issue",
    category: "Technical Support",
    priority: "High",
    status: "In Progress",
    created: "18 Sep 2026",
    updated: "2h ago",
    messages: [
      {
        id: 1,
        sender: "Customer",
        message:
          "The Smart IoT Gateway Pro is not connecting to our network. The device powers on normally, but the gateway is not establishing a network connection.",
        date: "18 Sep 2026",
        time: "10:24 AM",
      },
      {
        id: 2,
        sender: "Support Team",
        message:
          "Thank you for contacting Nexus Support. Our technical team is currently checking the connectivity issue. Please keep the gateway powered on while we review the configuration.",
        date: "18 Sep 2026",
        time: "11:42 AM",
      },
    ],
  },
  {
    id: "TKT-1021",
    subject: "Invoice clarification",
    category: "Orders & Payments",
    priority: "Medium",
    status: "Awaiting Response",
    created: "18 Sep 2026",
    updated: "5h ago",
    messages: [
      {
        id: 1,
        sender: "Customer",
        message:
          "I need clarification regarding the invoice amount for my recent order.",
        date: "18 Sep 2026",
        time: "09:15 AM",
      },
      {
        id: 2,
        sender: "Support Team",
        message:
          "We have received your request. Our billing team is reviewing the invoice details and will respond shortly.",
        date: "18 Sep 2026",
        time: "10:05 AM",
      },
    ],
  },
  {
    id: "TKT-1018",
    subject: "Product replacement request",
    category: "Returns & Warranty",
    priority: "High",
    status: "Resolved",
    created: "17 Sep 2026",
    updated: "1d ago",
    messages: [
      {
        id: 1,
        sender: "Customer",
        message:
          "I would like to request a replacement for the product received in my recent order.",
        date: "17 Sep 2026",
        time: "11:20 AM",
      },
      {
        id: 2,
        sender: "Support Team",
        message:
          "Your replacement request has been approved. The replacement shipment has been initiated.",
        date: "17 Sep 2026",
        time: "02:45 PM",
      },
      {
        id: 3,
        sender: "Customer",
        message:
          "Thank you. I have received the replacement shipment details.",
        date: "17 Sep 2026",
        time: "04:10 PM",
      },
    ],
  },
  {
    id: "TKT-1015",
    subject: "Shipment delivery update",
    category: "Shipping & Delivery",
    priority: "Normal",
    status: "Open",
    created: "16 Sep 2026",
    updated: "2d ago",
    messages: [
      {
        id: 1,
        sender: "Customer",
        message:
          "Could you please provide an update on the expected delivery date of my shipment?",
        date: "16 Sep 2026",
        time: "01:30 PM",
      },
    ],
  },
  {
    id: "TKT-1012",
    subject: "Product configuration assistance",
    category: "Technical Support",
    priority: "Normal",
    status: "Resolved",
    created: "15 Sep 2026",
    updated: "3d ago",
    messages: [
      {
        id: 1,
        sender: "Customer",
        message:
          "I need assistance with configuring the product for our deployment environment.",
        date: "15 Sep 2026",
        time: "09:45 AM",
      },
      {
        id: 2,
        sender: "Support Team",
        message:
          "Our technical team has shared the required configuration steps. Please let us know if you need any additional assistance.",
        date: "15 Sep 2026",
        time: "12:15 PM",
      },
    ],
  },
];

function SupportTicketDetails() {
  const { id } = useParams();

  const ticket = tickets.find(
    (item) => item.id.toLowerCase() === id?.toLowerCase()
  );

  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<TicketMessage[]>(
    ticket?.messages || []
  );

  if (!ticket) {
    return (
      <div className="nx-ticket-details-page">
        <div className="container">
          <div className="nx-ticket-not-found">
            <div className="nx-ticket-not-found-icon">
              <i className="bi bi-ticket-perforated"></i>
            </div>

            <h1>Support Ticket Not Found</h1>

            <p>
              The support request you are looking for does not
              exist or may no longer be available.
            </p>

            <Link
              to="/support/tickets"
              className="nx-ticket-back-btn"
            >
              <i className="bi bi-arrow-left"></i>
              Back to My Requests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply) {
      return;
    }

    const newMessage: TicketMessage = {
      id: Date.now(),
      sender: "Customer",
      message: trimmedReply,
      date: "18 Sep 2026",
      time: "Just now",
    };

    setMessages((previous) => [
      ...previous,
      newMessage,
    ]);

    setReply("");
  };

  return (
    <div className="nx-ticket-details-page">
      {/* BREADCRUMB */}
      <div className="container nx-ticket-breadcrumb">
        <Link to="/">Home</Link>

        <i className="bi bi-chevron-right"></i>

        <Link to="/support">Support</Link>

        <i className="bi bi-chevron-right"></i>

        <Link to="/support/tickets">
          My Support Requests
        </Link>

        <i className="bi bi-chevron-right"></i>

        <span>{ticket.id}</span>
      </div>

      {/* HEADER */}
      <section className="container nx-ticket-details-header">
        <div className="nx-ticket-header-main">
          <div className="nx-ticket-header-label">
            SUPPORT REQUEST
          </div>

          <div className="nx-ticket-title-row">
            <div>
              <div className="nx-ticket-id">
                {ticket.id}
              </div>

              <h1>{ticket.subject}</h1>
            </div>

            <div className="nx-ticket-header-actions">
              <Link
                to="/support/tickets"
                className="nx-ticket-outline-btn"
              >
                <i className="bi bi-arrow-left"></i>
                My Requests
              </Link>
            </div>
          </div>

          <div className="nx-ticket-meta-row">
            <span
              className={`nx-ticket-status-badge ${ticket.status
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <span></span>
              {ticket.status}
            </span>

            <span
              className={`nx-ticket-priority-badge ${ticket.priority.toLowerCase()}`}
            >
              <i className="bi bi-flag"></i>
              {ticket.priority} Priority
            </span>

            <span className="nx-ticket-meta-item">
              <i className="bi bi-folder2-open"></i>
              {ticket.category}
            </span>

            <span className="nx-ticket-meta-item">
              <i className="bi bi-calendar3"></i>
              Created {ticket.created}
            </span>

            <span className="nx-ticket-meta-item">
              <i className="bi bi-clock"></i>
              Updated {ticket.updated}
            </span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container nx-ticket-details-content">
        <div className="nx-ticket-details-grid">
          {/* LEFT - CONVERSATION */}
          <div className="nx-ticket-conversation-card">
            <div className="nx-conversation-header">
              <div>
                <span className="nx-conversation-label">
                  SUPPORT CONVERSATION
                </span>

                <h2>Request activity</h2>
              </div>

              <div className="nx-conversation-count">
                {messages.length}{" "}
                {messages.length === 1
                  ? "Message"
                  : "Messages"}
              </div>
            </div>

            <div className="nx-conversation-body">
              {messages.map((message) => (
                <div
                  className={`nx-ticket-message ${
                    message.sender === "Customer"
                      ? "customer"
                      : "support"
                  }`}
                  key={message.id}
                >
                  <div className="nx-message-avatar">
                    {message.sender === "Customer" ? (
                      <i className="bi bi-person"></i>
                    ) : (
                      <i className="bi bi-headset"></i>
                    )}
                  </div>

                  <div className="nx-message-content">
                    <div className="nx-message-header">
                      <strong>
                        {message.sender}
                      </strong>

                      <span>
                        {message.date} · {message.time}
                      </span>
                    </div>

                    <div className="nx-message-bubble">
                      {message.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* REPLY */}
            {ticket.status !== "Resolved" && (
              <div className="nx-ticket-reply-section">
                <div className="nx-reply-header">
                  <div>
                    <span className="nx-reply-label">
                      REPLY TO SUPPORT
                    </span>

                    <h3>
                      Have more information to share?
                    </h3>
                  </div>

                  <i className="bi bi-chat-left-text"></i>
                </div>

                <form
                  className="nx-ticket-reply-form"
                  onSubmit={handleReply}
                >
                  <textarea
                    value={reply}
                    onChange={(event) =>
                      setReply(event.target.value)
                    }
                    placeholder="Type your reply or add additional information..."
                    rows={5}
                    aria-label="Reply to support"
                  />

                  <div className="nx-reply-footer">
                    <span>
                      <i className="bi bi-info-circle"></i>
                      Our support team will be notified of
                      your reply.
                    </span>

                    <button
                      type="submit"
                      className="nx-send-reply-btn"
                      disabled={!reply.trim()}
                    >
                      <i className="bi bi-send"></i>
                      Send Reply
                    </button>
                  </div>
                </form>
              </div>
            )}

            {ticket.status === "Resolved" && (
              <div className="nx-ticket-resolved-notice">
                <div className="nx-resolved-icon">
                  <i className="bi bi-check-lg"></i>
                </div>

                <div>
                  <strong>
                    This support request has been resolved.
                  </strong>

                  <p>
                    If you need further assistance, you can
                    create a new support request.
                  </p>
                </div>

                <Link
                  to="/support/create-ticket"
                  className="nx-create-new-ticket-btn"
                >
                  Create New Ticket
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT - TICKET INFORMATION */}
          <aside className="nx-ticket-sidebar">
            {/* TICKET INFORMATION */}
            <div className="nx-ticket-info-card">
              <div className="nx-ticket-info-header">
                <div className="nx-ticket-info-icon">
                  <i className="bi bi-ticket-detailed"></i>
                </div>

                <div>
                  <span>REQUEST DETAILS</span>
                  <h2>Ticket Information</h2>
                </div>
              </div>

              <div className="nx-ticket-info-list">
                <div className="nx-ticket-info-row">
                  <span>Ticket ID</span>
                  <strong>{ticket.id}</strong>
                </div>

                <div className="nx-ticket-info-row">
                  <span>Category</span>
                  <strong>{ticket.category}</strong>
                </div>

                <div className="nx-ticket-info-row">
                  <span>Priority</span>
                  <strong
                    className={`nx-info-priority ${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </strong>
                </div>

                <div className="nx-ticket-info-row">
                  <span>Status</span>
                  <strong
                    className={`nx-info-status ${ticket.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {ticket.status}
                  </strong>
                </div>

                <div className="nx-ticket-info-row">
                  <span>Created</span>
                  <strong>{ticket.created}</strong>
                </div>

                <div className="nx-ticket-info-row">
                  <span>Last Updated</span>
                  <strong>{ticket.updated}</strong>
                </div>
              </div>
            </div>

            {/* REQUEST TIMELINE */}
            <div className="nx-ticket-timeline-card">
              <div className="nx-timeline-header">
                <span>REQUEST PROGRESS</span>
                <h2>Ticket Timeline</h2>
              </div>

              <div className="nx-ticket-timeline">
                <div className="nx-timeline-item completed">
                  <div className="nx-timeline-marker">
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <div>
                    <strong>Request Created</strong>
                    <span>{ticket.created}</span>
                  </div>
                </div>

                <div className="nx-timeline-line"></div>

                <div
                  className={`nx-timeline-item ${
                    ticket.status === "Open"
                      ? "active"
                      : "completed"
                  }`}
                >
                  <div className="nx-timeline-marker">
                    {ticket.status === "Open" ? (
                      <span></span>
                    ) : (
                      <i className="bi bi-check-lg"></i>
                    )}
                  </div>

                  <div>
                    <strong>Support Team Assigned</strong>
                    <span>
                      {ticket.status === "Open"
                        ? "Pending assignment"
                        : "Support team assigned"}
                    </span>
                  </div>
                </div>

                <div className="nx-timeline-line"></div>

                <div
                  className={`nx-timeline-item ${
                    ticket.status === "In Progress" ||
                    ticket.status === "Awaiting Response"
                      ? "active"
                      : ticket.status === "Resolved"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="nx-timeline-marker">
                    {ticket.status === "Resolved" ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <span></span>
                    )}
                  </div>

                  <div>
                    <strong>Investigation</strong>
                    <span>
                      {ticket.status === "Resolved"
                        ? "Investigation completed"
                        : ticket.status === "Open"
                        ? "Waiting to start"
                        : "Support team is reviewing"}
                    </span>
                  </div>
                </div>

                <div className="nx-timeline-line"></div>

                <div
                  className={`nx-timeline-item ${
                    ticket.status === "Resolved"
                      ? "completed"
                      : ""
                  }`}
                >
                  <div className="nx-timeline-marker">
                    {ticket.status === "Resolved" ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <span></span>
                    )}
                  </div>

                  <div>
                    <strong>Resolution</strong>
                    <span>
                      {ticket.status === "Resolved"
                        ? "Request resolved"
                        : "Pending resolution"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT HELP */}
            <div className="nx-ticket-help-card">
              <div className="nx-ticket-help-icon">
                <i className="bi bi-headset"></i>
              </div>

              <div>
                <span>NEED MORE HELP?</span>

                <h3>
                  Our support team is here for you.
                </h3>

                <p>
                  If you have additional information about
                  this issue, reply to the request or create
                  a new ticket.
                </p>
              </div>

              <Link
                to="/support"
                className="nx-ticket-help-link"
              >
                Support Center
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM NAVIGATION */}
      <section className="container nx-ticket-bottom-navigation">
        <Link
          to="/support/tickets"
          className="nx-ticket-bottom-back"
        >
          <i className="bi bi-arrow-left"></i>
          Back to My Support Requests
        </Link>

        <Link
          to="/support/create-ticket"
          className="nx-ticket-bottom-create"
        >
          <i className="bi bi-plus-lg"></i>
          Create New Ticket
        </Link>
      </section>
    </div>
  );
}

export default SupportTicketDetails;

