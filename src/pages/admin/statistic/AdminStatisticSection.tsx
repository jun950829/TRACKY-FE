import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import BizMonthlyCardStatistic from "./BizMonthlyCardStatistic";
import BizStatisticTable from "./BizStatisticTable";
import StatisticCharts from "./StatisticCharts";
import MonthlyDriveCountChart from "./MonthlyDriveCountChart";

// import {
//   BizList,
//   bizListMock,
//   bizRatingDistribution,
//   BizStatistic,
//   bizStatistics,
//   dailyActiveUsersData,
//   monthlyRentalData,
//   overallStatistics,
//   vehicleStatistics,
//   vehicleTypeDistribution,
// } from "@/constants/mocks/adminStaticsMockData";

import adminStatisticApiService from "@/libs/apis/adminStatisticApi";
import { BizList, bizListMock, bizRatingDistribution, BizStatistic, bizStatisticMock, dailyActiveUsersData, MonthlyDriveCounts, monthlyDriveCountsMock, monthlyRentalData, vehicleTypeDistribution } from "@/constants/mocks/adminStaticsMockData";

function AdminStatisticSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bizList, setBizList] = useState<BizList[]>(bizListMock);
  const [bizStatistic, setBizStatistic] = useState<BizStatistic>(bizStatisticMock);
  const [monthlyDriveCounts, setMonthlyDriveCounts] = useState<MonthlyDriveCounts[]>(monthlyDriveCountsMock);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState("");

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
        console.log('monthlyDriveCounts', monthlyDriveCounts);

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
        <h1 className="text-3xl font-bold">업체별 통계 대시보드</h1>
      </div>

      <BizStatisticTable 
        data={bizList} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} 
        selectedBiz={selectedBiz}
        setSelectedBiz={setSelectedBiz}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate} 
      />
      <BizMonthlyCardStatistic summary={bizStatistic} formatSeconds={formatSeconds} />
      <MonthlyDriveCountChart data={monthlyDriveCounts} />

      <h1 className="text-3xl font-bold">총 업체 통계</h1>
      {/* <Card>
        <CardHeader>
          <CardTitle>전일 시간별 운행량</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-sm text-gray-500">로딩 중...</div>
          ) : (
            <DailyStatisticCharts selectedDate={selectedDate} dailyData={bizList} />
          )}
        </CardContent>
      </Card> */}

      <StatisticCharts
        monthlyRentalData={monthlyRentalData}
        dailyActiveUsersData={dailyActiveUsersData}
        vehicleTypeDistribution={vehicleTypeDistribution}
        bizRatingDistribution={bizRatingDistribution}
      />
    </div>
  );
}

export default AdminStatisticSection;
