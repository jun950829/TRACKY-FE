import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useSseStore } from "@/stores/useSseStore";
import { SseEventPayloadType } from "@/constants/types/types";
import { RecentActivityColor, RecentActivityIcon } from "@/libs/utils/dashboardUtils";

interface RecentActivityProps {
  isLoading: boolean;
}

export default function RecentActivity({ isLoading }: RecentActivityProps) {
  const [displayLogs, setDisplayLogs] = useState<SseEventPayloadType[]>([]);
  const recentLogs = useSseStore((state) => state.logs);

  // SSE 로그 업데이트 처리
  useEffect(() => {
    if (recentLogs.length > 0) {
      const latestLog = recentLogs[0];
      if (latestLog.type === "car-event" || latestLog.type === "rent-event") {
        setDisplayLogs(prevLogs => {
          // 최대 10개의 로그만 유지
          const newLogs = [latestLog.payload, ...prevLogs].slice(-10);
          return newLogs;
        });
      }
    }
  }, [recentLogs]);

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
        ) : displayLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Activity className="h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-sm">최근 활동이 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {displayLogs.map((log, idx) => (
              <div key={`${log.createdAt}-${idx}`} className="p-3 flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center">
                    {RecentActivityIcon(log.event, log.method)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-xs text-${RecentActivityColor(log.method)}-900`}>{log.message}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{formatTime(new Date(log.createdAt))}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 