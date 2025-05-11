// components/MonthlyDriveCountChart.tsx
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
import { ChartOptions } from "chart.js";
import { formatDate } from "date-fns";
import { MonthlyDriveCounts } from "@/constants/mocks/adminStaticsMockData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MonthlyDriveCountChartProps {
  title?: string;
  data: MonthlyDriveCounts[];
}

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      title: {
        display: true,
        text: "운행 횟수",
      },
    },
    x: {
      title: {
        display: true,
        text: "월",
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
};

function MonthlyDriveCountChart({ title = "월별 운행량", data }: MonthlyDriveCountChartProps) {
  const chartData = {
    labels: data.map(item => item.year + '-' + item.month),
    datasets: [
      {
        label: "운행량",
        data: data.map(item => item.driveCount),
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
      <div className="p-5 border-b border-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">
        <div className="h-[300px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default MonthlyDriveCountChart;
