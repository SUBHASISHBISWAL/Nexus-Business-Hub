import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CustomerDetails.css";

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
  address: string;
  city: string;
  state: string;
  pincode: string;
  company?: string;
}

interface RecentOrder {
  id: string;
  date: string;
  items: number;
  total: number;
  payment: "Paid" | "Pending" | "Failed";
  status: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
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
    address: "42, Green Park Extension",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
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
    address: "18, Lake View Road",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700029",
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
    address: "Tech Park, Sector 62",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201309",
    company: "TechCorp Solutions",
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
    address: "24, Satellite Road",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
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
    address: "Plot 18, Industrial Area",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122001",
    company: "Arjun Enterprises",
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
    address: "7, Civil Lines",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
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
    address: "15, Main Road",
    city: "Bhubaneswar",
    state: "Odisha",
    pincode: "751001",
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
    address: "22, Business District",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700091",
    company: "BusinessHub India",
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
    address: "31, Vasant Vihar",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110057",
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
    address: "12, Park Street",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700016",
    company: "Kavita Solutions",
  },
];

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-10284",
    date: "18 Sep 2026",
    items: 2,
    total: 57499,
    payment: "Paid",
    status: "Shipped",
  },
  {
    id: "ORD-10261",
    date: "10 Sep 2026",
    items: 1,
    total: 38500,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "ORD-10235",
    date: "02 Sep 2026",
    items: 3,
    total: 72450,
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "ORD-10198",
    date: "24 Aug 2026",
    items: 2,
    total: 46800,
    payment: "Paid",
    status: "Delivered",
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

function CustomerDetails() {
  const navigate = useNavigate();
  const { customerId } = useParams<{ customerId: string }>();

  const customer = useMemo(
    () =>
      customers.find(
        (item) =>
          item.id.toLowerCase() === (customerId ?? "").toLowerCase()
      ),
    [customerId]
  );

  if (!customer) {
    return (
      <div className="nx-customer-details-page">
        <div className="nx-customer-details-breadcrumb">
          <span>Admin</span>
          <i className="bi bi-chevron-right" />
          <span>Commerce</span>
          <i className="bi bi-chevron-right" />
          <span>Customers</span>
          <i className="bi bi-chevron-right" />
          <span className="nx-customer-details-breadcrumb-current">
            Customer Details
          </span>
        </div>

        <div className="nx-customer-details-not-found">
          <div className="nx-customer-details-not-found-icon">
            <i className="bi bi-person-x" />
          </div>

          <h2>Customer not found</h2>

          <p>
            The customer record you are looking for could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
          >
            <i className="bi bi-arrow-left" />
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nx-customer-details-page">
      {/* ================= BREADCRUMB ================= */}

      <div className="nx-customer-details-breadcrumb">
        <span>Admin</span>
        <i className="bi bi-chevron-right" />
        <span>Commerce</span>
        <i className="bi bi-chevron-right" />
        <span
          className="nx-customer-details-breadcrumb-link"
          onClick={() => navigate("/admin/customers")}
        >
          Customers
        </span>
        <i className="bi bi-chevron-right" />
        <span className="nx-customer-details-breadcrumb-current">
          {customer.id}
        </span>
      </div>

      {/* ================= HEADER ================= */}

      <div className="nx-customer-details-header">
        <div className="nx-customer-details-title-area">
          <button
            type="button"
            className="nx-customer-details-back-button"
            onClick={() => navigate("/admin/customers")}
            aria-label="Back to customers"
          >
            <i className="bi bi-arrow-left" />
          </button>

          <div>
            <div className="nx-customer-details-title-line">
              <h1>{customer.name}</h1>

              <span
                className={`nx-customer-details-status ${customer.status.toLowerCase()}`}
              >
                <span className="nx-customer-details-status-dot" />
                {customer.status}
              </span>
            </div>

            <p>
              Customer ID:{" "}
              <strong>{customer.id}</strong>
            </p>
          </div>
        </div>

        <div className="nx-customer-details-header-actions">
          <button
            type="button"
            className="nx-customer-details-secondary-button"
            onClick={() =>
              alert("Customer account editing will be connected to the API.")
            }
          >
            <i className="bi bi-pencil" />
            Edit Customer
          </button>

          <button
            type="button"
            className="nx-customer-details-primary-button"
            onClick={() =>
              alert("Customer communication will be connected to the API.")
            }
          >
            <i className="bi bi-envelope" />
            Contact Customer
          </button>
        </div>
      </div>

      {/* ================= PROFILE SUMMARY ================= */}

      <div className="nx-customer-profile-card">
        <div className="nx-customer-profile-main">
          <div className="nx-customer-profile-avatar">
            {getInitials(customer.name)}
          </div>

          <div className="nx-customer-profile-info">
            <h2>{customer.name}</h2>

            <div className="nx-customer-profile-meta">
              <span>
                <i className="bi bi-envelope" />
                {customer.email}
              </span>

              <span>
                <i className="bi bi-telephone" />
                {customer.phone}
              </span>

              <span>
                <i
                  className={
                    customer.type === "Business"
                      ? "bi bi-building"
                      : "bi bi-person"
                  }
                />
                {customer.type}
              </span>
            </div>

            {customer.company && (
              <div className="nx-customer-company">
                <i className="bi bi-building" />
                {customer.company}
              </div>
            )}
          </div>
        </div>

        <div className="nx-customer-profile-registered">
          <span>Registered</span>
          <strong>{customer.registered}</strong>
        </div>
      </div>

      {/* ================= CONTENT GRID ================= */}

      <div className="nx-customer-details-layout">
        <div className="nx-customer-details-main">
          {/* ================= CUSTOMER OVERVIEW ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Customer Overview</h2>
                <span>Account activity and lifetime value</span>
              </div>
            </div>

            <div className="nx-customer-overview-grid">
              <div className="nx-customer-overview-item">
                <span>Total Orders</span>
                <strong>{customer.orders}</strong>
              </div>

              <div className="nx-customer-overview-item">
                <span>Total Spent</span>
                <strong>{formatCurrency(customer.totalSpent)}</strong>
              </div>

              <div className="nx-customer-overview-item">
                <span>Average Order Value</span>
                <strong>
                  {formatCurrency(
                    Math.round(customer.totalSpent / customer.orders)
                  )}
                </strong>
              </div>

              <div className="nx-customer-overview-item">
                <span>Last Order</span>
                <strong>{customer.lastOrder}</strong>
              </div>
            </div>
          </section>

          {/* ================= RECENT ORDERS ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Recent Orders</h2>
                <span>Latest orders placed by this customer</span>
              </div>

              <button
                type="button"
                className="nx-customer-view-all-button"
                onClick={() => navigate("/admin/orders")}
              >
                View All
                <i className="bi bi-arrow-right" />
              </button>
            </div>

            <div className="nx-customer-orders-table-wrap">
              <table className="nx-customer-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <button
                          type="button"
                          className="nx-customer-order-id"
                          onClick={() =>
                            navigate(`/admin/orders/${order.id}`)
                          }
                        >
                          {order.id}
                        </button>
                      </td>

                      <td>
                        <span className="nx-customer-order-date">
                          {order.date}
                        </span>
                      </td>

                      <td>
                        <span className="nx-customer-order-items">
                          {order.items}
                        </span>
                      </td>

                      <td>
                        <strong className="nx-customer-order-total">
                          {formatCurrency(order.total)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`nx-customer-payment-badge ${order.payment.toLowerCase()}`}
                        >
                          {order.payment}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`nx-customer-order-status ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="nx-customer-order-view"
                          onClick={() =>
                            navigate(`/admin/orders/${order.id}`)
                          }
                        >
                          View
                          <i className="bi bi-arrow-right" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ================= SIDEBAR ================= */}

        <aside className="nx-customer-details-sidebar">
          {/* ================= CONTACT INFORMATION ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Contact Information</h2>
                <span>Customer contact details</span>
              </div>
            </div>

            <div className="nx-customer-contact-list">
              <div className="nx-customer-contact-item">
                <div className="nx-customer-contact-icon">
                  <i className="bi bi-envelope" />
                </div>

                <div>
                  <span>Email Address</span>
                  <strong>{customer.email}</strong>
                </div>
              </div>

              <div className="nx-customer-contact-item">
                <div className="nx-customer-contact-icon">
                  <i className="bi bi-telephone" />
                </div>

                <div>
                  <span>Phone Number</span>
                  <strong>{customer.phone}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* ================= ADDRESS ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Address</h2>
                <span>Default delivery address</span>
              </div>
            </div>

            <div className="nx-customer-address">
              <div className="nx-customer-address-icon">
                <i className="bi bi-geo-alt" />
              </div>

              <div>
                <strong>{customer.address}</strong>

                <span>
                  {customer.city}, {customer.state}
                </span>

                <span>{customer.pincode}</span>
              </div>
            </div>
          </section>

          {/* ================= ACCOUNT STATUS ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Account Status</h2>
                <span>Current account configuration</span>
              </div>
            </div>

            <div className="nx-customer-account-status">
              <div
                className={`nx-customer-account-status-icon ${customer.status.toLowerCase()}`}
              >
                <i
                  className={
                    customer.status === "Active"
                      ? "bi bi-check-circle"
                      : "bi bi-pause-circle"
                  }
                />
              </div>

              <div>
                <strong>{customer.status} Account</strong>

                <span>
                  {customer.status === "Active"
                    ? "Customer can place orders and access the account."
                    : "Customer account is currently inactive."}
                </span>
              </div>
            </div>
          </section>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="nx-customer-details-card">
            <div className="nx-customer-details-card-header">
              <div>
                <h2>Quick Actions</h2>
                <span>Common customer operations</span>
              </div>
            </div>

            <div className="nx-customer-quick-actions">
              <button
                type="button"
                onClick={() =>
                  alert("Customer order creation will be connected to the API.")
                }
              >
                <span>
                  <i className="bi bi-plus-circle" />
                  Create Order
                </span>
                <i className="bi bi-chevron-right" />
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Customer ticket creation will be connected to the API.")
                }
              >
                <span>
                  <i className="bi bi-headset" />
                  Create Support Ticket
                </span>
                <i className="bi bi-chevron-right" />
              </button>

              <button
                type="button"
                onClick={() =>
                  alert("Customer communication will be connected to the API.")
                }
              >
                <span>
                  <i className="bi bi-envelope" />
                  Send Message
                </span>
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default CustomerDetails;