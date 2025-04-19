import { ChartData } from 'chart.js';

interface StatisticCardData {
  value: number;
  unit: string;
}

export interface StatisticMonthData {
  totalVehicles: StatisticCardData;
  operatingVehicles: StatisticCardData;
  averageOperation: StatisticCardData;
  averageTrips: StatisticCardData;
  averageTime: StatisticCardData;
  averageDistance: StatisticCardData;
}

export interface StatisticDayData {
  todayVehicles: StatisticCardData;
  todayOperationTime: StatisticCardData;
  todayAverageOperation: StatisticCardData;
  todayTrips: StatisticCardData;
  totalOperationTime: StatisticCardData;
  totalDistance: StatisticCardData;
}

// 월별 통계 데이터
export const monthlyCardData: StatisticMonthData = {
  totalVehicles: { value: 24, unit: '대' },
  operatingVehicles: { value: 18, unit: '대' },
  averageOperation: { value: 75, unit: '%' },
  averageTrips: { value: 42, unit: '회' },
  averageTime: { value: 156, unit: '시간' },
  averageDistance: { value: 284, unit: 'km' },
};

export const monthlyOperationData: ChartData<'line'> = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      label: '월별 운행량',
      data: [65, 59, 80, 81, 56, 75],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
    },
  ],
};

export const monthlyDistanceData: ChartData<'bar'> = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      label: '월별 운행 거리',
      data: [30, 45, 25, 60, 35, 50],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

// 일별 통계 데이터
export const dailyCardData: StatisticDayData = {
  todayVehicles: { value: 15, unit: '대' },
  todayOperationTime: { value: 128, unit: '시간' },
  todayAverageOperation: { value: 8.5, unit: '시간' },
  todayTrips: { value: 32, unit: '회' },
  totalOperationTime: { value: 168, unit: '시간' },
  totalDistance: { value: 425, unit: 'km' },
};

export const dailyOperationData: ChartData<'line'> = {
  labels: ['1일', '2일', '3일', '4일', '5일', '6일', '7일'],
  datasets: [
    {
      label: '일별 운행량',
      data: [12, 19, 15, 17, 14, 13, 18],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
    },
  ],
};

export const dailyDistanceData: ChartData<'bar'> = {
  labels: ['1일', '2일', '3일', '4일', '5일', '6일', '7일'],
  datasets: [
    {
      label: '일별 운행 거리',
      data: [50, 65, 45, 70, 55, 60, 75],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

// 시간별 운행량 데이터
export const dailyHourlyOperationData: ChartData<'line'> = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}시`),
  datasets: [
    {
      label: '운행 차량 수',
      data: [
        2, 1, 1, 0, 0, 3,   // 0-5시
        5, 8, 12, 15, 14, 13, // 6-11시
        12, 14, 13, 15, 16, 18, // 12-17시
        15, 12, 8, 6, 4, 3    // 18-23시
      ],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

// 차트 공통 옵션
export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}; 