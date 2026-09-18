import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CreateTicket.css";

function CreateTicket() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("Technical Support");
  const [order, setOrder] = useState("");
  const [product, setProduct] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subject.trim() || !description.trim()) {
      return;
    }

    // Backend integration can be added later.
    alert("Support request submitted successfully.");

    navigate("/support/tickets");
  };

  return (
    <div className="nx-create-ticket-page">

      {/* BREADCRUMB */}
      <div className="container nx-ticket-breadcrumb">
        <Link to="/support">Support</Link>
        <span>/</span>
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
            team will get back to you.
          </p>
        </div>

        <Link
          to="/support/tickets"
          className="nx-ticket-history-btn"
        >
          <i className="bi bi-clock-history"></i>
          My Requests
        </Link>
      </section>

      {/* MAIN CONTENT */}
      <section className="container nx-ticket-layout">

        {/* FORM */}
        <div className="nx-ticket-form-card">

          <div className="nx-ticket-card-header">
            <div>
              <h2>Request Details</h2>
              <p>
                Provide the information below so we can
                understand your request.
              </p>
            </div>

            <span className="nx-required-note">
              * Required
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            {/* CATEGORY */}
            <div className="nx-form-group">
              <label htmlFor="category">
                Issue Category <span>*</span>
              </label>

              <div className="nx-select-wrapper">
                <select
                  id="category"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option>Technical Support</option>
                  <option>Orders & Payments</option>
                  <option>Shipping & Delivery</option>
                  <option>Returns & Warranty</option>
                  <option>Account & Security</option>
                  <option>Other</option>
                </select>

                <i className="bi bi-chevron-down"></i>
              </div>
            </div>

            {/* ORDER + PRODUCT */}
            <div className="nx-form-row">

              <div className="nx-form-group">
                <label htmlFor="order">
                  Related Order
                </label>

                <div className="nx-select-wrapper">
                  <select
                    id="order"
                    value={order}
                    onChange={(event) =>
                      setOrder(event.target.value)
                    }
                  >
                    <option value="">
                      Select an order
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

              <div className="nx-form-group">
                <label htmlFor="product">
                  Product
                </label>

                <div className="nx-select-wrapper">
                  <select
                    id="product"
                    value={product}
                    onChange={(event) =>
                      setProduct(event.target.value)
                    }
                  >
                    <option value="">
                      Select product
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
                    <option value="Thermal Vision Array">
                      Thermal Vision Array
                    </option>
                  </select>

                  <i className="bi bi-chevron-down"></i>
                </div>
              </div>

            </div>

            {/* PRIORITY */}
            <div className="nx-form-group">
              <label>
                Priority
              </label>

              <div className="nx-priority-options">

                {["Normal", "High", "Urgent"].map(
                  (level) => (
                    <button
                      type="button"
                      key={level}
                      className={`nx-priority-btn ${
                        priority === level
                          ? "active"
                          : ""
                      } ${level.toLowerCase()}`}
                      onClick={() =>
                        setPriority(level)
                      }
                    >
                      <span></span>
                      {level}
                    </button>
                  )
                )}

              </div>
            </div>

            {/* SUBJECT */}
            <div className="nx-form-group">
              <label htmlFor="subject">
                Subject <span>*</span>
              </label>

              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="Briefly describe your issue..."
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="nx-form-group">
              <label htmlFor="description">
                Description <span>*</span>
              </label>

              <textarea
                id="description"
                rows={7}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Explain your issue in detail..."
                required
              />

              <small>
                Include relevant error messages, steps taken,
                or other information that may help our team.
              </small>
            </div>

            {/* ATTACHMENT */}
            <div className="nx-form-group">
              <label>
                Attachments
              </label>

              <label
                htmlFor="attachment"
                className="nx-upload-box"
              >
                <i className="bi bi-cloud-arrow-up"></i>

                <div>
                  <strong>
                    {attachment
                      ? attachment.name
                      : "Upload supporting files"}
                  </strong>

                  <span>
                    PNG, JPG, PDF or DOC · Max 10 MB
                  </span>
                </div>

                <span className="nx-upload-action">
                  Browse
                </span>
              </label>

              <input
                id="attachment"
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                hidden
                onChange={(event) =>
                  setAttachment(
                    event.target.files?.[0] || null
                  )
                }
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
              >
                <i className="bi bi-send"></i>
                Submit Request
              </button>

            </div>

          </form>
        </div>

        {/* RIGHT GUIDELINES */}
        <aside className="nx-ticket-guidelines">

          <div className="nx-guideline-card">

            <div className="nx-guideline-icon">
              <i className="bi bi-info-circle"></i>
            </div>

            <h3>Support Guidelines</h3>

            <p>
              A few details can help our team resolve your
              request faster.
            </p>

            <div className="nx-guideline-list">

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Provide order or product details
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Explain the issue clearly
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Add screenshots when required
                </span>
              </div>

              <div>
                <i className="bi bi-check2"></i>
                <span>
                  Include relevant error messages
                </span>
              </div>

            </div>

          </div>

          <div className="nx-response-card">

            <div className="nx-response-icon">
              <i className="bi bi-headset"></i>
            </div>

            <div>
              <span>EXPECTED RESPONSE</span>

              <strong>
                Within 4 business hours
              </strong>

              <p>
                Support hours: Monday – Friday,
                09:00 – 18:00
              </p>
            </div>

          </div>

          <div className="nx-ticket-security">

            <i className="bi bi-shield-check"></i>

            <div>
              <strong>Your information is secure</strong>

              <span>
                Support requests are handled securely
                by the Nexus support team.
              </span>
            </div>

          </div>

        </aside>

      </section>

    </div>
  );
}

export default CreateTicket;