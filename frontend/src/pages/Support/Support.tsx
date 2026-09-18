
import { Link } from "react-router-dom";

import "./Support.css";

function Support() {
  const supportCategories = [
    {
      icon: "bi-cpu",
      title: "Technical Support",
      description:
        "Get assistance with product configuration, connectivity, software and technical issues.",
      link: "Get Technical Help",
    },
    {
      icon: "bi-cart-check",
      title: "Orders & Payments",
      description:
        "Get help with orders, invoices, payments, cancellations and purchase-related queries.",
      link: "Get Order Help",
    },
    {
      icon: "bi-truck",
      title: "Shipping & Delivery",
      description:
        "Track shipments, resolve delivery issues and get assistance with order fulfillment.",
      link: "Get Shipping Help",
    },
    {
      icon: "bi-arrow-return-left",
      title: "Returns & Warranty",
      description:
        "Request returns, replacements, warranty assistance or product service support.",
      link: "Start a Return",
    },
  ];

  const supportTickets = [
    {
      id: "TKT-1024",
      subject: "Gateway connectivity issue",
      category: "Technical",
      priority: "High",
      status: "In Progress",
      updated: "2h ago",
    },
    {
      id: "TKT-1021",
      subject: "Invoice clarification",
      category: "Orders & Payments",
      priority: "Medium",
      status: "Awaiting Response",
      updated: "5h ago",
    },
    {
      id: "TKT-1018",
      subject: "Product replacement request",
      category: "Returns & Warranty",
      priority: "High",
      status: "Resolved",
      updated: "1d ago",
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      category: "Orders & Shipping",
    },
    {
      question: "How do I request a product return?",
      category: "Returns & Warranty",
    },
    {
      question: "How can I download my invoice?",
      category: "Orders & Payments",
    },
    {
      question: "What is the warranty policy?",
      category: "Products & Warranty",
    },
    {
      question: "How do I update my account details?",
      category: "Account & Security",
    },
    {
      question: "How can I get technical assistance?",
      category: "Technical Support",
    },
  ];

  return (
    <div className="nx-support-page">

      {/* =====================================================
          SUPPORT HERO
      ===================================================== */}
      <section className="nx-support-hero">
        <div className="container">

          <div className="nx-support-hero-content">

            <div className="nx-support-kicker">
              <span></span>
              ENTERPRISE SUPPORT CENTER
            </div>

            <h1>
              How can we
              <br />
              <strong>help you today?</strong>
            </h1>

            <p>
              Get assistance with products, orders, shipments,
              returns and technical issues through one connected
              support experience.
            </p>

            {/* Support Search */}
            <div className="nx-support-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search for help, products, orders..."
                aria-label="Search support"
              />

              <button type="button">
                Search
              </button>
            </div>

            {/* Hero Actions */}
            <div className="nx-support-hero-actions">

              <Link
                to="/support/create-ticket"
                className="nx-support-primary-btn"
              >
                <i className="bi bi-plus-lg"></i>
                Create Support Ticket
              </Link>

              <Link
                to="/support/tickets"
                className="nx-support-secondary-btn"
              >
                Track My Requests
                <i className="bi bi-arrow-right"></i>
              </Link>

            </div>

          </div>

          {/* Hero Status Panel */}
          <div className="nx-support-status-panel">

            <div className="nx-support-status-header">
              <span>SUPPORT STATUS</span>

              <div className="nx-support-operational">
                <span></span>
                Operational
              </div>
            </div>

            <div className="nx-support-status-main">

              <div className="nx-support-status-icon">
                <i className="bi bi-headset"></i>
              </div>

              <div>
                <strong>Support team is available</strong>

                <p>
                  Our support channels are currently
                  operating normally.
                </p>
              </div>

            </div>

            <div className="nx-support-status-footer">

              <div>
                <span>OPEN REQUESTS</span>
                <strong>04</strong>
              </div>

              <div>
                <span>AVG. RESPONSE</span>
                <strong>&lt; 4h</strong>
              </div>

              <div>
                <span>SUPPORT HOURS</span>
                <strong>09–18</strong>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          HOW CAN WE HELP
      ===================================================== */}
      <section className="container nx-support-section">

        <div className="nx-support-section-heading">

          <div>
            <span className="nx-support-label">
              SUPPORT SERVICES
            </span>

            <h2>
              How can we
              <br />
              help you?
            </h2>
          </div>

          <p>
            Select a support area based on your requirement
            and get the right assistance for your issue.
          </p>

        </div>

        <div className="nx-support-category-grid">

          {supportCategories.map((category) => (
            <div
              className="nx-support-category-card"
              key={category.title}
            >

              <div className="nx-support-category-icon">
                <i className={`bi ${category.icon}`}></i>
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <button type="button">
                {category.link}
                <i className="bi bi-arrow-right"></i>
              </button>

            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          MY SUPPORT REQUESTS
      ===================================================== */}
      <section className="nx-support-requests-section">

        <div className="container nx-support-section">

          <div className="nx-support-section-heading">

            <div>
              <span className="nx-support-label">
                MY SUPPORT REQUESTS
              </span>

              <h2>
                Track your
                <br />
                support activity.
              </h2>
            </div>

            <Link
              to="/support/tickets"
              className="nx-support-view-all"
            >
              View All Tickets
              <i className="bi bi-arrow-right"></i>
            </Link>

          </div>

          <div className="nx-support-ticket-table">

            <div className="nx-support-table-header">
              <span>Ticket ID</span>
              <span>Subject</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span>Updated</span>
              <span></span>
            </div>

            {supportTickets.map((ticket) => (
              <Link
                to={`/support/tickets/${ticket.id}`}
                className="nx-support-ticket-row"
                key={ticket.id}
              >

                <strong>{ticket.id}</strong>

                <div className="nx-support-ticket-subject">
                  <strong>{ticket.subject}</strong>
                </div>

                <span>{ticket.category}</span>

                <span
                  className={`nx-support-priority ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>

                <span
                  className={`nx-support-ticket-status ${ticket.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <span></span>
                  {ticket.status}
                </span>

                <span>{ticket.updated}</span>

                <i className="bi bi-chevron-right"></i>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          SELF SERVICE / KNOWLEDGE CENTER
      ===================================================== */}
      <section className="container nx-support-section">

        <div className="nx-support-section-heading centered">

          <span className="nx-support-label">
            SELF-SERVICE HELP
          </span>

          <h2>
            Find answers quickly.
          </h2>

          <p>
            Browse common questions and helpful information
            before creating a support request.
          </p>

        </div>

        <div className="nx-support-faq-grid">

          {faqs.map((faq) => (
            <button
              type="button"
              className="nx-support-faq-card"
              key={faq.question}
            >

              <div className="nx-support-faq-icon">
                <i className="bi bi-question-lg"></i>
              </div>

              <div>
                <strong>{faq.question}</strong>
                <span>{faq.category}</span>
              </div>

              <i className="bi bi-arrow-up-right"></i>

            </button>
          ))}

        </div>

      </section>

      {/* =====================================================
          CONTACT SUPPORT
      ===================================================== */}
      <section className="container">

        <div className="nx-support-contact">

          <div className="nx-support-contact-content">

            <span className="nx-support-label">
              NEED MORE ASSISTANCE?
            </span>

            <h2>
              We're here to
              <br />
              help you move forward.
            </h2>

            <p>
              Can't find what you're looking for?
              Create a support request and our team
              will help you resolve the issue.
            </p>

          </div>

          <div className="nx-support-contact-actions">

            <Link
              to="/support/create-ticket"
              className="nx-support-primary-btn"
            >
              Create Support Ticket
              <i className="bi bi-arrow-right"></i>
            </Link>

            <div className="nx-support-contact-info">

              <div>
                <i className="bi bi-envelope"></i>

                <span>
                  <small>Email Support</small>
                  support@nexusbusinesshub.com
                </span>
              </div>

              <div>
                <i className="bi bi-clock"></i>

                <span>
                  <small>Support Hours</small>
                  Monday – Friday · 09:00 – 18:00
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Support;

