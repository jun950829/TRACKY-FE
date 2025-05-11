import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MonthlyStatistic } from "@/constants/types/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MonthlyStatsProps {
  monthlyData?: MonthlyStatistic;
}

function MonthlyStats({ monthlyData }: MonthlyStatsProps) {
  // const chartData = {
  //   labels: monthlyData?.dailyDriveCount.map((_, index) => `${index + 1}일`),
  //   datasets: [
  //     {
  //       label: "일별 운행 건수",
  //       data: monthlyData?.dailyDriveCount.map((data) => data),
  //       borderColor: "rgb(59, 130, 246)",
  //       backgroundColor: "rgba(59, 130, 246, 0.5)",
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       ticks: {
  //         stepSize: 1,
  //       },
  //     },
  //   },
  // };

  return (
    <Card className="w-full bg-white">
      <CardHeader p-4 bg-white border-b border-zinc-100 flex-row items-center justify-between>
        <CardTitle className="text-lg font-semibold">월별 통계 리포트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">당월 평균 운행률</div>
            <div className="text-2xl font-bold text-blue-700">
              {/* {monthlyData?.avgOperationRate.toFixed(1)}% */}
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">당월 미운행 차량 수</div>
            <div className="text-2xl font-bold text-green-700">
              {monthlyData?.nonOperatingCarCount}대
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">당월 총 운행 수</div>
            <div className="text-2xl font-bold text-purple-700">
              {monthlyData?.totalDriveCount}건
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          {/* <Line data={chartData} options={chartOptions} /> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthlyStats;
