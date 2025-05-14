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
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DailyStatisticResponse } from "@/libs/apis/statisticApi";
import { HourlyStats } from "@/libs/apis/adminStatisticApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DailyChartsProps {
  selectedDate: Date;
  dailyData: DailyStatisticResponse | null;
  compareDate?: Date | null;
  compareData?: DailyStatisticResponse | null;
  isLoadingCompare?: boolean;
}

function DailyStatisticCharts({
  selectedDate,
  dailyData,
  compareDate,
  compareData,
  isLoadingCompare = false,
}: DailyChartsProps) {
  const getChartData = () => {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}시`);
    const datasets = [];

    if (dailyData) {
      const hourlyData = Array(24).fill(0);
      dailyData.hourlyStats.forEach((stat: HourlyStats) => {
        hourlyData[stat.hour] = stat.driveCount;
      });

      datasets.push({
        label: format(selectedDate, "M월 d일", { locale: ko }),
        data: hourlyData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    }

    if (compareDate) {
      const hourlyData = Array(24).fill(0);

      if (compareData) {
        compareData.hourlyStats.forEach((stat: HourlyStats) => {
          hourlyData[stat.hour] = stat.driveCount;
        });
      }

      datasets.push({
        label: format(compareDate, "M월 d일", { locale: ko }),
        data: compareData ? hourlyData : Array(24).fill(0),
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    }

    return {
      labels,
      datasets,
    };
  };

  return (
    <div className="h-[300px]">
      {isLoadingCompare && <p className="text-sm text-gray-500 mb-2">비교 데이터 로딩 중...</p>}
      <Line
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top" as const,
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
                text: "운행 차량 수",
              },
            },
            x: {
              title: {
                display: true,
                text: "시간",
              },
            },
          },
          interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
          },
        }}
        data={getChartData()}
      />
    </div>
  );
}

export default DailyStatisticCharts;
