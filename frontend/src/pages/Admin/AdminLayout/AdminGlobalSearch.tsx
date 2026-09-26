import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  type: "Order" | "Product" | "Shipment" | "Ticket";
  icon: string;
  route: string;
};

const searchData: SearchItem[] = [
  // Orders
  {
    id: "ORD-10284",
    title: "ORD-10284",
    subtitle: "Rahul Sharma · ₹57,499 · Processing",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10284",
  },
  {
    id: "ORD-10283",
    title: "ORD-10283",
    subtitle: "Priya Das · ₹78,500 · Shipped",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10283",
  },
  {
    id: "ORD-10282",
    title: "ORD-10282",
    subtitle: "Amit Kumar · ₹42,150 · Delivered",
    type: "Order",
    icon: "bi-receipt",
    route: "/admin/orders/ORD-10282",
  },

  // Products
  {
    id: "laptop",
    title: "Laptop",
    subtitle: "Electronics · ₹55,000",
    type: "Product",
    icon: "bi-box-seam",
    route: "/admin/products/laptop",
  },
  {
    id: "smartphone",
    title: "Smartphone",
    subtitle: "Electronics · ₹25,000",
    type: "Product",
    icon: "bi-phone",
    route: "/admin/products/smartphone",
  },
  {
    id: "office-chair",
    title: "Office Chair",
    subtitle: "Hardware · ₹8,000",
    type: "Product",
    icon: "bi-chair",
    route: "/admin/products/office-chair",
  },

  // Shipments
  {
    id: "SHP-5001",
    title: "SHP-5001",
    subtitle: "ORD-10284 · BlueDart · In Transit",
    type: "Shipment",
    icon: "bi-truck",
    route: "/admin/shipments/SHP-5001",
  },

  // Tickets
  {
    id: "TKT-1001",
    title: "TKT-1001",
    subtitle: "Payment issue · Open",
    type: "Ticket",
    icon: "bi-headset",
    route: "/admin/tickets/TKT-1001",
  },
];

function AdminGlobalSearch() {
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredResults =
    query.trim().length === 0
      ? []
      : searchData.filter((item) => {
          const searchText =
            `${item.id} ${item.title} ${item.subtitle} ${item.type}`
              .toLowerCase();

          return searchText.includes(
            query.trim().toLowerCase()
          );
        });

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        inputRef.current?.focus();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const openResult = (item: SearchItem) => {
    setQuery("");
    setOpen(false);
    navigate(item.route);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!open || filteredResults.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setSelectedIndex((previous) =>
        previous < filteredResults.length - 1
          ? previous + 1
          : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setSelectedIndex((previous) =>
        previous > 0
          ? previous - 1
          : filteredResults.length - 1
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selected =
        filteredResults[selectedIndex];

      if (selected) {
        openResult(selected);
      }
    }
  };

  const groupedResults = filteredResults.reduce<
    Record<string, SearchItem[]>
  >((groups, item) => {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }

    groups[item.type].push(item);

    return groups;
  }, {});

  return (
    <div
      ref={searchRef}
      className="nx-admin-global-search"
    >
      <div className="nx-admin-search">
        <i className="bi bi-search" />

        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search..."
          aria-label="Search admin panel"
          onFocus={() => setOpen(true)}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        {query && (
          <button
            type="button"
            className="nx-admin-search-clear"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <i className="bi bi-x" />
          </button>
        )}

        {!query && (
          <span className="nx-admin-search-shortcut">
            Ctrl K
          </span>
        )}
      </div>

      {open && query.trim() && (
        <div className="nx-admin-search-results">
          {filteredResults.length > 0 ? (
            Object.entries(groupedResults).map(
              ([type, items]) => (
                <div
                  key={type}
                  className="nx-admin-search-group"
                >
                  <div className="nx-admin-search-group-title">
                    {type}s
                  </div>

                  {items.map((item) => {
                    const globalIndex =
                      filteredResults.findIndex(
                        (result) =>
                          result.id === item.id
                      );

                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`nx-admin-search-result ${
                          globalIndex ===
                          selectedIndex
                            ? "selected"
                            : ""
                        }`}
                        onMouseEnter={() =>
                          setSelectedIndex(
                            globalIndex
                          )
                        }
                        onClick={() =>
                          openResult(item)
                        }
                      >
                        <span className="nx-admin-search-result-icon">
                          <i
                            className={`bi ${item.icon}`}
                          />
                        </span>

                        <span className="nx-admin-search-result-content">
                          <strong>
                            {item.title}
                          </strong>

                          <small>
                            {item.subtitle}
                          </small>
                        </span>

                        <i className="bi bi-arrow-up-right" />
                      </button>
                    );
                  })}
                </div>
              )
            )
          ) : (
            <div className="nx-admin-search-empty">
              <div className="nx-admin-search-empty-icon">
                <i className="bi bi-search" />
              </div>

              <strong>
                No results found
              </strong>

              <span>
                Try searching by order ID,
                product name, shipment ID or
                ticket ID.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminGlobalSearch;