import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const isAdmin = useAuthStore((state) => state.member?.role === "ADMIN");

  if (!token && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;