import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
}

interface StatsProps {
  stats: StatItem[];
  isLoading: boolean;
}

export default function Stats({ stats, isLoading }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="h-4 w-2/3 bg-zinc-200 animate-pulse rounded mb-2"></div>
                <div className="h-6 w-1/2 bg-zinc-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))
        : stats.map((stat, index) => (
            <Card
              key={`stat-${index}`}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="text-sm text-zinc-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
} 