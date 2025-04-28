import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full h-full p-10 max-h-screen bg-zinc-50">
      {/* Main Content */}
      <main className="w-full h-full container mx-auto overflow-y-auto">{children}</main>
    </div>
  );
} 