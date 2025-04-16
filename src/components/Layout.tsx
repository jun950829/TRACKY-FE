// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

function Layout() {
  const location = useLocation();
  const hideSidebarPaths = ["/login", "/register"];
  const shouldHideSidebar = hideSidebarPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex">
      {!shouldHideSidebar && <Sidebar />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
