import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverallStatistic } from "@/constants/mocks/adminStaticsMockData";

interface StatisticCardsProps {
  data: OverallStatistic;
}

function StatisticCards({ data }: StatisticCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 차량</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalVehicles}</div>
          <p className="text-xs text-blue-100">운행 중: {data.activeVehicles}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 렌트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalRentals}</div>
          <p className="text-xs text-green-100">월 성장률: {data.monthlyGrowth}%</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 운행거리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalDistance}km</div>
          <p className="text-xs text-purple-100">일일 활성 사용자: {data.dailyActiveUsers}</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.averageRating}</div>
          <p className="text-xs text-orange-100">/ 5.0</p>
        </CardContent>
      </Card>
    </div>
  );
} 

export default StatisticCards;