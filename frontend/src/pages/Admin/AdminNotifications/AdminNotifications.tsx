import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNotifications.css";

type NotificationType =
  | "order"
  | "payment"
  | "shipment"
  | "ticket";

type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  route: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    message: "ORD-10284 · Rahul Sharma · ₹57,499",
    time: "5 min ago",
    route: "/admin/orders/ORD-10284",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment pending",
    message: "ORD-10281 · ₹12,400",
    time: "18 min ago",
    route: "/admin/orders/ORD-10281",
    read: false,
  },
  {
    id: 3,
    type: "shipment",
    title: "Shipment status updated",
    message: "SHP-5001 · BlueDart · In Transit",
    time: "32 min ago",
    route: "/admin/shipments/SHP-5001",
    read: true,
  },
  {
    id: 4,
    type: "ticket",
    title: "New support ticket",
    message: "TKT-1001 · Payment issue",
    time: "45 min ago",
    route: "/admin/tickets/TKT-1001",
    read: false,
  },
];

function AdminNotifications() {
  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(() => {
      const saved = localStorage.getItem(
        "nexus-admin-notifications"
      );

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialNotifications;
        }
      }

      return initialNotifications;
    });

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    localStorage.setItem(
      "nexus-admin-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
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

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return "bi-receipt";

      case "payment":
        return "bi-credit-card";

      case "shipment":
        return "bi-truck";

      case "ticket":
        return "bi-headset";

      default:
        return "bi-bell";
    }
  };

  const handleNotificationClick = (
    notification: NotificationItem
  ) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
    );

    setOpen(false);
    navigate(notification.route);
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (
    event: React.MouseEvent,
    id: number
  ) => {
    event.stopPropagation();

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <div
      ref={notificationRef}
      className="nx-admin-notifications"
    >
      <button
        type="button"
        className="nx-admin-icon-button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() =>
          setOpen((previous) => !previous)
        }
      >
        <i className="bi bi-bell" />

        {unreadCount > 0 && (
          <span className="nx-admin-notification-dot" />
        )}
      </button>

      {open && (
        <div className="nx-admin-notification-panel">
          <div className="nx-admin-notification-header">
            <div>
              <strong>Notifications</strong>

              {unreadCount > 0 && (
                <span>{unreadCount} unread</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="nx-admin-notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`nx-admin-notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(
                      notification
                    )
                  }
                >
                  <span
                    className={`nx-admin-notification-icon ${notification.type}`}
                  >
                    <i
                      className={`bi ${getIcon(
                        notification.type
                      )}`}
                    />
                  </span>

                  <span className="nx-admin-notification-content">
                    <strong>
                      {notification.title}
                    </strong>

                    <span>
                      {notification.message}
                    </span>

                    <small>
                      {notification.time}
                    </small>
                  </span>

                  {!notification.read && (
                    <span
                      className="nx-admin-notification-unread"
                      onClick={(event) =>
                        markAsRead(
                          event,
                          notification.id
                        )
                      }
                      title="Mark as read"
                    />
                  )}
                </button>
              ))
            ) : (
              <div className="nx-admin-notification-empty">
                <i className="bi bi-bell-slash" />

                <strong>
                  No notifications
                </strong>

                <span>
                  You're all caught up.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;