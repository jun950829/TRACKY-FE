import { format } from "date-fns";
import api from "./api";
import { dailyCardData, dailyHourlyOperationData } from "@/constants/mocks/statisticMockData";
import { CarTypeEnum } from "@/constants/types/types";
import { CarStatisticRequest } from "@/pages/statistic/car/StatisticCarTable";

export interface DailyStatisticSummary {
  totalCarCount: number;
  dailyDriveCarCount: number;
  averageOperationRate: number;
  totalDrivingSeconds: number;
  totalDriveCount: number;
  totalDrivingDistance: number;
}

export interface HourlyStat {
  hour: number;
  driveCount: number;
}

export interface DailyStatisticResponse {
  summary: DailyStatisticSummary;
  hourlyStats: HourlyStat[];
}

export interface MonthlyStatisticSummary {
  totalCarCount: number;
  nonOperatingCarCount: number;
  averageOperationRate: number;
  totalDrivingSeconds: number;
  totalDriveCount: number;
  totalDrivingDistance: number;
}

export interface MonthlyStat {
  year: number;
  month: number;
  driveCount: number;
  driveDistance: number;
}

export interface MonthlyStatisticResponse {
  summary: MonthlyStatisticSummary;
  monthlyStats: MonthlyStat[];
}

export interface CarStatisticResponse {
  mdn: string;
  carPlate: string;
  carType: CarTypeEnum;
  driveSec: number;
  driveDistance: number;
  avgSpeed: number;
}

// 목데이터
const createMockDailyStatistic = (): DailyStatisticResponse => {
  const mockSummary: DailyStatisticSummary = {
    totalCarCount: 15,
    dailyDriveCarCount: dailyCardData.todayVehicles.value,
    averageOperationRate: 85.3,
    totalDrivingSeconds: 604800, // 일주일(7일) 초 단위
    totalDriveCount: dailyCardData.todayTrips.value,
    totalDrivingDistance: dailyCardData.totalDistance.value,
  };

  const mockHourlyStats: HourlyStat[] = dailyHourlyOperationData.datasets[0].data.map(
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

// 월간 통계 목데이터
const createMockMonthlyStatistic = (): MonthlyStatisticResponse => {
  const mockSummary: MonthlyStatisticSummary = {
    totalCarCount: 123,
    nonOperatingCarCount: 45,
    averageOperationRate: 63,
    totalDrivingSeconds: 987654,
    totalDriveCount: 321,
    totalDrivingDistance: 4567.89,
  };

  // 1월부터 12월까지의 데이터 생성
  const mockMonthlyStats: MonthlyStat[] = Array.from({ length: 12 }, (_, i) => ({
    year: 2025,
    month: i + 1,
    driveCount: 50 + Math.floor(Math.random() * 50), // 50~99 사이 임의의 값
    driveDistance: 1000 + Math.floor(Math.random() * 3000), // 1000~3999 사이 임의의 값
  }));

  return {
    summary: mockSummary,
    monthlyStats: mockMonthlyStats,
  };
};

export const statisticApiService = {
  getDailyStatistic: async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await api.get(`/statistic/daily?date=${formattedDate}`);
      return response.data.data;
    } catch (error) {
      console.warn("일간 통계 API 요청 실패, 목데이터 사용", error);
      return createMockDailyStatistic();
    }
  },

  getMonthlyStatistic: async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM");
      const response = await api.get(`/statistic/monthly?date=${formattedDate}`);
      return response.data.data;
    } catch (error) {
      console.warn("월간 통계 API 요청 실패, 목데이터 사용", error);
      return createMockMonthlyStatistic();
    }
  },

  getCarStatistic: async (request: CarStatisticRequest) => {
    try {
      const response = await api.get(`/statistic/cars?search=${request.searchTerm}&page=${request.currentPage - 1}&size=${request.pageSize}`);
      console.log('차량 통계 API 요청 성공', response.data);
      return response.data;
    } catch(error) {
      console.warn("차량 통계 API 요청 실패", error);
      return null;
    }
  }
};

export default statisticApiService;
