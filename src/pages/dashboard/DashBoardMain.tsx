import React, { useState, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { CarStatusTypes, ReservationStatus, Statistics, StatisticsItem } from "@/constants/types/types";
import { dashboardApi } from "@/libs/apis/dashboardApi";
import VehicleStatusCards from "@/pages/dashboard/components/VehicleStatusCards";
import { makeStatisticsItems } from "@/libs/utils/dashboardUtils";
import { useSseEvents } from "@/hooks/useSseEvents";
import MapLayer from "./MapLayer";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";
import ReturnedStatus from "@/pages/dashboard/components/ReturnedStatus";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [carStatus, setCarStatus] = useState<CarStatusTypes>({
    running: 0,
    waiting: 0,
    fixing: 0,
    closed: 0
  });
  const [reservationStatus, setReservationStatus] = useState<ReservationStatus[]>([]);
  const [statistics, setStatistics] = useState<Statistics>();
  const [statisticsItems, setStatisticsItems] = useState<StatisticsItem[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  
  useSseEvents();

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          getCarStatus(),
          getReservationStatusData(),
          getStatistics()
        ]);
      } catch (err) {
        console.error('데이터 조회 실패:', err);
        setError(createApiError(err));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 통계 데이터가 변경되면 statisticsItems 업데이트
  useEffect(() => {
    if (statistics) {
      setStatisticsItems(makeStatisticsItems(statistics));
    }
  }, [statistics]);

  const getCarStatus = async () => {
    try {
      const response = await dashboardApi.getCarStatus();
      setCarStatus(response.data);
    } catch (error) {
      console.error('차량 상태 조회 실패:', error);
      setError(createApiError(error));
      throw error;
    }
  };
  
  const getReservationStatusData = async (datefilter : number = 0) => {
    try {
      const response = await dashboardApi.getReservationStatus(datefilter);
      console.log("getReservationStatus: ", response);
      setReservationStatus(response.data);
    } catch (error) {
      console.error('예약 현황 조회 실패:', error);
      setError(createApiError(error));
      throw error;
    }
  };

  const getStatistics = async () => {
    try {
      const response = await dashboardApi.getStatistics();
      console.log("getStatistics: ", response);
      setStatistics(response.data);
    } catch (error) {
      console.error('통계 조회 실패:', error);
      setError(createApiError(error));
      throw error;
    }
  };

  return (
    <DashboardLayout>
      {error && <ErrorToast error={error} />}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-600">대시보드 로딩 중...</p>
        </div>
      ) : (
        <div className="w-full p-3 sm:p-4 space-y-4">

          <div className="w-full h-[250px] flex flex-row justify-between items-center gap-4">
            {/* Vehicle Status Cards */}
            <VehicleStatusCards statusObj={carStatus} />

            {/* Reservation Status */}
            <ReturnedStatus reservations={reservationStatus} isLoading={isLoading} getReservationStatusData={getReservationStatusData} />
          </div>
          
          {/* Main Content - Map and Right Column */}
          <div className="w-full gap-4">
            {/* 월별 통계 리포트 */}
            <div className="w-1/2 flex">
            
            
            </div>



            {/* 지도 컴포넌트 영역 */}
            <div className="w-1/2 flex">
              {/* 지도 컴포넌트 */}
              <div className="w-full h-full mb-6 relative">
                {/* <KoreaMap /> */}
                <MapLayer isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 