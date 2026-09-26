import "./AdminDashboard.css";

const stats = [
  {
    title: "Total Revenue",
    value: "₹4.25M",
    change: "+12.8%",
    label: "vs last month",
    icon: "bi-graph-up-arrow",
  },
  {
    title: "Total Orders",
    value: "1,284",
    change: "+8.4%",
    label: "vs last month",
    icon: "bi-receipt",
  },
  {
    title: "Products",
    value: "300",
    change: "+16",
    label: "this month",
    icon: "bi-box-seam",
  },
  {
    title: "Pending Orders",
    value: "42",
    change: "-5.2%",
    label: "vs last month",
    icon: "bi-clock-history",
  },
];

const recentOrders = [
  {
    id: "ORD-10284",
    customer: "Rahul Sharma",
    amount: "₹78,500",
    status: "Processing",
    date: "22 Sep 2026",
  },
  {
    id: "ORD-10283",
    customer: "Priya Das",
    amount: "₹24,999",
    status: "Shipped",
    date: "22 Sep 2026",
  },
  {
    id: "ORD-10282",
    customer: "Amit Kumar",
    amount: "₹46,800",
    status: "Delivered",
    date: "21 Sep 2026",
  },
  {
    id: "ORD-10281",
    customer: "Sneha Patel",
    amount: "₹32,800",
    status: "Placed",
    date: "21 Sep 2026",
  },
  {
    id: "ORD-10280",
    customer: "Arjun Mehta",
    amount: "₹12,400",
    status: "Delivered",
    date: "20 Sep 2026",
  },
];

const orderStatus = [
  {
    label: "Delivered",
    count: 684,
    percentage: 53,
    className: "delivered",
  },
  {
    label: "Processing",
    count: 286,
    percentage: 22,
    className: "processing",
  },
  {
    label: "Shipped",
    count: 198,
    percentage: 15,
    className: "shipped",
  },
  {
    label: "Pending",
    count: 116,
    percentage: 10,
    className: "pending",
  },
];

const monthlySales = [
  { month: "Apr", value: 58 },
  { month: "May", value: 72 },
  { month: "Jun", value: 64 },
  { month: "Jul", value: 88 },
  { month: "Aug", value: 76 },
  { month: "Sep", value: 94 },
];

function AdminDashboard() {
  return (
    <div className="nx-admin-dashboard">

      {/* PAGE HEADER */}
      <div className="nx-admin-page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your store activity and performance.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-date-button"
        >
          <i className="bi bi-calendar3" />
          <span>September 2026</span>
          <i className="bi bi-chevron-down" />
        </button>
      </div>

      {/* STAT CARDS */}
      <section className="nx-admin-stat-grid">
        {stats.map((stat) => (
          <div
            className="nx-admin-stat-card"
            key={stat.title}
          >
            <div className="nx-admin-stat-top">
              <span className="nx-admin-stat-title">
                {stat.title}
              </span>

              <span className="nx-admin-stat-icon">
                <i className={`bi ${stat.icon}`} />
              </span>
            </div>

            <div className="nx-admin-stat-value">
              {stat.value}
            </div>

            <div className="nx-admin-stat-footer">
              <span className="nx-admin-stat-change">
                {stat.change}
              </span>

              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* MAIN DASHBOARD GRID */}
      <section className="nx-admin-dashboard-grid">

        {/* SALES OVERVIEW */}
        <div className="nx-admin-card nx-admin-sales-card">
          <div className="nx-admin-card-header">
            <div>
              <h2>Sales Overview</h2>
              <p>Monthly revenue performance</p>
            </div>

            <button
              type="button"
              className="nx-admin-card-filter"
            >
              Last 6 months
              <i className="bi bi-chevron-down" />
            </button>
          </div>

          <div className="nx-admin-sales-chart">
            <div className="nx-admin-chart-y-axis">
              <span>100k</span>
              <span>75k</span>
              <span>50k</span>
              <span>25k</span>
              <span>0</span>
            </div>

            <div className="nx-admin-chart-area">
              <div className="nx-admin-chart-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="nx-admin-chart-bars">
                {monthlySales.map((item) => (
                  <div
                    className="nx-admin-chart-column"
                    key={item.month}
                  >
                    <div
                      className="nx-admin-chart-bar"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="nx-admin-card nx-admin-status-card">
          <div className="nx-admin-card-header">
            <div>
              <h2>Order Status</h2>
              <p>Current order distribution</p>
            </div>

            <button
              type="button"
              className="nx-admin-more-button"
              aria-label="More options"
            >
              <i className="bi bi-three-dots" />
            </button>
          </div>

          <div className="nx-admin-status-content">
            <div className="nx-admin-status-donut">
              <div className="nx-admin-donut-center">
                <strong>1,284</strong>
                <span>Orders</span>
              </div>
            </div>

            <div className="nx-admin-status-list">
              {orderStatus.map((item) => (
                <div
                  className="nx-admin-status-row"
                  key={item.label}
                >
                  <div className="nx-admin-status-label">
                    <span
                      className={`nx-admin-status-dot ${item.className}`}
                    />

                    <span>{item.label}</span>
                  </div>

                  <div className="nx-admin-status-value">
                    <strong>{item.count}</strong>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ORDERS */}
      <section className="nx-admin-card nx-admin-orders-card">

        <div className="nx-admin-card-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest orders placed by customers</p>
          </div>

          <button
            type="button"
            className="nx-admin-view-all"
          >
            View all
            <i className="bi bi-arrow-right" />
          </button>
        </div>

        <div className="nx-admin-table-wrapper">
          <table className="nx-admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="nx-admin-order-number">
                      {order.id}
                    </span>
                  </td>

                  <td>
                    <div className="nx-admin-customer">
                      <div className="nx-admin-customer-avatar">
                        {order.customer.charAt(0)}
                      </div>

                      <span>{order.customer}</span>
                    </div>
                  </td>

                  <td>
                    <strong>{order.amount}</strong>
                  </td>

                  <td>
                    <span
                      className={`nx-admin-order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="nx-admin-order-date">
                    {order.date}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="nx-admin-row-action"
                      aria-label={`View ${order.id}`}
                    >
                      <i className="bi bi-arrow-up-right" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* BOTTOM CARDS */}
      <section className="nx-admin-bottom-grid">

        {/* QUICK SUMMARY */}
        <div className="nx-admin-card nx-admin-summary-card">
          <div className="nx-admin-card-header">
            <div>
              <h2>Store Summary</h2>
              <p>Current operational overview</p>
            </div>
          </div>

          <div className="nx-admin-summary-list">
            <div>
              <span>
                <i className="bi bi-credit-card" />
                Paid Orders
              </span>

              <strong>1,106</strong>
            </div>

            <div>
              <span>
                <i className="bi bi-truck" />
                Pending Shipments
              </span>

              <strong>32</strong>
            </div>

            <div>
              <span>
                <i className="bi bi-box-seam" />
                Low Stock Products
              </span>

              <strong>18</strong>
            </div>

            <div>
              <span>
                <i className="bi bi-headset" />
                Open Tickets
              </span>

              <strong>24</strong>
            </div>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="nx-admin-card nx-admin-products-summary">
          <div className="nx-admin-card-header">
            <div>
              <h2>Top Products</h2>
              <p>Best performing products</p>
            </div>

            <button
              type="button"
              className="nx-admin-more-button"
              aria-label="More options"
            >
              <i className="bi bi-three-dots" />
            </button>
          </div>

          <div className="nx-admin-product-summary-list">
            <div className="nx-admin-product-summary-item">
              <div className="nx-admin-product-number">
                01
              </div>

              <div className="nx-admin-product-info">
                <strong>Smart IoT Gateway Pro</strong>
                <span>128 orders</span>
              </div>

              <strong>₹24,999</strong>
            </div>

            <div className="nx-admin-product-summary-item">
              <div className="nx-admin-product-number">
                02
              </div>

              <div className="nx-admin-product-info">
                <strong>Industrial PoE Switch 8P</strong>
                <span>94 orders</span>
              </div>

              <strong>₹32,800</strong>
            </div>

            <div className="nx-admin-product-summary-item">
              <div className="nx-admin-product-number">
                03
              </div>

              <div className="nx-admin-product-info">
                <strong>Thermal Vision Array</strong>
                <span>72 orders</span>
              </div>

              <strong>₹46,800</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;