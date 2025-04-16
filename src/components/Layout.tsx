import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";

function Layout() {
  const token = useAuthStore((state) => state.token);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 체크

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {token && <Header />}
      <div className={`${!isMobile && token ? 'pl-64' : ''} transition-all duration-300`}>
        <main className="container mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout; 