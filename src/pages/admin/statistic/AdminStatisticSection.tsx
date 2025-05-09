import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import DailyStatisticCharts from "./DailyStatisticCharts";
import BizMonthlyCardStatistic from "./BizMonthlyCardStatistic";
import BizStatisticTable from "./BizStatisticTable";
import StatisticCharts from "./StatisticCharts";
import VehicleStatisticTable from "./VehicleStatisticTable";
import MonthlyDriveCountChart from "./MonthlyDriveCountChart";

import {
  bizRatingDistribution,
  bizStatistics,
  dailyActiveUsersData,
  monthlyRentalData,
  overallStatistics,
  vehicleStatistics,
  vehicleTypeDistribution,
} from "@/constants/mocks/adminStaticsMockData";

import { DailyStatisticResponse, statisticApiService } from "@/libs/apis/statisticApi";

function AdminStatisticSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyStatisticResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBiz, setSelectedBiz] = useState("");

  console.log(selectedBiz);
  // 임시 summary 데이터 (API 연동 가능)
  const monthlySummary = {
    totalDriveCount: 1423,
    totalDrivingSeconds: 58320,
    totalDrivingDistanceKm: 2191.3,
  };

  const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };
  const monthlyData = {
    labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
    values: [32, 45, 38, 52, 49, 60],
  };

  useEffect(() => {
    const fetchDailyData = async () => {
      setIsLoading(true);
      try {
        const data = await statisticApiService.getDailyStatistic(selectedDate);
        setDailyData(data);
      } catch (error) {
        console.error("일간 통계 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [selectedDate]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">업체별 통계 대시보드</h1>
      </div>

      <BizStatisticTable data={bizStatistics} setSelectedBiz={setSelectedBiz} />
      <BizMonthlyCardStatistic summary={monthlySummary} formatSeconds={formatSeconds} />
      <MonthlyDriveCountChart data={monthlyData} />

      <h1 className="text-3xl font-bold">총 업체 통계</h1>
      <Card>
        <CardHeader>
          <CardTitle>전일 시간별 운행량</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-sm text-gray-500">로딩 중...</div>
          ) : (
            <DailyStatisticCharts selectedDate={selectedDate} dailyData={dailyData} />
          )}
        </CardContent>
      </Card>

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
