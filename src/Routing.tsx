// src/Routing.tsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import CarMain from "./pages/car/CarMain";
import CarRegister from "./pages/car/CarRegister";
import RentMain from "./pages/rent/RentMain";
import RentRegister from "./pages/rent/RentRegister";
import Emulator from "./pages/emulator/Emulator";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard/DashBoard";

// 로그인 없이 접근 가능한 라우트들
const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/emulator", element: <Emulator /> },
];

// 로그인 후에만 접근 가능한 라우트들
const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/cars", element: <CarMain /> },
  { path: "/cars/register", element: <CarRegister /> },
  { path: "/rents", element: <RentMain /> },
  { path: "/rents/register", element: <RentRegister /> },
];

function Routing() {
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
    </Routes>
  );
}

export default Routing;
