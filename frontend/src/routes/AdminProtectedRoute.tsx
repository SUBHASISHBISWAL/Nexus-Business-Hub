import { Navigate, Outlet } from "react-router-dom";
import { validateCurrentSession } from "../utils/auth";

export default function AdminProtectedRoute() {
  const { isAuthenticated, user } = validateCurrentSession();
  const hasAdminRole = user?.role?.toLowerCase() === "admin";

  if (!isAuthenticated || !hasAdminRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}