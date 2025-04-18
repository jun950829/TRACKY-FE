import { ChartData } from 'chart.js';

interface StatisticCardData {
  value: number;
  unit: string;
}

export interface StatisticMonthData {
  totalVehicles: StatisticCardData;
  operatingVehicles: StatisticCardData;
  averageOperation: StatisticCardData;
}

export interface StatisticDayData {
  todayVehicles: StatisticCardData;
  todayOperationTime: StatisticCardData;
  todayAverageOperation: StatisticCardData;
}

// 월별 통계 데이터
export const monthlyCardData: StatisticMonthData = {
  totalVehicles: { value: 24, unit: '대' },
  operatingVehicles: { value: 18, unit: '대' },
  averageOperation: { value: 75, unit: '%' },
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