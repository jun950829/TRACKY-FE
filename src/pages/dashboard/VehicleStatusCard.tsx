import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Filter } from "lucide-react";

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

interface VehicleStatusCardProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export default function VehicleStatusCard({ vehicles, isLoading }: VehicleStatusCardProps) {
  const [filter, setFilter] = useState<"all" | "운행중" | "대기중" | "정비중">("all");
  
  // Filter vehicles based on status
  const filteredVehicles = vehicles.filter(
    v => filter === "all" || v.status === filter
  );
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "운행중":
        return "bg-green-100 text-green-600";
      case "대기중":
        return "bg-blue-100 text-blue-600";
      case "정비중":
        return "bg-red-100 text-red-600";
      default:
        return "bg-zinc-100 text-zinc-600";
    }
  };
  
  // Get time since last update
  const getTimeSince = (date?: Date) => {
    if (!date) return "정보 없음";
    
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
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-4 bg-white border-b border-zinc-100 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span>차량 상태</span>
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Filter className="h-4 w-4 text-zinc-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "운행중" | "대기중" | "정비중")}
            className="text-xs border-none bg-transparent focus:ring-0 pl-0 pr-6 py-0"
          >
            <option value="all">전체</option>
            <option value="운행중">운행중</option>
            <option value="대기중">대기중</option>
            <option value="정비중">정비중</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-49px)] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex p-2 border-b border-zinc-100 last:border-b-0">
                <div className="w-full">
                  <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Car className="h-10 w-10 text-zinc-300 mb-2" />
            <p className="text-zinc-500">일치하는 차량이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.mdn} 
                className="p-4 hover:bg-zinc-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{vehicle.carNumber}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-zinc-500">운전자</div>
                  <div className="text-right">{vehicle.driver || "미지정"}</div>
                  
                  <div className="text-zinc-500">MDN</div>
                  <div className="text-right">{vehicle.mdn}</div>
                  
                  <div className="text-zinc-500">최근 업데이트</div>
                  <div className="text-right">{getTimeSince(vehicle.lastUpdated)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 