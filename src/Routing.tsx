// src/Routing.tsx
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";

import Layout from "@/components/Layout";
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

import HistoryMain from "./pages/history/HistoryMain";
import InfoMain from "./pages/info/InfoMain";
import AdminMain from "./pages/admin/AdminMain";
import AdminRoute from "./components/AdminRoute";
import QuestMain from "./pages/quest/QuestMain";
import HistoryRealTime from "./pages/history/realtime/HistoryRealTime";
import HistoryDetailPage from "./pages/history/detail/HistoryDetailPage";
import StatisticMain from "./pages/statistic/StatisticMain";

// 로그인 없이 접근 가능한 라우트들
const publicRoutes = [
  { path: "/", element: <Login /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/info", element: <InfoMain /> },
];

// 로그인 후에만 접근 가능한 라우트들
const protectedRoutes = [
  { path: "/dashboard", element: <DashboardMain /> },
  { path: "/car", element: <CarMain /> },
  { path: "/car/register", element: <CarRegister /> },
  { path: "/car/rent", element: <RentMain /> },
  { path: "/car/rent/register", element: <RentRegister /> },
  { path: "/history", element: <HistoryMain /> },
  { path: "/history/:id", element: <HistoryDetailPage /> },
  { path: "/history/realtime", element: <HistoryRealTime /> },
  { path: "/statistic", element: <StatisticMain /> },
  { path: "/quest", element: <QuestMain /> },
];

// 관리자 로그인 후에만 접근 가능한 라우트들
const adminRoutes = [
  { path: "/admin", element: <AdminMain /> },
  { path: "/emulator", element: <Emulator /> },
];

function Routing() {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) return null;

  return (
    <Routes>
      {/* Layout 없이 접근 가능한 공개 라우트 */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Layout 포함된 보호/관리자 라우트 */}
      <Route element={<Layout />}>
        {/* 보호된 라우트 */}
        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoute>{element}</PrivateRoute>}
          />
        ))}

        {/* 관리자 라우트 */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<AdminRoute>{element}</AdminRoute>}
          />
        ))}
      </Route>
    </Routes>
  );
}

export default Routing;
