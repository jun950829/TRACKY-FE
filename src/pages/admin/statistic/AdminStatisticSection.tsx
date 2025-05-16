import { useState, useEffect } from "react";
import BizMonthlyCardStatistic from "./BizMonthlyCardStatistic";
import BizStatisticTable from "./BizStatisticTable";
import StatisticCharts from "./StatisticCharts";
import MonthlyDriveCountChart from "./MonthlyDriveCountChart";
import StatisticDatePicker from "@/pages/statistic/StatisticDatePicker";

import adminStatisticApiService from "@/libs/apis/adminStatisticApi";
import { BizList, bizListMock, BizStatistic, bizStatisticMock, GraphStats, graphStatsMock, HourlyDriveCounts, hourlyDriveCountsMock, MonthlyDriveCounts, monthlyDriveCountsMock} from "@/constants/mocks/adminStaticsMockData";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function AdminStatisticSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiz, setSelectedBiz] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [bizList, setBizList] = useState<BizList[]>(bizListMock);
  const [bizStatistic, setBizStatistic] = useState<BizStatistic>(bizStatisticMock);
  const [monthlyDriveCounts, setMonthlyDriveCounts] = useState<MonthlyDriveCounts[]>(monthlyDriveCountsMock);
  const [hourlyDriveCounts, setHourlyDriveCounts] = useState<HourlyDriveCounts[]>(hourlyDriveCountsMock);
  const [graphStats, setGraphStats] = useState<GraphStats>(graphStatsMock);
  
  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  useEffect(() => {
    const fetchadminStatistic = async () => {
      setIsLoading(true);
      try {
        const bizList = await adminStatisticApiService.getAdminBizList();
        setBizList(bizList);

        const bizStatistic = await adminStatisticApiService.getAdminBizStatistic(selectedBiz, selectedDate);
        setBizStatistic(bizStatistic);
        
        const monthlyDriveCounts = await adminStatisticApiService.getMonthlyDriveCounts(selectedBiz, selectedDate);
        setMonthlyDriveCounts(monthlyDriveCounts);

        const hourlyDriveCounts = await adminStatisticApiService.getHourlyDriveCounts(selectedBiz, selectedDate);
        setHourlyDriveCounts(hourlyDriveCounts);

        const graphStats = await adminStatisticApiService.getGraphStats();
        setGraphStats(graphStats);
        
      } catch (error) {
        console.error("업체 목록 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchadminStatistic();
  }, [selectedBiz, selectedDate]);

  const handleDateChange = (dates: { start: Date; end: Date }) => {
    setSelectedDate(dates.start);
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 p-4 md:px-[80px] xl:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">업체별 통계</h1>
      </div>
      <div className="w-full">
        <BizStatisticTable
          data={bizList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBiz={selectedBiz}
          setSelectedBiz={setSelectedBiz}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-lg md:text-xl font-bold">{selectedBiz == '' ? '전체' : selectedBiz} 업체의 월별 통계</h3>
        <StatisticDatePicker
          selectedPeriod="month"
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          placeholder="월 선택"
        />
      </div>
        <BizMonthlyCardStatistic summary={bizStatistic} formatSeconds={formatSeconds} />
      <div className="w-full">
        <MonthlyDriveCountChart 
          monthlyData={monthlyDriveCounts}
          hourlyData={hourlyDriveCounts}
          selectedBiz={selectedBiz}
          selectedDate={selectedDate}
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold">종합 통계</h1>
      <div className="w-full">
        <StatisticCharts graphStats={graphStats} />
      </div>
    </div>
  );
}

export default AdminStatisticSection;
