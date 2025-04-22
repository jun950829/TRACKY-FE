import { Line, Bar } from 'react-chartjs-2';
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
} from 'chart.js';
import {
  monthlyOperationData,
  monthlyDistanceData,
  chartOptions,
} from '@/constants/mocks/statisticMockData';

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

function MonthlyCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">월별 운행량</h3>
        </div>
        <div className="p-5">
          <div className="h-[300px]">
            <Line data={monthlyOperationData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5 border-b border-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">월별 운행 거리</h3>
        </div>
        <div className="p-5">
          <div className="h-[300px]">
            <Bar data={monthlyDistanceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyCharts; 