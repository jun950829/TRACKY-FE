import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Main Content */}
      <main className="container mx-auto">{children}</main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-4">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} 차량 관제 시스템
        </div>
      </footer>
    </div>
  );
} 