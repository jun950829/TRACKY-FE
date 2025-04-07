// src/Routing.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import About from "./pages/About";
import CarMain from "./pages/car/CarMain";
import CarRegister from "./pages/car/CarRegister";
import RentMain from "./pages/rent/RentMain";
import RentRegister from "./pages/rent/RentRegister";
import Emulator from "./pages/emulator/Emulator";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import DashboardMain from "./pages/dashboard/DashBoardMain";
import Home from "./pages/Home";
import { useAuthStore } from "./stores/useAuthStore";
import HistoryMain from "./pages/history/HistoryMain";
import InfoMain from "./pages/info/InfoMain";
import AdminMain from "./pages/admin/AdminMain";
import AdminRoute from "./components/AdminRoute";

// 로그인 없이 접근 가능한 라우트들
const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/emulator", element: <Emulator /> },
  { path: "/info", element: <InfoMain /> },
];

// 로그인 후에만 접근 가능한 라우트들
const protectedRoutes = [
  { path: "/dashboard", element: <DashboardMain /> },
  { path: "/cars", element: <CarMain /> },
  { path: "/cars/register", element: <CarRegister /> },
  { path: "/rents", element: <RentMain /> },
  { path: "/rents/register", element: <RentRegister /> },
  { path: "/history", element: <HistoryMain /> },
];

// 관리자 로그인 후에만 접근 가능한 라우트들
const adminRoutes = [
  { path: "/admin", element: <AdminMain /> },
];

function Routing() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return null; // Wait for Zustand to hydrate from localStorage
  }

  return (
    <Routes>
      {/* 공개 라우트 */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* 보호된 라우트 */}
      {protectedRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
      ))} 

      {/* 관리자 라우트 */}
      {adminRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<AdminRoute>{element}</AdminRoute>} />
      ))}
    </Routes>
  );
}

export default Routing;
