import PageHeader from "@/components/custom/PageHeader";
import StatisticTopLayer from "./StatisticTopLayer";
import { useState } from "react";
import StatisticMonthSection from "./monthly/StatisticMonthSection";
import StatisticDailySection from "./daily/StatisticDailySection";
import StatisticCarSection from "./StatisticCarSection";

function StatisticMain() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'day'>('month');

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="max-w-[1920px] mx-auto p-8">
        {/* 헤더 섹션 */}
        <div className="mb-6">
          <PageHeader title="관제 통계 분석" size="2xl"/>
        </div>

        {/* 통계 섹션 */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StatisticTopLayer 
              selectedPeriod={selectedPeriod} 
              setSelectedPeriod={setSelectedPeriod} 
            />
            {/* 기간별 통계 */}
            <div className="p-6">
              {selectedPeriod === 'month' && <StatisticMonthSection />}
              {selectedPeriod === 'day' && <StatisticDailySection />}
            </div>
          </div>

          {/* 차량별 통계 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">차량별 통계</h2>
            </div>
            <div className="p-6">
              <StatisticCarSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticMain;
