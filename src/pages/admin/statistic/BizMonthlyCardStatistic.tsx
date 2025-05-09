// components/BizMonthlyCardStatistic.tsx
interface MonthlySummary {
  totalDriveCount: number;
  totalDrivingSeconds: number;
  totalDrivingDistanceKm: number;
}

interface Props {
  summary: MonthlySummary;
  formatSeconds: (seconds: number) => string;
}

const BizMonthlyCardStatistic = ({ summary, formatSeconds }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
};

export default BizMonthlyCardStatistic;
