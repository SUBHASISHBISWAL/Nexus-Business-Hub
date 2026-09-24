import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminShipments.css";

type Shipment = {
  id: string;
  orderId: string;
  customer: string;
  carrier: string;
  trackingNumber: string;
  status: "Pending" | "Packed" | "Shipped" | "In Transit" | "Delivered" | "Delayed";
  origin: string;
  destination: string;
  estimatedDelivery: string;
  shippedDate: string;
};

const shipments: Shipment[] = [
  {
    id: "SHP-5001",
    orderId: "ORD-10284",
    customer: "Rahul Sharma",
    carrier: "BlueDart",
    trackingNumber: "BD784512369IN",
    status: "In Transit",
    origin: "Delhi",
    destination: "Noida",
    estimatedDelivery: "20 Sep 2026",
    shippedDate: "18 Sep 2026",
  },
  {
    id: "SHP-5002",
    orderId: "ORD-10283",
    customer: "Priya Das",
    carrier: "Delhivery",
    trackingNumber: "DL562891347IN",
    status: "Shipped",
    origin: "Kolkata",
    destination: "Bhubaneswar",
    estimatedDelivery: "21 Sep 2026",
    shippedDate: "18 Sep 2026",
  },
  {
    id: "SHP-5003",
    orderId: "ORD-10282",
    customer: "Amit Kumar",
    carrier: "DTDC",
    trackingNumber: "DT892341765IN",
    status: "Delivered",
    origin: "Mumbai",
    destination: "Pune",
    estimatedDelivery: "18 Sep 2026",
    shippedDate: "16 Sep 2026",
  },
  {
    id: "SHP-5004",
    orderId: "ORD-10281",
    customer: "Sneha Patel",
    carrier: "BlueDart",
    trackingNumber: "BD456781239IN",
    status: "Pending",
    origin: "Ahmedabad",
    destination: "Surat",
    estimatedDelivery: "23 Sep 2026",
    shippedDate: "-",
  },
  {
    id: "SHP-5005",
    orderId: "ORD-10280",
    customer: "Arjun Singh",
    carrier: "FedEx",
    trackingNumber: "FX893451267IN",
    status: "Delivered",
    origin: "Bengaluru",
    destination: "Hyderabad",
    estimatedDelivery: "18 Sep 2026",
    shippedDate: "16 Sep 2026",
  },
  {
    id: "SHP-5006",
    orderId: "ORD-10279",
    customer: "Neha Mishra",
    carrier: "Delhivery",
    trackingNumber: "DL782345619IN",
    status: "In Transit",
    origin: "Delhi",
    destination: "Jaipur",
    estimatedDelivery: "21 Sep 2026",
    shippedDate: "17 Sep 2026",
  },
  {
    id: "SHP-5007",
    orderId: "ORD-10278",
    customer: "Vikash Rout",
    carrier: "DTDC",
    trackingNumber: "DT671239845IN",
    status: "Delayed",
    origin: "Bhubaneswar",
    destination: "Ranchi",
    estimatedDelivery: "19 Sep 2026",
    shippedDate: "15 Sep 2026",
  },
  {
    id: "SHP-5008",
    orderId: "ORD-10277",
    customer: "Ananya Roy",
    carrier: "BlueDart",
    trackingNumber: "BD982341756IN",
    status: "Packed",
    origin: "Kolkata",
    destination: "Delhi",
    estimatedDelivery: "22 Sep 2026",
    shippedDate: "18 Sep 2026",
  },
  {
    id: "SHP-5009",
    orderId: "ORD-10276",
    customer: "Sourav Das",
    carrier: "FedEx",
    trackingNumber: "FX561278934IN",
    status: "Delivered",
    origin: "Chennai",
    destination: "Bengaluru",
    estimatedDelivery: "17 Sep 2026",
    shippedDate: "15 Sep 2026",
  },
  {
    id: "SHP-5010",
    orderId: "ORD-10275",
    customer: "Ritika Singh",
    carrier: "Delhivery",
    trackingNumber: "DL345678921IN",
    status: "Pending",
    origin: "Delhi",
    destination: "Lucknow",
    estimatedDelivery: "23 Sep 2026",
    shippedDate: "-",
  },
  {
    id: "SHP-5011",
    orderId: "ORD-10274",
    customer: "Manish Gupta",
    carrier: "BlueDart",
    trackingNumber: "BD763452189IN",
    status: "In Transit",
    origin: "Mumbai",
    destination: "Nagpur",
    estimatedDelivery: "20 Sep 2026",
    shippedDate: "17 Sep 2026",
  },
  {
    id: "SHP-5012",
    orderId: "ORD-10273",
    customer: "Karan Mehta",
    carrier: "DTDC",
    trackingNumber: "DT912345678IN",
    status: "Shipped",
    origin: "Pune",
    destination: "Mumbai",
    estimatedDelivery: "21 Sep 2026",
    shippedDate: "18 Sep 2026",
  },
];

const statusOptions = [
  "All",
  "Pending",
  "Packed",
  "Shipped",
  "In Transit",
  "Delivered",
  "Delayed",
];

const carrierOptions = [
  "All",
  "BlueDart",
  "Delhivery",
  "DTDC",
  "FedEx",
];

function AdminShipments() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [carrier, setCarrier] = useState("All");
  const [page, setPage] = useState(1);

  const shipmentsPerPage = 8;

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return shipments.filter((shipment) => {
      const matchesSearch =
        !query ||
        shipment.id.toLowerCase().includes(query) ||
        shipment.orderId.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.trackingNumber.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || shipment.status === status;

      const matchesCarrier =
        carrier === "All" || shipment.carrier === carrier;

      return matchesSearch && matchesStatus && matchesCarrier;
    });
  }, [search, status, carrier]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredShipments.length / shipmentsPerPage)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * shipmentsPerPage,
    currentPage * shipmentsPerPage
  );

  const totalShipments = filteredShipments.length;

  const deliveredCount = filteredShipments.filter(
    (shipment) => shipment.status === "Delivered"
  ).length;

  const inTransitCount = filteredShipments.filter(
    (shipment) => shipment.status === "In Transit"
  ).length;

  const pendingCount = filteredShipments.filter(
    (shipment) =>
      shipment.status === "Pending" ||
      shipment.status === "Packed"
  ).length;

  const delayedCount = filteredShipments.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setCarrier("All");
    setPage(1);
  };

  return (
    <div className="nx-admin-shipments">
      {/* HEADER */}
      <div className="nx-shipments-header">
        <div>
          <h1>Shipments</h1>
          <p>
            Monitor deliveries, tracking information and shipment
            status.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="nx-shipments-summary">
        <div className="nx-shipment-summary-card">
          <span>Total Shipments</span>
          <strong>{totalShipments}</strong>
          <small>All active shipments</small>
        </div>

        <div className="nx-shipment-summary-card">
          <span>In Transit</span>
          <strong>{inTransitCount}</strong>
          <small>Currently moving</small>
        </div>

        <div className="nx-shipment-summary-card">
          <span>Delivered</span>
          <strong>{deliveredCount}</strong>
          <small>Successfully delivered</small>
        </div>

        <div className="nx-shipment-summary-card">
          <span>Pending / Packed</span>
          <strong>{pendingCount}</strong>
          <small>Awaiting dispatch</small>
        </div>

        <div className="nx-shipment-summary-card warning">
          <span>Delayed</span>
          <strong>{delayedCount}</strong>
          <small>Needs attention</small>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="nx-shipments-toolbar">
        <div className="nx-shipments-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search shipment, order, customer..."
          />
        </div>

        <div className="nx-shipment-filter">
          <label>Status</label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="nx-shipment-filter">
          <label>Carrier</label>

          <select
            value={carrier}
            onChange={(event) => {
              setCarrier(event.target.value);
              setPage(1);
            }}
          >
            {carrierOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="nx-clear-shipments"
          onClick={resetFilters}
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="nx-shipments-card">
        <div className="nx-shipments-table-wrapper">
          <table className="nx-shipments-table">
            <thead>
              <tr>
                <th>Shipment</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Carrier</th>
                <th>Tracking Number</th>
                <th>Status</th>
                <th>Destination</th>
                <th>Est. Delivery</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {paginatedShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>
                    <button
                      type="button"
                      className="nx-shipment-id"
                      onClick={() =>
                        navigate(
                          `/admin/shipments/${shipment.id}`
                        )
                      }
                    >
                      {shipment.id}
                    </button>

                    <span className="nx-shipment-date">
                      Shipped: {shipment.shippedDate}
                    </span>
                  </td>

                  <td>
                    <span className="nx-shipment-order">
                      {shipment.orderId}
                    </span>
                  </td>

                  <td>
                    <div className="nx-shipment-customer">
                      <strong>{shipment.customer}</strong>

                      <span>
                        {shipment.origin} →{" "}
                        {shipment.destination}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="nx-carrier-name">
                      {shipment.carrier}
                    </span>
                  </td>

                  <td>
                    <span className="nx-tracking-number">
                      {shipment.trackingNumber}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`nx-shipment-status ${shipment.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {shipment.status}
                    </span>
                  </td>

                  <td>
                    <span className="nx-destination">
                      {shipment.destination}
                    </span>
                  </td>

                  <td>
                    <span className="nx-estimated-date">
                      {shipment.estimatedDelivery}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="nx-view-shipment"
                      onClick={() =>
                        navigate(
                          `/admin/shipments/${shipment.id}`
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* EMPTY */}
          {!paginatedShipments.length && (
            <div className="nx-shipments-empty">
              <div className="nx-empty-icon">□</div>

              <h3>No shipments found</h3>

              <p>
                Try changing your search or shipment filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {filteredShipments.length > 0 && (
          <div className="nx-shipments-pagination">
            <span>
              Showing{" "}
              {(currentPage - 1) * shipmentsPerPage + 1} -{" "}
              {Math.min(
                currentPage * shipmentsPerPage,
                filteredShipments.length
              )}{" "}
              of {filteredShipments.length}
            </span>

            <div className="nx-pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setPage((previous) => previous - 1)
                }
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={
                    pageNumber === currentPage ? "active" : ""
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((previous) => previous + 1)
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminShipments;