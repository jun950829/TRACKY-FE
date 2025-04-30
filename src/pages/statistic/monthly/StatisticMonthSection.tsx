import { useState, useEffect } from "react";
import MonthlyCards from "./MonthlyCards";
import MonthlyCharts from "./MonthlyCharts";
import { MonthlyStatisticResponse, statisticApiService } from "@/libs/apis/statisticApi";

interface StatisticMonthSectionProps {
  selectedDate?: Date;
}

function StatisticMonthSection({ selectedDate = new Date() }: StatisticMonthSectionProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyStatisticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setIsLoading(true);
      try {
        const data = await statisticApiService.getMonthlyStatistic(selectedDate);
        setMonthlyData(data);
      } catch (error) {
        console.error("월간 통계 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedDate]);

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="p-4 text-center">데이터 로딩 중...</div>
      ) : (
        <>
          <MonthlyCards monthlyData={monthlyData} />
          <MonthlyCharts monthlyData={monthlyData} />
        </>
      )}
    </div>
  );
}

export default StatisticMonthSection;
