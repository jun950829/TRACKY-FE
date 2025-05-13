import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import BizMonthlyCardStatistic from "./BizMonthlyCardStatistic";
import BizStatisticTable from "./BizStatisticTable";
import StatisticCharts from "./StatisticCharts";
import MonthlyDriveCountChart from "./MonthlyDriveCountChart";

import adminStatisticApiService from "@/libs/apis/adminStatisticApi";
import { BizList, bizListMock, BizStatistic, bizStatisticMock, GraphStats, graphStatsMock, HourlyDriveCounts, hourlyDriveCountsMock, MonthlyDriveCounts, monthlyDriveCountsMock} from "@/constants/mocks/adminStaticsMockData";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

function AdminStatisticSection() {
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiz, setSelectedBiz] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">업체별 통계</h1>
      </div>
        <BizStatisticTable
          data={bizList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBiz={selectedBiz}
          setSelectedBiz={setSelectedBiz}
        />
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{selectedBiz == '' ? '전체' : selectedBiz} 업체의 월별 통계</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              defaultMonth={selectedDate || undefined}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <BizMonthlyCardStatistic summary={bizStatistic} formatSeconds={formatSeconds} />
      <MonthlyDriveCountChart 
        monthlyData={monthlyDriveCounts}
        hourlyData={hourlyDriveCounts}
        selectedBiz={selectedBiz}
        selectedDate={selectedDate}
      />

      <h1 className="text-3xl font-bold">종합 통계</h1>
      <StatisticCharts graphStats={graphStats}
      />
    </div>
  );
}

export default AdminStatisticSection;
