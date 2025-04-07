import React from "react";
import { useInfoStore } from "@/stores/useInfoStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { TripInfo } from "@/stores/useInfoStore";

function InfoResultSection() {
  const { rent, car, trips, isLoading } = useInfoStore();

  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance ?? 0), 0);

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="text-center py-8 sm:py-16">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
        <p className="text-sm sm:text-base text-gray-600">정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 데이터가 없는 경우 안내 메시지 표시
  if (!rent) {
    return (
      <div className="text-center text-gray-500 py-6 sm:py-10">
        <p className="text-sm sm:text-base">
          예약 정보가 없습니다. 예약 ID를 입력하여 조회해주세요.
        </p>
      </div>
    );
  }

  // 상태에 따른 배지 색상 설정
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "INPROGRESS":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 날짜 포맷팅 함수
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    } catch {
      return dateString;
    }
  };

  // 운행 정보 표시 여부 확인
  const hasTripData = trips && trips.length > 0;

  return (
    <div className="space-y-4">
      <div className="md:flex md:space-x-4 md:space-y-0 space-y-4">
        {/* 예약 정보 카드 */}
        <Card className="md:w-1/2">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">예약 정보</CardTitle>
              <Badge className={`text-xs px-2 py-1 ${getStatusBadgeColor(rent.rentStatus)}`}>
                {rent.rentStatus === "SCHEDULED" && "예약됨"}
                {rent.rentStatus === "INPROGRESS" && "진행중"}
                {rent.rentStatus === "COMPLETED" && "완료됨"}
                {rent.rentStatus === "CANCELED" && "취소됨"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">예약 ID</h3>
                <p className="mt-1 text-sm">{rent.rent_uuid}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">예약자</h3>
                <p className="mt-1 text-sm">{rent.renterName}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">연락처</h3>
                <p className="mt-1 text-sm">{rent.renterPhone}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">목적</h3>
                <p className="mt-1 text-sm">{rent.purpose}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">대여 시간</h3>
                <p className="mt-1 text-sm">{formatDateTime(rent.rentStime)}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">반납 시간</h3>
                <p className="mt-1 text-sm">{formatDateTime(rent.rentEtime)}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">대여 위치</h3>
                <p className="mt-1 text-sm">{rent.rentLoc}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">반납 위치</h3>
                <p className="mt-1 text-sm">{rent.returnLoc}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 차량 정보 카드 */}
        {car && (
          <Card className="md:w-1/2">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">차량 정보</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">차량 번호</h3>
                  <p className="mt-1 text-sm">{car.carPlate}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">차종</h3>
                  <p className="mt-1 text-sm">{car.carType}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">연식</h3>
                  <p className="mt-1 text-sm">{car.carYear}년식</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">용도</h3>
                  <p className="mt-1 text-sm">{car.purpose}</p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">상태</h3>
                  <p className="mt-1 text-sm">{car.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 운행 정보 탭 */}
      {hasTripData && (
        <Tabs defaultValue="list">
          <CardHeader className="px-0 pt-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <CardTitle className="text-lg mb-2 sm:mb-0">운행 정보</CardTitle>
              <TabsList className="h-9">
                <TabsTrigger value="list" className="text-xs px-3 py-1">
                  목록
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-xs px-3 py-1">
                  통계
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-2 sm:p-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">시동 켠 시간</TableHead>
                        <TableHead className="text-xs">시동 끈 시간</TableHead>
                        <TableHead className="text-xs">주행 거리 (km)</TableHead>
                        <TableHead className="text-xs">시작 위치</TableHead>
                        <TableHead className="text-xs">종료 위치</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trips.map((trip: TripInfo, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="text-xs p-2">
                            {formatDateTime(trip.oTime)}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {trip.offTime ? formatDateTime(trip.offTime) : "-"}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {typeof trip.distance === "number" ? trip.distance.toFixed(1) : "0.0"}
                          </TableCell>
                          <TableCell className="text-xs p-2">{trip.startAddress}</TableCell>
                          <TableCell className="text-xs p-2">{trip.endAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <h3 className="text-xs font-medium text-gray-500">총 운행 기록</h3>
                    <p className="text-xl font-bold mt-1">{trips.length}회</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <h3 className="text-xs font-medium text-gray-500">총 주행 거리</h3>
                    <p className="text-xl font-bold mt-1">{totalDistance.toFixed(1)} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default InfoResultSection;
