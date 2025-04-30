import { MonthlyStatisticResponse } from "@/libs/apis/statisticApi";

interface MonthlyCardsProps {
  monthlyData: MonthlyStatisticResponse | null;
}

function MonthlyCards({ monthlyData }: MonthlyCardsProps) {
  // 데이터가 없을 경우 로딩 메시지 표시
  const summary = monthlyData?.summary;
  if (!summary) {
    return <div className="p-4 text-center">데이터를 불러올 수 없습니다.</div>;
  }

  // 초 단위를 시간으로 변환
  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}`;
  };

  // 운행률 계산: 운행 차량 수 / 전체 차량 수

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">전체 보유 차량</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{summary.totalCarCount}</span>
            <span className="ml-2 text-sm font-medium text-gray-500">대</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">운행중 차량 수</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-blue-600">
              {summary.totalCarCount - summary.nonOperatingCarCount}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">대</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">월 평균 가동률</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-green-600">
              {summary.averageOperationRate.toFixed(0)}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">%</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">월 총 운행량</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-purple-600">{summary.totalDriveCount}</span>
            <span className="ml-2 text-sm font-medium text-gray-500">회</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">월 총 운행 시간</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-orange-600">
              {formatSeconds(summary.totalDrivingSeconds)}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">시간</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-500 mb-4">월 총 운행거리</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-cyan-600">
              {summary.totalDrivingDistanceKm.toFixed(0)}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-500">km</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyCards;
