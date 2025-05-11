import { format } from "date-fns";
import api from "./api";

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

export interface MonthlyStatisticSummary {
  totalCarCount: number;
  nonOperatingCarCount: number;
  averageOperationRate: number;
  totalDrivingSeconds: number;
  totalDriveCount: number;
  totalDrivingDistanceKm: number;
}

export interface MonthlyStat {
  month: number;
  driveCount: number;
  driveDistance: number;
}

export interface MonthlyStatisticResponse {
  summary: MonthlyStatisticSummary;
  monthlyStat: MonthlyStat[];
}

const adminStatisticApiRoot = "/admin/statistic";

export const adminStatisticApiService = {
  getAdminBizList: async () => {
    try {
      const response = await api.get(`${adminStatisticApiRoot}/biz`);
      return response.data.data;
    } catch (error) {
      console.warn("관리자 - 업체 목록 API 요청 실패", error);
    }
  },
  getAdminBizStatistic: async (bizName: string, selectedDate: Date | undefined) => {
    if(selectedDate == undefined) selectedDate = new Date();
    try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await api.get(`${adminStatisticApiRoot}/biz/stat?bizName=${bizName}&selectedDate=${formattedDate}`);
        return response.data.data;
    } catch (error) {
        console.warn('관리자 - 업체별 운행량 통계 API 요청 실패', error);
    }   
  },
  getMonthlyDriveCounts: async (bizName: string, selectedDate: Date | undefined) => {
    if(selectedDate == undefined) selectedDate = new Date();
    try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response = await api.get(`${adminStatisticApiRoot}/monthly?bizName=${bizName}&selectedDate=${formattedDate}`);
        return response.data.data;
    } catch (error) {
        console.warn('관리자 - 월별 운행량 통계 API 요청 실패', error);
    }
  }
};

export default adminStatisticApiService;