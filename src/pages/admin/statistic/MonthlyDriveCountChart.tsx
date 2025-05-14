// components/MonthlyDriveCountChart.tsx
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as TitlePlugin,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { MonthlyDriveCounts, HourlyDriveCounts } from "@/constants/mocks/adminStaticsMockData";
import adminStatisticApiService from "@/libs/apis/adminStatisticApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TitlePlugin,
  Tooltip,
  Legend
);

interface MonthlyDriveCountChartProps {
  monthlyData: MonthlyDriveCounts[];
  hourlyData: HourlyDriveCounts[];
  selectedBiz: string;
  selectedDate: Date | undefined;
}

export default function MonthlyDriveCountChart({ monthlyData, hourlyData, selectedBiz, selectedDate }: MonthlyDriveCountChartProps) {
  // 모드 토글: false=월별, true=시간별
  const [isHourly, setIsHourly] = useState(false);
  const [loading, setLoading] = useState(false);

  // 버튼 클릭 핸들러
  const handleToggle = async () => {
    setIsHourly(prev => !prev);
  };

  // chart.js 옵션 (공통)
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: isHourly ? "시간별 운행량" : "월별 운행량",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "운행 횟수",
        },
      },
      x: {
        title: {
          display: true,
          text: isHourly ? "시간(시)" : "월",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // chartData 생성
  const chartData = isHourly
    ? {
        labels: hourlyData.map(h => `${h.hour}시`),
        datasets: [
          {
            label: "운행량",
            data: hourlyData.map(h => h.driveCount),
            borderColor: "rgb(75, 192, 192)",
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }
    : {
        labels: monthlyData.map(m => `${m.year}-${String(m.month).padStart(2, "0")}`),
        datasets: [
          {
            label: "운행량",
            data: monthlyData.map(m => m.driveCount),
            borderColor: "rgb(75, 192, 192)",
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between p-5 border-b border-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">
          {chartOptions.plugins?.title?.text}
        </h3>
        <button
          onClick={handleToggle}
          disabled={loading}
          className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
        >
          {isHourly ? "월별 운행량 보기" : "시간별 운행량 보기"}
        </button>
      </div>

      <div className="p-5">
        <div className="w-full h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
