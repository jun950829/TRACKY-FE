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
  monthlyCardData,
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

function StatisticMonthSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* 상단 통계 카드 */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">전체 보유 차량</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {monthlyCardData.totalVehicles.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {monthlyCardData.totalVehicles.unit}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">운행중 차량 수</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-blue-600">
              {monthlyCardData.operatingVehicles.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {monthlyCardData.operatingVehicles.unit}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">평균 가동률</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-green-600">
              {monthlyCardData.averageOperation.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {monthlyCardData.averageOperation.unit}
            </span>
          </div>
        </div>
      </div>

      {/* 그래프 섹션 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 운행량</h3>
        <div className="h-[300px]">
          <Line data={monthlyOperationData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">월별 운행 거리</h3>
        <div className="h-[300px]">
          <Bar data={monthlyDistanceData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default StatisticMonthSection;