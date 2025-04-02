import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CarMain from "./pages/car/CarMain";
import CarRegister from "./pages/car/CarRegister";

function Routing() {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />


    {/* 차량 조회/등록 관련 */}
    <Route path="/cars" element={<CarMain />} />
    <Route path="/cars/register" element={<CarRegister />} />
  </Routes>
  )
}

export default Routing;