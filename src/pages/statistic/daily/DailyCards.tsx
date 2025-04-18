import { dailyCardData } from '@/constants/mocks/statisticMockData';

function DailyCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">금일 운행 차량</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {dailyCardData.todayVehicles.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {dailyCardData.todayVehicles.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">금일 운행 시간</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-blue-600">
              {dailyCardData.todayOperationTime.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {dailyCardData.todayOperationTime.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">금일 평균 운행</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-green-600">
              {dailyCardData.todayAverageOperation.value}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">
              {dailyCardData.todayAverageOperation.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCards; 