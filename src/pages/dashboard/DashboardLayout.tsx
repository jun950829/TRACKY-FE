import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="w-full p-0 md:p-20 xl:p-10 bg-zinc-50">
      {/* Main Content */}
      <main className="w-full xl:container xl:mx-auto">{children}</main>
    </div>
  );
} 