import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CreateTicket.css";

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

const STORAGE_KEY = "nexus_support_tickets";

function CreateTicket() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [order, setOrder] = useState("");
  const [product, setProduct] = useState("");

  const [priority, setPriority] = useState<
    "Normal" | "Medium" | "High" | "Urgent"
  >("Normal");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAttachmentChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setAttachment(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Attachment size must be less than 10MB.");
      event.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSubject = subject.trim();
    const trimmedDescription = description.trim();

    if (!category) {
      alert("Please select an issue category.");
      return;
    }

    if (!trimmedSubject) {
      alert("Please enter a subject.");
      return;
    }

    if (!trimmedDescription) {
      alert("Please describe your issue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const storedTickets = localStorage.getItem(STORAGE_KEY);

      let existingTickets: SupportTicket[] = [];

      if (storedTickets) {
        try {
          existingTickets = JSON.parse(storedTickets);
        } catch {
          existingTickets = [];
        }
      }

      const highestTicketNumber = existingTickets.reduce(
        (highest, ticket) => {
          const number = Number(ticket.id.replace("TKT-", ""));

          return Number.isNaN(number)
            ? highest
            : Math.max(highest, number);
        },
        1024
      );

      const newTicketNumber = highestTicketNumber + 1;

      const newTicket: SupportTicket = {
        id: `TKT-${newTicketNumber}`,
        subject: trimmedSubject,
        category,
        priority,
        status: "Open",
        created: "18 Sep 2026",
        updated: "Just now",
        order: order || "Not specified",
        product: product || "Not specified",
        description: trimmedDescription,
        attachment: attachment?.name || "",
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newTicket, ...existingTickets])
      );

      setTimeout(() => {
        setIsSubmitting(false);

        alert(
          `Support request ${newTicket.id} submitted successfully.`
        );

        navigate("/support/tickets");
      }, 500);
    } catch (error) {
      console.error("Unable to save support ticket:", error);

      setIsSubmitting(false);

      alert(
        "Unable to submit the support request. Please try again."
      );
    }
  };

  return (
    <div className="nx-create-ticket-page">

      {/* BREADCRUMB */}
      <div className="container nx-ticket-breadcrumb">
        <Link to="/">Home</Link>

        <i className="bi bi-chevron-right"></i>

        <Link to="/support">Support</Link>

        <i className="bi bi-chevron-right"></i>

        <span>Create Support Ticket</span>
      </div>

      {/* PAGE HEADER */}
      <section className="container nx-ticket-header">
        <div>
          <span className="nx-support-label">
            SUPPORT CENTER
          </span>

          <h1>Create Support Ticket</h1>

          <p>
            Tell us what you need help with and our support
            team will assist you as quickly as possible.
          </p>
        </div>

        <Link
          to="/support/tickets"
          className="nx-ticket-history-btn"
        >
          <i className="bi bi-ticket-detailed"></i>
          My Requests
        </Link>
      </section>

      {/* MAIN CONTENT */}
      <section className="container nx-ticket-content">
        <div className="nx-ticket-layout">

          {/* LEFT FORM */}
          <div className="nx-ticket-form-card">

            <div className="nx-ticket-card-header">
              <div>
                <span>REQUEST INFORMATION</span>

                <h2>Tell us about your issue</h2>
              </div>

              <div className="nx-ticket-header-icon">
                <i className="bi bi-pencil-square"></i>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* CATEGORY + ORDER */}
              <div className="nx-form-row">

                <div className="nx-form-group">
                  <label htmlFor="ticket-category">
                    Issue Category
                    <span>*</span>
                  </label>

                  <div className="nx-select-wrapper">
                    <select
                      id="ticket-category"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      required
                    >
                      <option value="">
                        Select issue category
                      </option>

                      <option value="Technical Support">
                        Technical Support
                      </option>

                      <option value="Orders & Payments">
                        Orders & Payments
                      </option>

                      <option value="Shipping & Delivery">
                        Shipping & Delivery
                      </option>

                      <option value="Returns & Warranty">
                        Returns & Warranty
                      </option>

                      <option value="Account & Security">
                        Account & Security
                      </option>
                    </select>

                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>

                <div className="nx-form-group">
                  <label htmlFor="ticket-order">
                    Related Order
                  </label>

                  <div className="nx-select-wrapper">
                    <select
                      id="ticket-order"
                      value={order}
                      onChange={(event) =>
                        setOrder(event.target.value)
                      }
                    >
                      <option value="">
                        Select order (optional)
                      </option>

                      <option value="ORD-1001">
                        ORD-1001 · ₹55,000
                      </option>

                      <option value="ORD-1002">
                        ORD-1002 · ₹25,000
                      </option>

                      <option value="ORD-1003">
                        ORD-1003 · ₹8,000
                      </option>
                    </select>

                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>

              </div>

              {/* PRODUCT + PRIORITY */}
              <div className="nx-form-row">

                <div className="nx-form-group">
                  <label htmlFor="ticket-product">
                    Related Product
                  </label>

                  <div className="nx-select-wrapper">
                    <select
                      id="ticket-product"
                      value={product}
                      onChange={(event) =>
                        setProduct(event.target.value)
                      }
                    >
                      <option value="">
                        Select product (optional)
                      </option>

                      <option value="Smart IoT Gateway Pro">
                        Smart IoT Gateway Pro
                      </option>

                      <option value="EdgeCompute R500">
                        EdgeCompute R500
                      </option>

                      <option value="NexusOS Fleet Control">
                        NexusOS Fleet Control
                      </option>

                      <option value="Industrial PoE Switch 8P">
                        Industrial PoE Switch 8P
                      </option>

                      <option value="NX-12 Embedded Controller">
                        NX-12 Embedded Controller
                      </option>
                    </select>

                    <i className="bi bi-chevron-down"></i>
                  </div>
                </div>

                <div className="nx-form-group">
                  <label>
                    Priority
                    <span>*</span>
                  </label>

                  <div className="nx-priority-options">
                    {(
                      [
                        "Normal",
                        "Medium",
                        "High",
                        "Urgent",
                      ] as const
                    ).map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`nx-priority-btn ${
                          priority === item ? "active" : ""
                        } ${item.toLowerCase()}`}
                        onClick={() => setPriority(item)}
                      >
                        <span></span>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* SUBJECT */}
              <div className="nx-form-group">
                <label htmlFor="ticket-subject">
                  Subject
                  <span>*</span>
                </label>

                <input
                  id="ticket-subject"
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="Briefly describe your issue"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="nx-form-group">
                <label htmlFor="ticket-description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="ticket-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Please provide details about the issue, including any relevant information that may help our support team."
                  rows={7}
                  required
                />
              </div>

              {/* ATTACHMENT */}
              <div className="nx-form-group">
                <label htmlFor="ticket-attachment">
                  Attachment
                </label>

                <label
                  htmlFor="ticket-attachment"
                  className="nx-upload-box"
                >
                  <i className="bi bi-paperclip"></i>

                  <div>
                    <strong>
                      {attachment
                        ? attachment.name
                        : "Attach screenshot or document"}
                    </strong>

                    <span>
                      Optional · Max 10MB
                    </span>
                  </div>

                  <span className="nx-upload-action">
                    Browse
                  </span>
                </label>

                <input
                  id="ticket-attachment"
                  type="file"
                  hidden
                  onChange={handleAttachmentChange}
                />
              </div>

              {/* ACTIONS */}
              <div className="nx-ticket-form-actions">

                <Link
                  to="/support"
                  className="nx-ticket-cancel-btn"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="nx-ticket-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="nx-ticket-guidelines">

            {/* GUIDELINES */}
            <div className="nx-guideline-card">

              <div className="nx-guideline-icon">
                <i className="bi bi-info-circle"></i>
              </div>

              <h3>Support Guidelines</h3>

              <p>
                Provide the following information to help our
                support team resolve your request faster.
              </p>

              <div className="nx-guideline-list">

                <div>
                  <i className="bi bi-check2"></i>

                  <span>
                    Provide as much detail as possible about
                    the issue.
                  </span>
                </div>

                <div>
                  <i className="bi bi-check2"></i>

                  <span>
                    Include order or product information when
                    applicable.
                  </span>
                </div>

                <div>
                  <i className="bi bi-check2"></i>

                  <span>
                    Attach screenshots or documents if they
                    help explain the issue.
                  </span>
                </div>

                <div>
                  <i className="bi bi-check2"></i>

                  <span>
                    Avoid sharing passwords or sensitive
                    credentials.
                  </span>
                </div>

              </div>
            </div>

            {/* RESPONSE */}
            <div className="nx-response-card">

              <div className="nx-response-icon">
                <i className="bi bi-clock-history"></i>
              </div>

              <div>
                <span>EXPECTED RESPONSE</span>

                <strong>
                  Within 4 business hours
                </strong>

                <p>
                  Response time may vary depending on issue
                  priority and complexity.
                </p>
              </div>

            </div>

            {/* SECURITY */}
            <div className="nx-ticket-security">

              <i className="bi bi-shield-check"></i>

              <div>
                <strong>
                  Your information is secure
                </strong>

                <span>
                  Your support request and attached
                  information are handled securely by the
                  Nexus Support team.
                </span>
              </div>

            </div>

          </aside>
        </div>
      </section>
    </div>
  );
}

export default CreateTicket;