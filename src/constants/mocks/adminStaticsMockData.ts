export interface VehicleStatistic {
  id: string;
  carNumber: string;
  carType: string;
  operationTime: string;
  operationDistance: string;
  averageSpeed: string;
  maxSpeed: string;
}

export interface BizStatistic {
  id: string;
  name: string;
  totalVehicles: number;
  activeVehicles: number;
  totalRentals: number;
  totalDistance: string;
  averageRating: number;
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

export const bizStatistics: BizStatistic[] = [
  {
    id: "1",
    name: "서울렌트카",
    totalVehicles: 25,
    activeVehicles: 20,
    totalRentals: 156,
    totalDistance: "12,456km",
    averageRating: 4.8,
  },
  {
    id: "2",
    name: "부산렌트카",
    totalVehicles: 18,
    activeVehicles: 15,
    totalRentals: 98,
    totalDistance: "8,745km",
    averageRating: 4.6,
  },
  {
    id: "3",
    name: "대구렌트카",
    totalVehicles: 15,
    activeVehicles: 12,
    totalRentals: 87,
    totalDistance: "7,123km",
    averageRating: 4.7,
  },
];

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