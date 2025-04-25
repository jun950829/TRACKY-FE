// src/Routing.tsx
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

import Layout from "@/components/Layout";
import Login from "../../pages/Login";
import About from "../../pages/About";
import CarMain from "../../pages/car/CarMain";
import RentMain from "../../pages/rent/RentMain";
import Emulator from "../../pages/emulator/Emulator";
import PrivateRoute from "./PrivateRoute";
import Register from "../../pages/Register";
import DashboardMain from "../../pages/dashboard/DashBoardMain";

import HistoryMain from "../../pages/history/HistoryMain";
import InfoMain from "../../pages/info/InfoMain";
import AdminMain from "../../pages/admin/AdminMain";
import Signup from "../../pages/signup/SignupMain";
import AdminRoute from "./AdminRoute";
import QuestMain from "../../pages/quest/QuestMain";
import HistoryDetailPage from "../../pages/history/detail/HistoryDetailPage";
import StatisticMain from "../../pages/statistic/StatisticMain";
import CarRegister from "../../pages/car/register/CarRegister";
import RentRegister from "../../pages/rent/register/RentRegister";
import AdminBizSection from "@/pages/admin/biz/AdminBizSection";
import AdminStatisticSection from "@/pages/admin/statistic/AdminStatisticSection";
import AdminNotice from "@/pages/admin/notice/AdminNoticeMain";
import RealTimeMain from "../../pages/history/realtime/RealTimeMain";
import NoticeMain from "@/pages/etc/notice/NoticeMain";

// 로그인 없이 접근 가능한 라우트들
const publicRoutes = [
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
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
  { path: "/history/realtime", element: <RealTimeMain /> },
  { path: "/statistic", element: <StatisticMain /> },
  { path: "/quest", element: <QuestMain /> },
  { path: "/etc", element: <NoticeMain /> },
  { path: "/etc/notice", element: <NoticeMain /> },
];

// 관리자 로그인 후에만 접근 가능한 라우트들
const adminRoutes = [
  { path: "/admin", element: <AdminMain /> },
  { path: "/admin/biz", element: <AdminBizSection /> },
  { path: "/admin/statistic", element: <AdminStatisticSection /> },
  { path: "/admin/notice", element: <AdminNotice /> },
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
