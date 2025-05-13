import { CarTypeEnum, CarTypes } from "../types/types";

export interface VehicleStatistic {
  id: string;
  carNumber: string;
  carType: string;
  operationTime: string;
  operationDistance: string;
  averageSpeed: string;
  maxSpeed: string;
}

export interface BizList {
  id: string;
  bizName: string;
  totalCarCount: number;
  drivingCarCount: number;
  skipCount: number;
}

export interface BizStatistic {
  dailyDriveCount: number;
  dailyDriveDistance: number;
  dailyDriveSec: number;
}

export interface MonthlyDriveCounts {
  year: number;
  month: number;
  driveCount: number;
}

export interface HourlyDriveCounts {
  hour: number;
  driveCount: number;
}

export interface CarCount {
  bizName: string;
  carCount: number;
}

export interface CarTypeCount {
  carType: CarTypeEnum;
  carTypeCount: number;
}

export interface OperationRate {
  bizName: string;
  rate: number;
}

export interface NonOperatedCar {
  bizName: string;
  nonOperatedCarCount: number;
}

export interface GraphStats {
  carCountWithBizName: CarCount[];
  carTypeCounts: CarTypeCount[];
  operationRateWithBizName: OperationRate[];
  nonOperatedCarWithBizName: NonOperatedCar[];
}

export interface OverallStatistic {
  totalVehicles: number;
  activeVehicles: number;
  totalRentals: number;
  totalDistance: string;
  averageRating: number;
  monthlyGrowth: number;
  dailyActiveUsers: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export const vehicleStatistics: VehicleStatistic[] = [
  {
    id: "1",
    carNumber: "서울 12가 3456",
    carType: "SUV",
    operationTime: "6.2시간",
    operationDistance: "87.5km",
    averageSpeed: "62km/h",
    maxSpeed: "95km/h",
  },
  {
    id: "2",
    carNumber: "부산 34나 7890",
    carType: "승용차",
    operationTime: "4.8시간",
    operationDistance: "65.2km",
    averageSpeed: "58km/h",
    maxSpeed: "88km/h",
  },
  {
    id: "3",
    carNumber: "대구 56다 1234",
    carType: "SUV",
    operationTime: "5.5시간",
    operationDistance: "72.1km",
    averageSpeed: "60km/h",
    maxSpeed: "92km/h",
  },
];

export const bizListMock: BizList[] = [
  {
    id: "1",
    bizName: "서울렌트카",
    totalCarCount: 25,
    drivingCarCount: 20,
    skipCount: 4,
  },
  {
    id: "2",
    bizName: "부산렌트카",
    totalCarCount: 18,
    drivingCarCount: 15,
    skipCount: 6,
  },
  {
    id: "3",
    bizName: "대구렌트카",
    totalCarCount: 15,
    drivingCarCount: 12,
    skipCount: 5,
  },
];

export const bizStatisticMock: BizStatistic = {
    dailyDriveCount: 1,
    dailyDriveDistance: 5252.1,
    dailyDriveSec: 304
  };

export const monthlyDriveCountsMock: MonthlyDriveCounts[] = [
  {
    year: 2025,
    month: 1,
    driveCount: 30
  },
  {
    year: 2025,
    month: 2,
    driveCount: 40
  },
  {
    year: 2025,
    month: 3,
    driveCount: 50
  },
  {
    year: 2025,
    month: 4,
    driveCount: 40
  },
  {
    year: 2025,
    month: 5,
    driveCount: 60
  },
];

export const hourlyDriveCountsMock: HourlyDriveCounts[] = [
  { hour: 0, driveCount: 10 },
  { hour: 1, driveCount: 20 },
  { hour: 2, driveCount: 30 },
  { hour: 3, driveCount: 60 },
  { hour: 4, driveCount: 50 },
  { hour: 5, driveCount: 70 },
  { hour: 6, driveCount: 30 },
  { hour: 7, driveCount: 40 },
  { hour: 8, driveCount: 20 },
  { hour: 9, driveCount: 10 },
  { hour: 10, driveCount: 0 },
  { hour: 11, driveCount: 50 },
];

export const graphStatsMock: GraphStats = {
  carCountWithBizName : [
    { bizName: '지원컴퍼니', carCount: 50}, 
    { bizName: '지니카', carCount: 30}, 
    { bizName: '부릉세상', carCount: 20}, 
    { bizName: '토자렌트', carCount: 40},
    { bizName: '준시스템', carCount: 70},
    { bizName: '김치진주', carCount: 40},
  ],
  carTypeCounts : [
    { carType: 'MINI', carTypeCount: 10 },
    { carType: 'SEDAN', carTypeCount: 20 },
    { carType: 'SUV', carTypeCount: 5 },
    { carType: 'BUS', carTypeCount: 3 },
    { carType: 'ETC', carTypeCount: 15 },
  ],
  operationRateWithBizName : [
    { bizName: '지원컴퍼니', rate: 82 },
    { bizName: '지니카',     rate: 75 },
    { bizName: '부릉세상',   rate: 68 },
    { bizName: '토자렌트',   rate: 90 },
    { bizName: '준시스템',   rate: 55 },
    { bizName: '김치진주',   rate: 60 },
  ],
  
  nonOperatedCarWithBizName : [
    { bizName: '지원컴퍼니', nonOperatedCarCount: 9 },
    { bizName: '지니카',     nonOperatedCarCount: 7 },
    { bizName: '부릉세상',   nonOperatedCarCount: 6 },
    { bizName: '토자렌트',   nonOperatedCarCount: 4 },
    { bizName: '준시스템',   nonOperatedCarCount: 31 },
    { bizName: '김치진주',   nonOperatedCarCount: 16 },
  ],
}

export const overallStatistics: OverallStatistic = {
  totalVehicles: 58,
  activeVehicles: 47,
  totalRentals: 341,
  totalDistance: "28,324km",
  averageRating: 4.7,
  monthlyGrowth: 12.5,
  dailyActiveUsers: 156,
};

export const monthlyRentalData: TimeSeriesData[] = [
  { date: "2024-01", value: 120 },
  { date: "2024-02", value: 145 },
  { date: "2024-03", value: 156 },
  { date: "2024-04", value: 178 },
  { date: "2024-05", value: 165 },
  { date: "2024-06", value: 189 },
];

export const dailyActiveUsersData: TimeSeriesData[] = [
  { date: "2024-06-01", value: 120 },
  { date: "2024-06-02", value: 145 },
  { date: "2024-06-03", value: 156 },
  { date: "2024-06-04", value: 178 },
  { date: "2024-06-05", value: 165 },
  { date: "2024-06-06", value: 189 },
  { date: "2024-06-07", value: 210 },
];

export const vehicleTypeDistribution = [
  { type: "SUV", count: 25 },
  { type: "승용차", count: 18 },
  { type: "트럭", count: 8 },
  { type: "밴", count: 7 },
];

export const bizRatingDistribution = [
  { rating: "5점", count: 45 },
  { rating: "4점", count: 32 },
  { rating: "3점", count: 12 },
  { rating: "2점", count: 5 },
  { rating: "1점", count: 2 },
]; 