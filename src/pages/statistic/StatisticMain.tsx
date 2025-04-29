import PageHeader from "@/components/custom/PageHeader";
import StatisticTopLayer from "./StatisticTopLayer";
import { useState } from "react";
import StatisticMonthSection from "./monthly/StatisticMonthSection";
import StatisticDailySection from "./daily/StatisticDailySection";
import StatisticCarSection from "./car/StatisticCarSection";
import { startOfMonth, endOfMonth } from "date-fns";

function StatisticMain() {
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "day">("month");
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: selectedPeriod === "month" ? startOfMonth(new Date()) : new Date(),
    end: selectedPeriod === "month" ? endOfMonth(new Date()) : new Date(),
  });

  const handleDateChange = (dates: { start: Date; end: Date }) => {
    setSelectedDateRange(dates);
    // 여기에서 선택된 날짜 범위에 따른 데이터 fetch 로직을 추가  };
  };

  return (
    <div className="w-full h-screen overflow-auto bg-gray-50/50">
      <div className="max-w-[1920px] mx-auto p-8">
        {/* 헤더 섹션 */}
        <div className="mb-6">
          <PageHeader title="관제 통계 분석" size="2xl" />
        </div>

        {/* 통계 섹션 */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StatisticTopLayer
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={setSelectedPeriod}
              selectedDateRange={selectedDateRange}
              onDateChange={handleDateChange}
            />
            {/* 기간별 통계 */}
            <div className="p-6">
              {selectedPeriod === "month" && (
                <StatisticMonthSection selectedDate={selectedDateRange.start} />
              )}
              {selectedPeriod === "day" && (
                <StatisticDailySection selectedDate={selectedDateRange.start} />
              )}
            </div>
          </div>

          {/* 차량별 통계 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <StatisticCarSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticMain;
