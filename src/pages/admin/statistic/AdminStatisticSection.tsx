import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  overallStatistics,
  vehicleStatistics,
  bizStatistics,
  monthlyRentalData,
  dailyActiveUsersData,
  vehicleTypeDistribution,
  bizRatingDistribution,
} from "@/constants/mocks/adminStaticsMockData";
import StatisticCards from "./StatisticCards";
import BizStatisticTable from "./BizStatisticTable";
import StatisticCharts from "./StatisticCharts";
import VehicleStatisticTable from "./VehicleStatisticTable";

export default function AdminStatisticSection() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">통계 대시보드</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <StatisticCards data={overallStatistics} />

      <Tabs defaultValue="vehicle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vehicle">차량 통계</TabsTrigger>
          <TabsTrigger value="biz">업체 통계</TabsTrigger>
          <TabsTrigger value="overall">통합 통계</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>차량 운영 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <VehicleStatisticTable data={vehicleStatistics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>업체별 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <BizStatisticTable data={bizStatistics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overall" className="space-y-4">
          <StatisticCharts
            monthlyRentalData={monthlyRentalData}
            dailyActiveUsersData={dailyActiveUsersData}
            vehicleTypeDistribution={vehicleTypeDistribution}
            bizRatingDistribution={bizRatingDistribution}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
