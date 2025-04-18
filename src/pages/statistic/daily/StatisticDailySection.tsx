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
  dailyCardData,
  dailyOperationData,
  dailyDistanceData,
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

function StatisticDailySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* 상단 통계 카드 */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">금일 운행 차량</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {dailyCardData.todayVehicles.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {dailyCardData.todayVehicles.unit}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">금일 운행 시간</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-blue-600">
              {dailyCardData.todayOperationTime.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {dailyCardData.todayOperationTime.unit}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">금일 평균 운행</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-green-600">
              {dailyCardData.todayAverageOperation.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {dailyCardData.todayAverageOperation.unit}
            </span>
          </div>
        </div>
      </div>

      {/* 그래프 섹션 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">일별 운행량</h3>
        <div className="h-[300px]">
          <Line data={dailyOperationData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">일별 운행 거리</h3>
        <div className="h-[300px]">
          <Bar data={dailyDistanceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default StatisticDailySection; 