import { useState, useEffect } from "react";
import DailyCards from "./DailyCards";
import DailyCharts from "./DailyCharts";
import { DailyStatisticResponse, statisticApiService } from "@/libs/apis/statisticApi";

interface StatisticDailySectionProps {
  selectedDate: Date;
}

function StatisticDailySection({ selectedDate }: StatisticDailySectionProps) {
  const [dailyData, setDailyData] = useState<DailyStatisticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDailyData = async () => {
      setIsLoading(true);
      try {
        const data = await statisticApiService.getDailyStatistic(selectedDate);
        setDailyData(data);
      } catch (error) {
        console.error("일간 통계 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="p-4 text-center">데이터 로딩 중...</div>
      ) : (
        <>
          <DailyCards dailyData={dailyData} />
          <DailyCharts selectedDate={selectedDate} dailyData={dailyData} />
        </>
      )}
    </div>
  );
}

export default StatisticDailySection;
