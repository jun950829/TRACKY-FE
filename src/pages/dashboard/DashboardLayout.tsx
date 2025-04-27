import PageHeader from "@/components/custom/PageHeader";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="p-10 min-h-screen h-screen bg-zinc-50">
      {/* Main Content */}
      <PageHeader title="대시보드" size="2xl" />
      <main className="container mx-auto">{children}</main>
      
    </div>
  );
} 