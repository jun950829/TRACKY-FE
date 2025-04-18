import { useState } from 'react';
import StatisticTopLayer from './StatisticTopLayer';
import StatisticMonthSection from './monthly/StatisticMonthSection';
import StatisticDaySection from './daily/StatisticDaySection';

function StatisticPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'day'>('month');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <h1 className="text-xl font-semibold text-gray-900">전체 대시보드</h1>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">
            날짜 선택
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900">
            새로고침
          </button>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="px-6 py-4">
        <StatisticTopLayer
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </div>

      {/* 통계 섹션 */}
      {selectedPeriod === 'month' ? <StatisticMonthSection /> : <StatisticDaySection />}
    </div>
  );
}

export default StatisticPage; 