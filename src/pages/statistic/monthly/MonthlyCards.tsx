import { monthlyCardData } from '@/constants/mocks/statisticMockData';

function MonthlyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">전체 보유 차량</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {monthlyCardData.totalVehicles.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {monthlyCardData.totalVehicles.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">운행중 차량 수</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-blue-600">
              {monthlyCardData.operatingVehicles.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {monthlyCardData.operatingVehicles.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">평균 가동률</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-green-600">
              {monthlyCardData.averageOperation.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {monthlyCardData.averageOperation.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">평균 운행량</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-purple-600">
              {monthlyCardData.averageTrips?.value || 42}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              회
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">평균 운행 시간</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-orange-600">
              {monthlyCardData.averageTime?.value || 156}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              시간
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">하루 평균 운행거리</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-cyan-600">
              {monthlyCardData.averageDistance?.value || 284}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyCards;
