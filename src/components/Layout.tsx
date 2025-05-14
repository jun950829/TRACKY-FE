// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";

function Layout() {
  const { isMobile } = useWindowSize();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className={`flex-1 overflow-auto ${isMobile ? 'mt-16' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
