import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const [ready, setReady] = useState(false);

  // 상태가 복원될 때까지 기다리기
  useEffect(() => {
    if (isHydrated) {
      setReady(true);
    }
  }, [isHydrated]);

  if (!ready) return null; // 🌀 상태 복원 전에는 아무것도 렌더링하지 않음

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;