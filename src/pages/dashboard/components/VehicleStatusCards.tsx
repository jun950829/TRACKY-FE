import { CarStatusTypes } from "@/constants/types/types";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Car, Clock, Settings, Shield } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface VehicleStatusCardsProps {
  statusObj: CarStatusTypes;
  accidentFreeDays?: number;
}

export default function VehicleStatusCards({ statusObj, accidentFreeDays = 365 }: VehicleStatusCardsProps) {
  // 차량 상태별 개수 계산
  const activeCount = statusObj?.running || 0;
  const inactiveCount = statusObj?.waiting || 0;
  const maintenanceCount = statusObj?.fixing || 0;
  const totalCount = Object.values(statusObj).reduce((acc, curr) => acc + curr, 0);

  // 가동률 계산 (운행 중인 차량 비율)
  const operationRate = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;

  // 도넛 차트 데이터
  const chartData = {
    labels: ['가동률', '비가동률'],
    datasets: [
      {
        data: [operationRate, 100 - operationRate],
        backgroundColor: [
          'rgb(34, 197, 94)', // 가동 - 초록색
          'rgb(229, 231, 235)', // 비가동 - 회색
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  // 차트 옵션
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-1/2 h-full bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold">차량 현황</h2>
      <div className="flex flex-row items-center justify-between w-full h-full">
        {/* 왼쪽: 차량 상태 리스트 */}
        <div className="space-y-4 pr-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Car className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 flex flex-row gap-4">
                <div className="text-sm font-medium">운행 중</div>
                <div className="text-sm text-gray-500">{activeCount}대</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 flex flex-row gap-4">
                <div className="text-sm font-medium">대기 중</div>
                <div className="text-sm text-gray-500">{inactiveCount}대</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1 flex flex-row gap-4">
                <div className="text-sm font-medium">정비 중</div>
                <div className="text-sm text-gray-500">{maintenanceCount}대</div>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 1 */}
        <div className="w-px h-36 bg-gray-200"></div>

        {/* 중앙: 무사고 일수 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-12 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-blue-600">{accidentFreeDays}</span>
          <span className="text-sm text-gray-500">무사고 일수</span>
        </div>

        {/* 구분선 2 */}
        <div className="w-px h-36 bg-gray-200"></div>

        {/* 오른쪽: 도넛 차트 */}
        <div className="flex-1 flex items-center justify-center pl-6">
          <div className="relative w-32 h-32">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{operationRate.toFixed(1)}%</span>
              <span className="text-sm text-gray-500">가동률</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 