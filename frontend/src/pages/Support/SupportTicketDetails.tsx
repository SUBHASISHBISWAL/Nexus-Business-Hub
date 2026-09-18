import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import "./SupportTicketDetails.css";

type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: "Normal" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Awaiting Response" | "Resolved";
  created: string;
  updated: string;
  order: string;
  product: string;
  description: string;
  attachment?: string;
};

type TicketMessage = {
  id: number;
  sender: "customer" | "support";
  name: string;
  time: string;
  message: string;
};

const STORAGE_KEY = "nexus_support_tickets";

const defaultTickets: SupportTicket[] = [
  {
    id: "TKT-1024",
    subject: "Gateway connectivity issue",
    category: "Technical Support",
    priority: "High",
    status: "In Progress",
    created: "18 Sep 2026",
    updated: "2h ago",
    order: "ORD-1001",
    product: "Smart IoT Gateway Pro",
    description:
      "Gateway is intermittently losing network connectivity.",
  },
  {
    id: "TKT-1021",
    subject: "Invoice clarification",
    category: "Orders & Payments",
    priority: "Medium",
    status: "Awaiting Response",
    created: "18 Sep 2026",
    updated: "5h ago",
    order: "ORD-1002",
    product: "EdgeCompute R500",
    description:
      "Need clarification regarding the invoice amount and payment details.",
  },
  {
    id: "TKT-1018",
    subject: "Product replacement request",
    category: "Returns & Warranty",
    priority: "High",
    status: "Resolved",
    created: "17 Sep 2026",
    updated: "1d ago",
    order: "ORD-1003",
    product: "NexusOS Fleet Control",
    description:
      "Requesting replacement for the received product.",
  },
  {
    id: "TKT-1015",
    subject: "Shipment delivery update",
    category: "Shipping & Delivery",
    priority: "Normal",
    status: "Open",
    created: "16 Sep 2026",
    updated: "2d ago",
    order: "ORD-1001",
    product: "Smart IoT Gateway Pro",
    description:
      "Requesting an update regarding the shipment delivery status.",
  },
  {
    id: "TKT-1012",
    subject: "Product configuration assistance",
    category: "Technical Support",
    priority: "Normal",
    status: "Resolved",
    created: "15 Sep 2026",
    updated: "3d ago",
    order: "ORD-1002",
    product: "EdgeCompute R500",
    description:
      "Need assistance with the initial product configuration.",
  },
];

function SupportTicketDetails() {
  const { id } = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const loadTicket = () => {
      try {
        const storedTickets = localStorage.getItem(STORAGE_KEY);

        let stored: SupportTicket[] = [];

        if (storedTickets) {
          const parsed = JSON.parse(storedTickets);

          if (Array.isArray(parsed)) {
            stored = parsed;
          }
        }

        const allTickets = [...stored, ...defaultTickets].filter(
          (item, index, array) =>
            index === array.findIndex((ticketItem) => ticketItem.id === item.id)
        );

        const foundTicket = allTickets.find(
          (ticketItem) => ticketItem.id === id
        );

        setTicket(foundTicket || null);

        if (foundTicket) {
          const savedMessages = localStorage.getItem(
            `nexus_ticket_messages_${foundTicket.id}`
          );

          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages);

            if (Array.isArray(parsedMessages)) {
              setMessages(parsedMessages);
              return;
            }
          }

          setMessages([
            {
              id: 1,
              sender: "customer",
              name: "You",
              time: foundTicket.created,
              message: foundTicket.description,
            },
            {
              id: 2,
              sender: "support",
              name: "Nexus Support",
              time: "18 Sep 2026 · 11:24",
              message:
                "Thank you for contacting Nexus Support. We have received your request and our team is reviewing the issue.",
            },
          ]);
        }
      } catch (error) {
        console.error("Unable to load support ticket:", error);
        setTicket(null);
      }
    };

    loadTicket();
  }, [id]);

  const statusClass = useMemo(() => {
    if (!ticket) {
      return "";
    }

    return ticket.status.toLowerCase().replace(/\s+/g, "-");
  }, [ticket]);

  const priorityClass = useMemo(() => {
    if (!ticket) {
      return "";
    }

    return ticket.priority.toLowerCase();
  }, [ticket]);

  const handleSendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedReply = reply.trim();

    if (!trimmedReply || !ticket) {
      return;
    }

    setIsSending(true);

    const newMessage: TicketMessage = {
      id: Date.now(),
      sender: "customer",
      name: "You",
      time: "Just now",
      message: trimmedReply,
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setReply("");

    localStorage.setItem(
      `nexus_ticket_messages_${ticket.id}`,
      JSON.stringify(updatedMessages)
    );

    window.setTimeout(() => {
      setIsSending(false);
    }, 400);
  };

  if (!ticket) {
    return (
      <div className="nx-ticket-details-page">
        <div className="container">
          <div className="nx-ticket-not-found">
            <div className="nx-ticket-not-found-icon">
              <i className="bi bi-ticket-detailed"></i>
            </div>

            <h1>Ticket Not Found</h1>

            <p>
              We could not find the support request you are looking for.
              It may have been removed or the ticket ID may be incorrect.
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

  return (
    <div className="nx-ticket-details-page">
      <div className="container">
        {/* BREADCRUMB */}
        <div className="nx-ticket-breadcrumb">
          <Link to="/">Home</Link>
          <i className="bi bi-chevron-right"></i>

          <Link to="/support">Support</Link>
          <i className="bi bi-chevron-right"></i>

          <Link to="/support/tickets">My Requests</Link>
          <i className="bi bi-chevron-right"></i>

          <span>{ticket.id}</span>
        </div>

        {/* HEADER */}
        <section className="nx-ticket-details-header">
          <div className="nx-ticket-header-main">
            <span className="nx-ticket-header-label">
              SUPPORT REQUEST
            </span>

            <div className="nx-ticket-title-row">
              <div>
                <div className="nx-ticket-id">{ticket.id}</div>

                <h1>{ticket.subject}</h1>
              </div>

              <div className="nx-ticket-header-actions">
                <Link
                  to="/support/tickets"
                  className="nx-ticket-outline-btn"
                >
                  <i className="bi bi-arrow-left"></i>
                  Back to Requests
                </Link>
              </div>
            </div>

            <div className="nx-ticket-meta-row">
              <span
                className={`nx-ticket-status-badge ${statusClass}`}
              >
                <span></span>
                {ticket.status}
              </span>

              <span
                className={`nx-ticket-priority-badge ${priorityClass}`}
              >
                <i className="bi bi-flag-fill"></i>
                {ticket.priority} Priority
              </span>

              <span className="nx-ticket-meta-item">
                <i className="bi bi-folder2"></i>
                {ticket.category}
              </span>

              <span className="nx-ticket-meta-item">
                <i className="bi bi-calendar3"></i>
                Created {ticket.created}
              </span>

              {ticket.order && ticket.order !== "Not specified" && (
                <span className="nx-ticket-meta-item">
                  <i className="bi bi-box-seam"></i>
                  {ticket.order}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="nx-ticket-details-content">
          <div className="nx-ticket-details-grid">
            {/* LEFT */}
            <div className="nx-ticket-conversation-card">
              <div className="nx-conversation-header">
                <div>
                  <span className="nx-conversation-label">
                    SUPPORT ACTIVITY
                  </span>

                  <h2>Conversation</h2>
                </div>

                <span className="nx-conversation-count">
                  {messages.length}{" "}
                  {messages.length === 1 ? "Message" : "Messages"}
                </span>
              </div>

              <div className="nx-conversation-body">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`nx-ticket-message ${message.sender}`}
                  >
                    <div className="nx-message-avatar">
                      <i
                        className={
                          message.sender === "support"
                            ? "bi bi-headset"
                            : "bi bi-person"
                        }
                      ></i>
                    </div>

                    <div className="nx-message-content">
                      <div className="nx-message-header">
                        <strong>{message.name}</strong>
                        <span>{message.time}</span>
                      </div>

                      <div className="nx-message-bubble">
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {ticket.status !== "Resolved" ? (
                <div className="nx-ticket-reply-section">
                  <div className="nx-reply-header">
                    <div>
                      <span className="nx-reply-label">
                        ADD MESSAGE
                      </span>

                      <h3>Reply to Support</h3>
                    </div>

                    <i className="bi bi-chat-left-text"></i>
                  </div>

                  <form
                    className="nx-ticket-reply-form"
                    onSubmit={handleSendReply}
                  >
                    <textarea
                      value={reply}
                      onChange={(event) =>
                        setReply(event.target.value)
                      }
                      placeholder="Write a message to the Nexus Support team..."
                      rows={5}
                    />

                    <div className="nx-reply-footer">
                      <span>
                        <i className="bi bi-shield-check"></i>
                        Do not share passwords or sensitive credentials.
                      </span>

                      <button
                        type="submit"
                        className="nx-send-reply-btn"
                        disabled={!reply.trim() || isSending}
                      >
                        {isSending ? (
                          <>
                            <span className="spinner-border spinner-border-sm"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Reply
                            <i className="bi bi-send"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="nx-ticket-resolved-notice">
                  <div className="nx-resolved-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>

                  <div>
                    <strong>This request has been resolved</strong>

                    <p>
                      This ticket is closed. Create a new support
                      request if you need further assistance.
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

            {/* RIGHT SIDEBAR */}
            <aside className="nx-ticket-sidebar">
              {/* INFORMATION */}
              <div className="nx-ticket-info-card">
                <div className="nx-ticket-info-header">
                  <div className="nx-ticket-info-icon">
                    <i className="bi bi-info-lg"></i>
                  </div>

                  <div>
                    <span>TICKET DETAILS</span>
                    <h2>Request Information</h2>
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
                      className={`nx-info-priority ${priorityClass}`}
                    >
                      {ticket.priority}
                    </strong>
                  </div>

                  <div className="nx-ticket-info-row">
                    <span>Status</span>
                    <strong
                      className={`nx-info-status ${statusClass}`}
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

                  <div className="nx-ticket-info-row">
                    <span>Order</span>
                    <strong>{ticket.order}</strong>
                  </div>

                  <div className="nx-ticket-info-row">
                    <span>Product</span>
                    <strong>{ticket.product}</strong>
                  </div>

                  {ticket.attachment && (
                    <div className="nx-ticket-info-row">
                      <span>Attachment</span>
                      <strong>{ticket.attachment}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* TIMELINE */}
              <div className="nx-ticket-timeline-card">
                <div className="nx-timeline-header">
                  <span>REQUEST HISTORY</span>
                  <h2>Ticket Timeline</h2>
                </div>

                <div className="nx-ticket-timeline">
                  <div className="nx-timeline-item completed">
                    <div className="nx-timeline-marker">
                      <i className="bi bi-check2"></i>
                    </div>

                    <div>
                      <strong>Request Created</strong>
                      <span>{ticket.created}</span>
                    </div>
                  </div>

                  <div className="nx-timeline-line"></div>

                  <div
                    className={`nx-timeline-item ${
                      ticket.status !== "Open" ? "completed" : "active"
                    }`}
                  >
                    <div className="nx-timeline-marker">
                      {ticket.status !== "Open" ? (
                        <i className="bi bi-check2"></i>
                      ) : (
                        <span></span>
                      )}
                    </div>

                    <div>
                      <strong>Support Review</strong>
                      <span>
                        {ticket.status === "Open"
                          ? "Currently waiting for review"
                          : "Support team has reviewed the request"}
                      </span>
                    </div>
                  </div>

                  <div className="nx-timeline-line"></div>

                  <div
                    className={`nx-timeline-item ${
                      ticket.status === "Resolved"
                        ? "completed"
                        : "active"
                    }`}
                  >
                    <div className="nx-timeline-marker">
                      {ticket.status === "Resolved" ? (
                        <i className="bi bi-check2"></i>
                      ) : (
                        <span></span>
                      )}
                    </div>

                    <div>
                      <strong>
                        {ticket.status === "Resolved"
                          ? "Resolved"
                          : "Resolution"}
                      </strong>

                      <span>
                        {ticket.status === "Resolved"
                          ? "Request has been resolved"
                          : "Pending final resolution"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HELP */}
              <div className="nx-ticket-help-card">
                <div className="nx-ticket-help-icon">
                  <i className="bi bi-headset"></i>
                </div>

                <div>
                  <span>NEED MORE HELP?</span>

                  <h3>Our support team is here to help.</h3>

                  <p>
                    If you need additional assistance, create a new
                    support request and our team will get back to you.
                  </p>

                  <Link
                    to="/support/create-ticket"
                    className="nx-ticket-help-link"
                  >
                    Create Support Ticket
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* BOTTOM NAVIGATION */}
        <div className="nx-ticket-bottom-navigation">
          <Link
            to="/support/tickets"
            className="nx-ticket-bottom-back"
          >
            <i className="bi bi-arrow-left"></i>
            Back to My Requests
          </Link>

          <Link
            to="/support/create-ticket"
            className="nx-ticket-bottom-create"
          >
            <i className="bi bi-plus-lg"></i>
            Create New Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SupportTicketDetails;