// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useWindowSize } from "@/hooks/useWindowSize";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <section className={`w-full h-full p-2 max-h-screen md:px-[80px] xl:p-6 overflow-y-auto ${className}`}>
      {children}
    </section>
  );
}

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
