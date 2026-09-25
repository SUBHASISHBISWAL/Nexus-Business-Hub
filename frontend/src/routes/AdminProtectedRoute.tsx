import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const isAdmin = localStorage.getItem("isAdmin");

  if (isAdmin !== "true") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}