import { format } from "date-fns";
import api from "./api";
import { dailyCardData, dailyHourlyOperationData } from "@/constants/mocks/statisticMockData";

export interface DailyStatisticSummary {
  totalCarCount: number;
  dailyDriveCarCount: number;
  averageOperationRate: number;
  totalDrivingSeconds: number;
  totalDriveCount: number;
  totalDrivingDistanceKm: number;
}

export interface HourlyStats {
  hour: number;
  driveCount: number;
}

export interface DailyStatisticResponse {
  summary: DailyStatisticSummary;
  hourlyStats: HourlyStats[];
}

// 목데이터
const createMockDailyStatistic = (): DailyStatisticResponse => {
  const mockSummary: DailyStatisticSummary = {
    totalCarCount: 15,
    dailyDriveCarCount: dailyCardData.todayVehicles.value,
    averageOperationRate: 85.3,
    totalDrivingSeconds: 604800, // 일주일(7일) 초 단위
    totalDriveCount: dailyCardData.todayTrips.value,
    totalDrivingDistanceKm: dailyCardData.totalDistance.value,
  };

  const mockHourlyStats: HourlyStats[] = dailyHourlyOperationData.datasets[0].data.map(
    (count, index) => ({
      hour: index,
      driveCount: typeof count === "number" ? count : 0,
    })
  );

  return {
    summary: mockSummary,
    hourlyStats: mockHourlyStats,
  };
};

export const statisticApiService = {
  getDailyStatistic: async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await api.get(`/api/statistic/daily?date=${formattedDate}`);
      return response.data;
    } catch (error) {
      console.warn("일간 통계 API 요청 실패, 목데이터 사용", error);
      return createMockDailyStatistic();
    }
  },

  getMonthlyStatistic: async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM");
      const response = await api.get(`/api/statistic/monthly?date=${formattedDate}`);
      return response.data;
    } catch (error) {
      console.warn("월간 통계 API 요청 실패, 목데이터 사용", error);
      // 월간 목데이터는 실제로 필요할 때 구현
      return { summary: {}, stats: [] };
    }
  },
};

export default statisticApiService;
