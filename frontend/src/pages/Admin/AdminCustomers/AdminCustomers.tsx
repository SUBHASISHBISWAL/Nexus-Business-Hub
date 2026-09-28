import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCustomers.css";

type CustomerStatus = "Active" | "Inactive";
type CustomerType = "Individual" | "Business";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: CustomerType;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  registered: string;
  status: CustomerStatus;
}

const customers: Customer[] = [
  {
    id: "CUS-1001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    type: "Individual",
    orders: 12,
    totalSpent: 284500,
    lastOrder: "18 Sep 2026",
    registered: "12 Jan 2026",
    status: "Active",
  },
  {
    id: "CUS-1002",
    name: "Priya Das",
    email: "priya.das@gmail.com",
    phone: "+91 91234 56780",
    type: "Individual",
    orders: 8,
    totalSpent: 156800,
    lastOrder: "17 Sep 2026",
    registered: "28 Feb 2026",
    status: "Active",
  },
  {
    id: "CUS-1003",
    name: "Amit Kumar",
    email: "amit.kumar@techcorp.in",
    phone: "+91 99887 66554",
    type: "Business",
    orders: 21,
    totalSpent: 642300,
    lastOrder: "16 Sep 2026",
    registered: "05 Nov 2025",
    status: "Active",
  },
  {
    id: "CUS-1004",
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    phone: "+91 98760 12345",
    type: "Individual",
    orders: 5,
    totalSpent: 78400,
    lastOrder: "14 Sep 2026",
    registered: "19 Mar 2026",
    status: "Active",
  },
  {
    id: "CUS-1005",
    name: "Arjun Singh",
    email: "arjun.singh@enterprises.in",
    phone: "+91 90909 11223",
    type: "Business",
    orders: 17,
    totalSpent: 528900,
    lastOrder: "12 Sep 2026",
    registered: "08 Dec 2025",
    status: "Active",
  },
  {
    id: "CUS-1006",
    name: "Neha Mishra",
    email: "neha.mishra@gmail.com",
    phone: "+91 97654 32109",
    type: "Individual",
    orders: 7,
    totalSpent: 124650,
    lastOrder: "10 Sep 2026",
    registered: "14 Apr 2026",
    status: "Active",
  },
  {
    id: "CUS-1007",
    name: "Vikash Rout",
    email: "vikash.rout@gmail.com",
    phone: "+91 94370 22114",
    type: "Individual",
    orders: 3,
    totalSpent: 42600,
    lastOrder: "06 Sep 2026",
    registered: "21 May 2026",
    status: "Inactive",
  },
  {
    id: "CUS-1008",
    name: "Ananya Roy",
    email: "ananya.roy@businesshub.in",
    phone: "+91 98312 44556",
    type: "Business",
    orders: 14,
    totalSpent: 389750,
    lastOrder: "04 Sep 2026",
    registered: "16 Jan 2026",
    status: "Active",
  },
  {
    id: "CUS-1009",
    name: "Rohit Mehta",
    email: "rohit.mehta@gmail.com",
    phone: "+91 98111 22334",
    type: "Individual",
    orders: 4,
    totalSpent: 69800,
    lastOrder: "01 Sep 2026",
    registered: "09 Jun 2026",
    status: "Active",
  },
  {
    id: "CUS-1010",
    name: "Kavita Singh",
    email: "kavita.singh@solutions.in",
    phone: "+91 99100 77889",
    type: "Business",
    orders: 10,
    totalSpent: 276400,
    lastOrder: "29 Aug 2026",
    registered: "11 Feb 2026",
    status: "Inactive",
  },
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

function AdminCustomers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;

  const filteredCustomers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !searchValue ||
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.id.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      const matchesType =
        typeFilter === "All" || customer.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / rowsPerPage)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedCustomers = filteredCustomers.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const newCustomers = customers.filter((customer) =>
    ["CUS-1008", "CUS-1009", "CUS-1010"].includes(customer.id)
  ).length;

  const totalCustomerValue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const goToCustomerDetails = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  return (
    <div className="nx-admin-customers-page">
      <div className="nx-admin-customers-breadcrumb">
        <span>Admin</span>
        <i className="bi bi-chevron-right" />
        <span className="nx-admin-customers-breadcrumb-current">
          Customers
        </span>
      </div>

      <div className="nx-admin-customers-header">
        <div>
          <h1>Customers</h1>
          <p>
            Manage customer profiles, accounts, orders and lifetime value.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-customers-export-btn"
          onClick={() => alert("Customer export will be connected to the API.")}
        >
          <i className="bi bi-download" />
          Export
        </button>
      </div>

      <div className="nx-admin-customers-summary-grid">
        <div className="nx-admin-customers-summary-card">
          <div className="nx-admin-customers-summary-icon blue">
            <i className="bi bi-people" />
          </div>
          <div>
            <span>Total Customers</span>
            <strong>{totalCustomers}</strong>
            <small>All registered accounts</small>
          </div>
        </div>

        <div className="nx-admin-customers-summary-card">
          <div className="nx-admin-customers-summary-icon green">
            <i className="bi bi-person-check" />
          </div>
          <div>
            <span>Active Customers</span>
            <strong>{activeCustomers}</strong>
            <small>Currently active accounts</small>
          </div>
        </div>

        <div className="nx-admin-customers-summary-card">
          <div className="nx-admin-customers-summary-icon orange">
            <i className="bi bi-person-plus" />
          </div>
          <div>
            <span>New Customers</span>
            <strong>{newCustomers}</strong>
            <small>Recent customer registrations</small>
          </div>
        </div>

        <div className="nx-admin-customers-summary-card">
          <div className="nx-admin-customers-summary-icon purple">
            <i className="bi bi-wallet2" />
          </div>
          <div>
            <span>Customer Value</span>
            <strong>{formatCurrency(totalCustomerValue)}</strong>
            <small>Total lifetime spend</small>
          </div>
        </div>
      </div>

      <div className="nx-admin-customers-card">
        <div className="nx-admin-customers-card-header">
          <div>
            <h2>Customer Directory</h2>
            <span className="nx-admin-customers-count">
              {filteredCustomers.length} customers
            </span>
          </div>
        </div>

        <div className="nx-admin-customers-filters">
          <div className="nx-admin-customers-search">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder="Search by name, email, customer ID..."
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => handleStatusChange(event.target.value)}
            className="nx-admin-customers-filter-select"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => handleTypeChange(event.target.value)}
            className="nx-admin-customers-filter-select"
          >
            <option value="All">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>

          <button
            type="button"
            className="nx-admin-customers-clear-btn"
            onClick={clearFilters}
          >
            <i className="bi bi-arrow-counterclockwise" />
            Clear
          </button>
        </div>

        <div className="nx-admin-customers-table-wrap">
          <table className="nx-admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Customer ID</th>
                <th>Type</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="nx-admin-customers-customer">
                      <div className="nx-admin-customers-avatar">
                        {getInitials(customer.name)}
                      </div>

                      <div className="nx-admin-customers-customer-info">
                        <strong>{customer.name}</strong>
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="nx-admin-customers-id">
                      {customer.id}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`nx-admin-customers-type ${customer.type.toLowerCase()}`}
                    >
                      <i
                        className={
                          customer.type === "Business"
                            ? "bi bi-building"
                            : "bi bi-person"
                        }
                      />
                      {customer.type}
                    </span>
                  </td>

                  <td>
                    <div className="nx-admin-customers-contact">
                      <span>{customer.phone}</span>
                    </div>
                  </td>

                  <td>
                    <span className="nx-admin-customers-orders">
                      {customer.orders}
                    </span>
                  </td>

                  <td>
                    <strong className="nx-admin-customers-spent">
                      {formatCurrency(customer.totalSpent)}
                    </strong>
                  </td>

                  <td>
                    <span className="nx-admin-customers-date">
                      {customer.lastOrder}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`nx-customer-status ${customer.status.toLowerCase()}`}
                    >
                      <span className="nx-customer-status-dot" />
                      {customer.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="nx-admin-customers-view-btn"
                      onClick={() => goToCustomerDetails(customer.id)}
                    >
                      View
                      <i className="bi bi-arrow-right" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedCustomers.length === 0 && (
            <div className="nx-admin-customers-empty">
              <div className="nx-admin-customers-empty-icon">
                <i className="bi bi-people" />
              </div>
              <h3>No customers found</h3>
              <p>
                Try changing your search or filter criteria.
              </p>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>

        {filteredCustomers.length > 0 && (
          <div className="nx-admin-customers-table-footer">
            <span>
              Showing{" "}
              <strong>
                {(safePage - 1) * rowsPerPage + 1}–
                {Math.min(safePage * rowsPerPage, filteredCustomers.length)}
              </strong>{" "}
              of <strong>{filteredCustomers.length}</strong> customers
            </span>

            <div className="nx-admin-customers-pagination">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                <i className="bi bi-chevron-left" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    type="button"
                    key={page}
                    className={safePage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCustomers;