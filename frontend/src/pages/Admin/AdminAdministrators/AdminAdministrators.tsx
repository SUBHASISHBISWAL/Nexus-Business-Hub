import { useMemo, useState } from "react";
import "./AdminAdministrators.css";

type Role = "Admin" | "Customer";
type Status = "Active" | "Pending Invitation" | "Inactive";

type Administrator = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  status: Status;
  invitedAt: string;
};

const AdminAdministrators = () => {
  const [administrators, setAdministrators] = useState<
    Administrator[]
  >([
    {
      id: 1,
      fullName: "Ashutosh Sahu",
      email: "admin@nexus.com",
      phone: "+91 98765 43210",
      role: "Admin",
      status: "Active",
      invitedAt: "24 Sep 2026",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | Status
  >("All");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Admin" as Role,
  });

  const [formError, setFormError] = useState("");

  const filteredAdministrators = useMemo(() => {
    return administrators.filter((administrator) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        administrator.fullName
          .toLowerCase()
          .includes(search) ||
        administrator.email
          .toLowerCase()
          .includes(search) ||
        administrator.phone
          .toLowerCase()
          .includes(search);

      const matchesRole =
        roleFilter === "All" ||
        administrator.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        administrator.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    administrators,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  const activeCount = administrators.filter(
    (administrator) => administrator.status === "Active"
  ).length;

  const pendingCount = administrators.filter(
    (administrator) =>
      administrator.status === "Pending Invitation"
  ).length;

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
  };

  const handleOpenModal = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "Admin",
    });

    setFormError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormError("");
  };

  const handleSendInvitation = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!fullName || !email || !phone) {
      setFormError(
        "Please fill in all required fields."
      );
      return;
    }

    const emailExists = administrators.some(
      (administrator) =>
        administrator.email.toLowerCase() ===
        email.toLowerCase()
    );

    if (emailExists) {
      setFormError(
        "An account with this email address already exists."
      );
      return;
    }

    const newAdministrator: Administrator = {
      id: Date.now(),
      fullName,
      email,
      phone,
      role: formData.role,
      status: "Pending Invitation",
      invitedAt: "Just now",
    };

    setAdministrators((previous) => [
      ...previous,
      newAdministrator,
    ]);

    handleCloseModal();
  };

  const handleResendInvitation = (
    id: number
  ) => {
    setAdministrators((previous) =>
      previous.map((administrator) =>
        administrator.id === id
          ? {
              ...administrator,
              status: "Pending Invitation",
              invitedAt: "Just now",
            }
          : administrator
      )
    );
  };

  const handleToggleStatus = (id: number) => {
    setAdministrators((previous) =>
      previous.map((administrator) => {
        if (administrator.id !== id) {
          return administrator;
        }

        return {
          ...administrator,
          status:
            administrator.status === "Active"
              ? "Inactive"
              : "Active",
        };
      })
    );
  };

  const handleRemove = (id: number) => {
    const administrator = administrators.find(
      (item) => item.id === id
    );

    if (!administrator) return;

    if (
      administrator.email ===
      "admin@nexus.com"
    ) {
      window.alert(
        "The primary administrator cannot be removed."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${administrator.fullName}?`
    );

    if (!confirmed) return;

    setAdministrators((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="nx-admin-administrators-page">

      {/* Page Header */}
      <div className="nx-admin-administrators-header">

        <div>
          <span className="nx-admin-page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Administrators</h1>

          <p>
            Manage platform users, roles and
            administrator access.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-add-button"
          onClick={handleOpenModal}
        >
          <i className="bi bi-person-plus" />
          Add Administrator
        </button>

      </div>


      {/* Summary Cards */}
      <div className="nx-admin-admin-summary">

        <div className="nx-admin-admin-summary-card">

          <div className="nx-admin-summary-icon">
            <i className="bi bi-people" />
          </div>

          <div>
            <span>Total Users</span>
            <strong>
              {administrators.length}
            </strong>
          </div>

        </div>


        <div className="nx-admin-admin-summary-card">

          <div className="nx-admin-summary-icon active">
            <i className="bi bi-person-check" />
          </div>

          <div>
            <span>Active</span>
            <strong>
              {activeCount}
            </strong>
          </div>

        </div>


        <div className="nx-admin-admin-summary-card">

          <div className="nx-admin-summary-icon pending">
            <i className="bi bi-envelope" />
          </div>

          <div>
            <span>Pending Invitations</span>
            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>

      </div>


      {/* Main Card */}
      <div className="nx-admin-admin-card">

        {/* Card Header */}
        <div className="nx-admin-admin-card-header">

          <div>
            <h2>User & Access Management</h2>

            <p>
              View and manage users invited to the
              Nexus Business Hub.
            </p>
          </div>

        </div>


        {/* Filters */}
        <div className="nx-admin-admin-filters">

          <div className="nx-admin-admin-search">

            <i className="bi bi-search" />

            <input
              type="search"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

          </div>


          <select
            className="nx-admin-filter-select"
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value as
                  | "All"
                  | Role
              )
            }
          >
            <option value="All">
              All Roles
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="Customer">
              Customer
            </option>
          </select>


          <select
            className="nx-admin-filter-select"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "All"
                  | Status
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Pending Invitation">
              Pending Invitation
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>


        {/* Table */}
        <div className="nx-admin-admin-table-wrapper">

          <table className="nx-admin-admin-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Status</th>
                <th>Invitation</th>
                <th className="nx-admin-action-column">
                  Actions
                </th>
              </tr>
            </thead>


            <tbody>

              {filteredAdministrators.length > 0 ? (
                filteredAdministrators.map(
                  (administrator) => (
                    <tr key={administrator.id}>

                      {/* User */}
                      <td>

                        <div className="nx-admin-user-cell">

                          <div className="nx-admin-user-avatar">
                            {getInitials(
                              administrator.fullName
                            )}
                          </div>

                          <div className="nx-admin-user-details">

                            <strong>
                              {administrator.fullName}
                            </strong>

                            <span>
                              {administrator.email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* Phone */}
                      <td>
                        <span className="nx-admin-phone">
                          {administrator.phone}
                        </span>
                      </td>


                      {/* Role */}
                      <td>

                        <span
                          className={`nx-admin-role-badge ${
                            administrator.role ===
                            "Admin"
                              ? "admin"
                              : "customer"
                          }`}
                        >
                          <i
                            className={
                              administrator.role ===
                              "Admin"
                                ? "bi bi-shield-check"
                                : "bi bi-person"
                            }
                          />

                          {administrator.role}
                        </span>

                      </td>


                      {/* Status */}
                      <td>

                        <span
                          className={`nx-admin-status-badge ${
                            administrator.status ===
                            "Active"
                              ? "active"
                              : administrator.status ===
                                "Pending Invitation"
                              ? "pending"
                              : "inactive"
                          }`}
                        >
                          <span className="nx-admin-status-dot" />

                          {administrator.status}
                        </span>

                      </td>


                      {/* Invitation */}
                      <td>

                        <span className="nx-admin-invitation-date">
                          {administrator.invitedAt}
                        </span>

                      </td>


                      {/* Actions */}
                      <td>

                        <div className="nx-admin-row-actions">

                          {administrator.status ===
                            "Pending Invitation" && (
                            <button
                              type="button"
                              className="nx-admin-row-action"
                              title="Resend invitation"
                              onClick={() =>
                                handleResendInvitation(
                                  administrator.id
                                )
                              }
                            >
                              <i className="bi bi-send" />
                            </button>
                          )}


                          <button
                            type="button"
                            className="nx-admin-row-action"
                            title={
                              administrator.status ===
                              "Active"
                                ? "Deactivate"
                                : "Activate"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                administrator.id
                              )
                            }
                          >
                            <i
                              className={
                                administrator.status ===
                                "Active"
                                  ? "bi bi-person-dash"
                                  : "bi bi-person-check"
                              }
                            />
                          </button>


                          <button
                            type="button"
                            className="nx-admin-row-action danger"
                            title="Remove user"
                            onClick={() =>
                              handleRemove(
                                administrator.id
                              )
                            }
                          >
                            <i className="bi bi-trash3" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>

                  <td
                    colSpan={6}
                    className="nx-admin-empty-state"
                  >
                    <div>
                      <i className="bi bi-people" />

                      <strong>
                        No users found
                      </strong>

                      <span>
                        Try changing your search or
                        filter criteria.
                      </span>
                    </div>
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* Add Administrator Modal */}
      {showModal && (
        <div
          className="nx-admin-modal-backdrop"
          onClick={handleCloseModal}
        >

          <div
            className="nx-admin-invite-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="nx-admin-invite-header">

              <div>

                <span>
                  ADMINISTRATION
                </span>

                <h2>
                  Add Administrator
                </h2>

                <p>
                  Invite a new user to the
                  Nexus Business Hub.
                </p>

              </div>

              <button
                type="button"
                className="nx-admin-modal-close"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSendInvitation}
            >

              <div className="nx-admin-invite-body">

                {formError && (
                  <div className="nx-admin-form-error">
                    <i className="bi bi-exclamation-circle" />

                    <span>
                      {formError}
                    </span>
                  </div>
                )}


                {/* Full Name */}
                <div className="nx-admin-form-field">

                  <label htmlFor="fullName">
                    Full Name
                    <span>*</span>
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="nx-admin-form-input"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />

                </div>


                {/* Email */}
                <div className="nx-admin-form-field">

                  <label htmlFor="email">
                    Email Address
                    <span>*</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="nx-admin-form-input"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />

                </div>


                {/* Phone */}
                <div className="nx-admin-form-field">

                  <label htmlFor="phone">
                    Phone Number
                    <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="nx-admin-form-input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />

                </div>


                {/* Role */}
                <div className="nx-admin-form-field">

                  <label htmlFor="role">
                    Role
                    <span>*</span>
                  </label>

                  <select
                    id="role"
                    name="role"
                    className="nx-admin-form-input"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="Admin">
                      Admin
                    </option>

                    <option value="Customer">
                      Customer
                    </option>
                  </select>

                  <small>
                    Admin users can access the
                    administration panel. Customers
                    use the standard customer portal.
                  </small>

                </div>

              </div>


              {/* Modal Footer */}
              <div className="nx-admin-invite-footer">

                <button
                  type="button"
                  className="nx-admin-cancel-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="nx-admin-send-button"
                >
                  <i className="bi bi-send" />
                  Send Invitation
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminAdministrators;