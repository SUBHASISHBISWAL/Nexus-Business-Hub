import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminInventory.css";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

type InventoryItem = {
  id: string;
  sku: string;
  product: string;
  category: string;
  warehouse: string;
  totalStock: number;
  reserved: number;
  reorderLevel: number;
  lastUpdated: string;
};

const inventoryData: InventoryItem[] = [
  {
    id: "PRD-1001",
    sku: "NB-LEN-001",
    product: "Lenovo ThinkPad E14",
    category: "Electronics",
    warehouse: "Delhi Warehouse",
    totalStock: 48,
    reserved: 12,
    reorderLevel: 15,
    lastUpdated: "18 Sep 2026",
  },
  {
    id: "PRD-1002",
    sku: "PH-SAM-002",
    product: "Samsung Galaxy S24",
    category: "Electronics",
    warehouse: "Mumbai Warehouse",
    totalStock: 32,
    reserved: 8,
    reorderLevel: 12,
    lastUpdated: "18 Sep 2026",
  },
  {
    id: "PRD-1003",
    sku: "MON-LG-003",
    product: "LG UltraWide Monitor",
    category: "Electronics",
    warehouse: "Delhi Warehouse",
    totalStock: 7,
    reserved: 3,
    reorderLevel: 10,
    lastUpdated: "17 Sep 2026",
  },
  {
    id: "PRD-1004",
    sku: "KB-LOG-004",
    product: "Logitech MX Keys",
    category: "Accessories",
    warehouse: "Bangalore Warehouse",
    totalStock: 64,
    reserved: 9,
    reorderLevel: 20,
    lastUpdated: "17 Sep 2026",
  },
  {
    id: "PRD-1005",
    sku: "MS-365-005",
    product: "Microsoft 365 Business Standard",
    category: "Software",
    warehouse: "Digital Inventory",
    totalStock: 125,
    reserved: 18,
    reorderLevel: 25,
    lastUpdated: "16 Sep 2026",
  },
  {
    id: "PRD-1006",
    sku: "SSD-SAM-006",
    product: "Samsung 990 Pro 1TB SSD",
    category: "Hardware",
    warehouse: "Delhi Warehouse",
    totalStock: 18,
    reserved: 6,
    reorderLevel: 15,
    lastUpdated: "16 Sep 2026",
  },
  {
    id: "PRD-1007",
    sku: "RAM-COR-007",
    product: "Corsair Vengeance 32GB",
    category: "Hardware",
    warehouse: "Mumbai Warehouse",
    totalStock: 5,
    reserved: 2,
    reorderLevel: 10,
    lastUpdated: "15 Sep 2026",
  },
  {
    id: "PRD-1008",
    sku: "MSK-LOG-008",
    product: "Logitech MX Master 3S",
    category: "Accessories",
    warehouse: "Bangalore Warehouse",
    totalStock: 39,
    reserved: 7,
    reorderLevel: 12,
    lastUpdated: "15 Sep 2026",
  },
  {
    id: "PRD-1009",
    sku: "WIN-ENT-009",
    product: "Windows 11 Enterprise",
    category: "Software",
    warehouse: "Digital Inventory",
    totalStock: 0,
    reserved: 0,
    reorderLevel: 10,
    lastUpdated: "14 Sep 2026",
  },
  {
    id: "PRD-1010",
    sku: "UPS-APC-010",
    product: "APC 1100VA UPS",
    category: "Hardware",
    warehouse: "Delhi Warehouse",
    totalStock: 24,
    reserved: 4,
    reorderLevel: 8,
    lastUpdated: "14 Sep 2026",
  },
];

const getAvailableStock = (item: InventoryItem) =>
  Math.max(item.totalStock - item.reserved, 0);

const getStockStatus = (item: InventoryItem): StockStatus => {
  const available = getAvailableStock(item);

  if (available === 0) {
    return "Out of Stock";
  }

  if (available <= item.reorderLevel) {
    return "Low Stock";
  }

  return "In Stock";
};

function AdminInventory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [warehouse, setWarehouse] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventoryData.filter((item) => {
      const matchesSearch =
        query === "" ||
        item.id.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.product.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.warehouse.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesWarehouse =
        warehouse === "All" || item.warehouse === warehouse;

      const itemStatus = getStockStatus(item);

      const matchesStatus =
        status === "All" || itemStatus === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesWarehouse &&
        matchesStatus
      );
    });
  }, [search, category, warehouse, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / rowsPerPage)
  );

  const visibleInventory = filteredInventory.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalProducts = inventoryData.length;

  const totalUnits = inventoryData.reduce(
    (sum, item) => sum + item.totalStock,
    0
  );

  const lowStock = inventoryData.filter(
    (item) => getStockStatus(item) === "Low Stock"
  ).length;

  const outOfStock = inventoryData.filter(
    (item) => getStockStatus(item) === "Out of Stock"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setWarehouse("All");
    setStatus("All");
    setCurrentPage(1);
  };

  const exportInventory = () => {
    const headers = [
      "Product ID",
      "SKU",
      "Product",
      "Category",
      "Warehouse",
      "Total Stock",
      "Reserved",
      "Available",
      "Reorder Level",
      "Status",
      "Last Updated",
    ];

    const rows = filteredInventory.map((item) => [
      item.id,
      item.sku,
      item.product,
      item.category,
      item.warehouse,
      item.totalStock,
      item.reserved,
      getAvailableStock(item),
      item.reorderLevel,
      getStockStatus(item),
      item.lastUpdated,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexus-inventory.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="nx-admin-inventory-page">

      {/* Breadcrumb */}
      <div className="nx-admin-inventory-breadcrumb">
        <span>Admin</span>
        <i className="bi bi-chevron-right" />
        <span>Operations</span>
        <i className="bi bi-chevron-right" />
        <span className="nx-admin-inventory-breadcrumb-current">
          Inventory
        </span>
      </div>

      {/* Header */}
      <div className="nx-admin-inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>
            Monitor stock levels and inventory availability across
            warehouses.
          </p>
        </div>

        <button
          type="button"
          className="nx-admin-inventory-export-btn"
          onClick={exportInventory}
        >
          <i className="bi bi-download" />
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="nx-admin-inventory-summary-grid">

        <div className="nx-admin-inventory-summary-card">
          <span className="nx-admin-inventory-summary-label">
            Total Products
          </span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="nx-admin-inventory-summary-card">
          <span className="nx-admin-inventory-summary-label">
            Total Units
          </span>
          <strong>{totalUnits.toLocaleString("en-IN")}</strong>
        </div>

        <div className="nx-admin-inventory-summary-card">
          <span className="nx-admin-inventory-summary-label">
            Low Stock
          </span>
          <strong>{lowStock}</strong>
        </div>

        <div className="nx-admin-inventory-summary-card">
          <span className="nx-admin-inventory-summary-label">
            Out of Stock
          </span>
          <strong>{outOfStock}</strong>
        </div>

      </div>

      {/* Main Card */}
      <div className="nx-admin-inventory-card">

        {/* Filters */}
        <div className="nx-admin-inventory-filters">

          <div className="nx-admin-inventory-search">
            <i className="bi bi-search" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search product, SKU or warehouse..."
            />
          </div>

          <select
            className="nx-admin-inventory-filter-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            className="nx-admin-inventory-filter-select"
            value={warehouse}
            onChange={(e) => {
              setWarehouse(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Warehouses</option>
            <option value="Delhi Warehouse">
              Delhi Warehouse
            </option>
            <option value="Mumbai Warehouse">
              Mumbai Warehouse
            </option>
            <option value="Bangalore Warehouse">
              Bangalore Warehouse
            </option>
            <option value="Digital Inventory">
              Digital Inventory
            </option>
          </select>

          <select
            className="nx-admin-inventory-filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

          <button
            type="button"
            className="nx-admin-inventory-clear-btn"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>

        {/* Table */}
        {visibleInventory.length > 0 ? (
          <div className="nx-admin-inventory-table-wrap">
            <table className="nx-admin-inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Warehouse</th>
                  <th>Total Stock</th>
                  <th>Reserved</th>
                  <th>Available</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleInventory.map((item) => {
                  const available = getAvailableStock(item);
                  const itemStatus = getStockStatus(item);

                  return (
                    <tr key={item.id}>

                      <td>
                        <div className="nx-admin-inventory-product">
                          <strong>{item.product}</strong>
                          <span>{item.id}</span>
                        </div>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-sku">
                          {item.sku}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-category">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-warehouse">
                          {item.warehouse}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-total">
                          {item.totalStock}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-reserved">
                          {item.reserved}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`nx-admin-inventory-available ${
                            available === 0
                              ? "zero"
                              : available <= item.reorderLevel
                              ? "low"
                              : ""
                          }`}
                        >
                          {available}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-reorder">
                          {item.reorderLevel}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`nx-inventory-status ${itemStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {itemStatus}
                        </span>
                      </td>

                      <td>
                        <span className="nx-admin-inventory-date">
                          {item.lastUpdated}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="nx-admin-inventory-view-btn"
                          onClick={() =>
                            navigate(
                              `/admin/inventory/${item.id}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="nx-admin-inventory-empty">
            <i className="bi bi-box-seam" />

            <h3>No inventory records found</h3>

            <p>
              Try changing your search or filter criteria.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Footer */}
        {filteredInventory.length > 0 && (
          <div className="nx-admin-inventory-table-footer">

            <span>
              Showing{" "}
              <strong>
                {(currentPage - 1) * rowsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  currentPage * rowsPerPage,
                  filteredInventory.length
                )}
              </strong>{" "}
              of{" "}
              <strong>{filteredInventory.length}</strong>{" "}
              records
            </span>

            <div className="nx-admin-inventory-pagination">

              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
              >
                <i className="bi bi-chevron-left" />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    currentPage === page ? "active" : ""
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
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

export default AdminInventory;