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
import PageHeader from "@/components/custom/PageHeader";
import { RentStatus } from "@/constants/datas/status";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [carStatus, setCarStatus] = useState<CarStatusTypes>({
    RUNNING: 0,
    WAITING: 0,
    FIXING: 0,
    CLOSED: 0,
    DELETED: 0,
  });
  const [ReturnStatus, setReturnStatus] = useState<ReturnStatus[]>([]);
  const [statistics, setStatistics] = useState<MonthlyStatistic>();
  const [error, setError] = useState<ApiError | null>(null);

  const fetchCarStatus = async () => {
    try {
      const response = await dashboardApi.getCarStatus();
      setCarStatus(response.data);
    } catch (error) {
      console.error("차량 상태 조회 실패:", error);
      setError(createApiError(error));
    }
  };

  const fetchReturnStatus = async () => {
    try {
      const response = await dashboardApi.getReturnStatus();
      setReturnStatus(response.data);
    } catch (error) {
      console.error("반납 현황 조회 실패:", error);
      setError(createApiError(error));
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await dashboardApi.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("통계 조회 실패:", error);
      setError(createApiError(error));
    }
  };

  const handleUpdateStatus = async (rentUuid: string) => {
    try {
      await dashboardApi.updateRentStatusToReturn(rentUuid);
      await fetchReturnStatus();
      alert("반납 처리 성공!");
    } catch (err) {
      console.error("반납 처리 실패:", err);
      setError(createApiError(err));
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
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-600">대시보드 로딩 중...</p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center p-2 space-y-4 xl:space-y-0 xl:h-[90vh] xl:overflow-x-hidden">
          <div className="w-full flex flex-col xl:flex-row justify-between items-stretch gap-4">
            <div className="w-full min-w-0 xl:w-1/2 bg-white rounded-lg border border-zinc-100 shadow-sm">
              <VehicleStatusCards statusObj={carStatus} />
            </div>
            <div className="w-full min-w-0 xl:w-1/2 bg-white rounded-lg border border-zinc-100 shadow-sm">
              <ReturnedStatus
                reservations={ReturnStatus}
                isLoading={isLoading}
                updateStatus={handleUpdateStatus}
                getReturnStatusData={fetchReturnStatus}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row justify-between items-stretch gap-4">
            <div className="w-full min-w-0 xl:w-1/2 h-[500px] bg-white rounded-lg border border-zinc-100 shadow-sm">
              <MonthlyStats monthlyData={statistics} />
            </div>
            <div className="w-full min-w-0 xl:w-1/2 h-[500px] bg-white rounded-lg border border-zinc-100 shadow-sm">
              <MapLayer isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
