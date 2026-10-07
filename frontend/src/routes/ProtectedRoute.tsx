import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { validateCurrentSession } from "../utils/auth";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = validateCurrentSession();

  if (!isAuthenticated) {
    const returnPath = location.pathname + (location.search || "");
    const returnUrlParam =
      returnPath.includes("?") || returnPath.includes("&")
        ? encodeURIComponent(returnPath)
        : returnPath;

    return <Navigate to={`/login?returnUrl=${returnUrlParam}`} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
