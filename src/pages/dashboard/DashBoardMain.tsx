import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import {
  CarStatusTypes,
  MonthlyStatistic,
  ReturnStatus,
  StatisticsItem,
} from "@/constants/types/types";
import { dashboardApi } from "@/libs/apis/dashboardApi";
import VehicleStatusCards from "@/pages/dashboard/components/VehicleStatusCards";
import MapLayer from "./MapLayer";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";
import ReturnedStatus from "@/pages/dashboard/components/ReturnedStatus";
import MonthlyStats from "./components/MonthlyStats";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [carStatus, setCarStatus] = useState<CarStatusTypes>({
    RUNNING: 0,
    WAITING: 0,
    FIXING: 0,
    CLOSED: 0,
  });
  const [ReturnStatus, setReturnStatus] = useState<ReturnStatus[]>([]);
  const [statistics, setStatistics] = useState<MonthlyStatistic>();
  const [statisticsItems, setStatisticsItems] = useState<StatisticsItem[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  // useSseEvents();

  // 데이터 로드
  const fetchCarStatus = async () => {
    try {
      const response = await dashboardApi.getCarStatus();
      setCarStatus(response.data);
    } catch (error) {
      console.error("차량 상태 조회 실패:", error);
      setError(createApiError(error));
      throw error;
    }
  };

  const fetchReturnStatus = async () => {
    try {
      const response = await dashboardApi.getReturnStatus();
      console.log("getReturnStatus: ", response);
      setReturnStatus(response.data);
    } catch (error) {
      console.error("반납 현황 조회 실패:", error);
      setError(createApiError(error));
      throw error;
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await dashboardApi.getStatistics();
      console.log("getStatistics: ", response);
      setStatistics(response.data);
    } catch (error) {
      console.error("통계 조회 실패:", error);
      setError(createApiError(error));
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([fetchCarStatus(), fetchReturnStatus(), fetchStatistics()]);
      } catch (err) {
        console.error("데이터 조회 실패:", err);
        setError(createApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      {error && <ErrorToast error={error} />}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-600">대시보드 로딩 중...</p>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center p-2 space-y-4 h-[90vh]">
          {/* <PageHeader title="대시보드" size="2xl" /> */}
          <div className="w-full h-full flex flex-row justify-between items-center gap-4">
            {/* Vehicle Status Cards */}
            <div className="w-1/2 h-full bg-white rounded-lg border border-zinc-100 shadow-sm">
              <VehicleStatusCards statusObj={carStatus} />
            </div>

            {/* Reservation Status */}
            <div className="w-1/2 h-full bg-white rounded-lg border border-zinc-100 shadow-sm">
              <ReturnedStatus
                reservations={ReturnStatus}
                isLoading={isLoading}
                getReturnStatusData={fetchReturnStatus}
              />
            </div>
          </div>

          {/* Main Content - Map and Right Column */}
          <div className="w-full flex flex-row justify-between items-center gap-4">
            {/* 월별 통계 리포트 */}
            <div className="w-1/2 h-[500px] bg-white rounded-lg border border-zinc-100 shadow-sm">
              <MonthlyStats monthlyData={statistics} />
            </div>

            {/* 지도 컴포넌트 영역 */}
            <div className="w-1/2 h-[500px] bg-white rounded-lg border border-zinc-100 shadow-sm">
              <div className="w-full h-full relative">
                <MapLayer isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
