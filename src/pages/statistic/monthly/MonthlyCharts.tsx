import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MonthlyStatisticResponse } from "@/libs/apis/statisticApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyChartsProps {
  monthlyData: MonthlyStatisticResponse | null;
}

function MonthlyCharts({ monthlyData }: MonthlyChartsProps) {
  const monthlyStats = monthlyData?.monthlyStats;
  console.log(monthlyData);
  if (!monthlyStats) {
    return <div className="p-4 text-center">데이터를 불러올 수 없습니다.</div>;
  }

  const getMonthlyOperationData = () => {
    const labels = monthlyStats.map((item) => `${item.month}월`);
    const data = monthlyStats.map((item) => item.driveCount);

    return {
      labels,
      datasets: [
        {
          label: "월별 운행량 (회)",
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
        },
      ],
    };
  };

  const getMonthlyDistanceData = () => {
    const labels = monthlyStats.map((item) => `${item.month}월`);
    const data = monthlyStats.map((item) => item.driveDistance);

    return {
      labels,
      datasets: [
        {
          label: "월별 운행 거리 (km)",
          data,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  };

  // 차트 공통 옵션
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">월별 운행량</h3>
        </div>
        <div className="p-5">
          <div className="h-[300px]">
            <Line data={getMonthlyOperationData()} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">월별 운행 거리</h3>
        </div>
        <div className="p-5">
          <div className="h-[300px]">
            <Bar data={getMonthlyDistanceData()} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyCharts;
