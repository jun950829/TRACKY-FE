import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full p-10 bg-zinc-50">
      {/* Main Content */}
      <main className="w-full container mx-auto">{children}</main>
    </div>
  );
} 