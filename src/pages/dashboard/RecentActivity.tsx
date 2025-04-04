import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, LocateFixed, Car, Flag, RotateCcw } from "lucide-react";

interface Vehicle {
  mdn: string;
  carNumber: string;
  status: "운행중" | "정비중" | "대기중";
  location?: {
    lat: number;
    lng: number;
  };
  lastUpdated?: Date;
  driver?: string;
  km?: number;
}

interface RecentActivityProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export default function RecentActivity({ vehicles, isLoading }: RecentActivityProps) {
  // Generate mock activity logs based on vehicle data
  const generateActivityLogs = () => {
    const logs: {
      id: number;
      type: "start" | "stop" | "location" | "maintenance";
      vehicle: string;
      timestamp: Date;
      message: string;
      icon: React.ReactNode;
    }[] = [];
    
    // Current time
    const now = new Date();
    
    // Sort vehicles by lastUpdated descending
    const sortedVehicles = [...vehicles].sort((a, b) => {
      const dateA = a.lastUpdated ? a.lastUpdated.getTime() : 0;
      const dateB = b.lastUpdated ? b.lastUpdated.getTime() : 0;
      return dateB - dateA;
    });
    
    // Generate activity logs based on vehicle status
    sortedVehicles.slice(0, 10).forEach((vehicle) => {
      const minutesAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date(now.getTime() - minutesAgo * 60000);
      
      if (vehicle.status === "운행중") {
        // For active vehicles, add a start event or location update
        if (Math.random() > 0.5) {
          logs.push({
            id: logs.length + 1,
            type: "start",
            vehicle: vehicle.carNumber,
            timestamp,
            message: `${vehicle.carNumber} 차량이 운행을 시작했습니다.`,
            icon: <Flag className="h-3 w-3 text-green-500" />
          });
        } else {
          logs.push({
            id: logs.length + 1,
            type: "location",
            vehicle: vehicle.carNumber,
            timestamp,
            message: `${vehicle.carNumber} 차량의 위치가 업데이트되었습니다.`,
            icon: <LocateFixed className="h-3 w-3 text-blue-500" />
          });
        }
      } else if (vehicle.status === "대기중") {
        logs.push({
          id: logs.length + 1,
          type: "stop",
          vehicle: vehicle.carNumber,
          timestamp,
          message: `${vehicle.carNumber} 차량이 운행을 종료했습니다.`,
          icon: <RotateCcw className="h-3 w-3 text-orange-500" />
        });
      } else if (vehicle.status === "정비중") {
        logs.push({
          id: logs.length + 1,
          type: "maintenance",
          vehicle: vehicle.carNumber,
          timestamp,
          message: `${vehicle.carNumber} 차량이 정비 중으로 상태가 변경되었습니다.`,
          icon: <Car className="h-3 w-3 text-red-500" />
        });
      }
    });
    
    // Sort by timestamp
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  const logs = generateActivityLogs();
  
  // Format timestamp to readable format
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="p-2 bg-white border-b border-zinc-100">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span>최근 활동</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto" style={{ height: 'calc(100% - 38px)' }}>
        {isLoading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-3 p-2">
                <div className="rounded-full bg-zinc-200 h-6 w-6"></div>
                <div className="flex-1 space-y-1 py-1">
                  <div className="h-2 bg-zinc-200 rounded w-3/4"></div>
                  <div className="h-2 bg-zinc-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-sm">활동 기록이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {logs.map((log) => (
              <div key={log.id} className="p-3 flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center">
                    {log.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-zinc-900">{log.message}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 