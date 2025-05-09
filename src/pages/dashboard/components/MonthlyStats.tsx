import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyStatsProps {
  monthlyData: {
    totalTrips: number;
    dailyAverage: number;
    weeklyAverage: number;
    dailyData: {
      date: string;
      count: number;
    }[];
  };
}

function MonthlyStats({ monthlyData }: MonthlyStatsProps) {
  const chartData = {
    labels: monthlyData.dailyData.map(data => data.date),
    datasets: [
      {
        label: '일별 운행 건수',
        data: monthlyData.dailyData.map(data => data.count),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="p-4 bg-white border-b border-zinc-100 flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">월별 통계 리포트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">총 운행 건수</div>
            <div className="text-2xl font-bold text-blue-700">{monthlyData.totalTrips}건</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">일평균 운행</div>
            <div className="text-2xl font-bold text-green-700">{monthlyData.dailyAverage}건</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">주평균 운행</div>
            <div className="text-2xl font-bold text-purple-700">{monthlyData.weeklyAverage}건</div>
          </div>
        </div>
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthlyStats; 