import React, { useEffect, useState } from "react";
import { useInfoStore } from "@/stores/useInfoStore";
import { reverseGeocodeOSM } from "@/libs/utils/reverseGeocode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/custom/StatusBadge";
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

function InfoResultSection() {
  const { rent, car, trips, isLoading } = useInfoStore();
  const [addresses, setAddresses] = useState<Record<number, { start: string; end: string }>>({});

  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance ?? 0), 0);

  useEffect(() => {
    if (!trips.length) return;

    const fetchAddresses = async () => {
      const updated: Record<number, { start: string; end: string }> = {};

      await Promise.all(
        trips.map(async (trip, idx) => {
          if (typeof trip.driveStartLat === "number" && typeof trip.driveStartLon === "number") {
            const startLat = trip.driveStartLat / 1_000_000;
            const startLon = trip.driveStartLon / 1_000_000;
            const startAddress = await reverseGeocodeOSM(startLat, startLon);

            let endAddress = "운행중";
            if (trip.driveEndLat && trip.driveEndLon) {
              const endLat = trip.driveEndLat / 1_000_000;
              const endLon = trip.driveEndLon / 1_000_000;
              endAddress = await reverseGeocodeOSM(endLat, endLon);
            }

            updated[idx] = { start: startAddress, end: endAddress };
          }
        })
      );

      setAddresses(updated);
    };

    fetchAddresses();
  }, [trips]);

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    } catch {
      return dateStr;
    }
  };

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-gray-600">정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!rent) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">예약 번호를 입력하여 조회해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 예약 정보 카드 */}
      <div className="md:flex md:space-x-4 md:space-y-0 space-y-4">
        <Card className="md:w-1/2">
          <CardHeader className="p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">예약 정보</CardTitle>
              <Badge className={`text-xs px-2 py-1 ${getStatusBadgeColor(rent.rentStatus)}`}>
                {
                  {
                    SCHEDULED: "예약됨",
                    INPROGRESS: "진행중",
                    COMPLETED: "완료됨",
                    CANCELED: "취소됨",
                  }[rent.rentStatus]
                }
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["예약 번호", rent.rent_uuid],
                ["예약자", rent.renterName],
                ["연락처", rent.renterPhone],
                ["목적", rent.purpose],
                ["대여 시간", formatDateTime(rent.rentStime)],
                ["반납 시간", formatDateTime(rent.rentEtime)],
                ["대여 위치", rent.rentLoc],
                ["반납 위치", rent.returnLoc],
              ].map(([label, value], i) => (
                <div key={i}>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">{label}</h3>
                  <p className="mt-1 text-sm">{value}</p>
                </div>
              ))}
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
                {[
                  ["차량 번호", car.carPlate],
                  ["차종", car.carType],
                  ["연식", `${car.carYear}년식`],
                  ["용도", car.purpose],
                ].map(([label, value], i) => (
                  <div key={i}>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-500">{label}</h3>
                    <p className="mt-1 text-sm">{value}</p>
                  </div>
                ))}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">상태</h3>
                  <p className="mt-1 text-sm">
                    <StatusBadge status={car.status} type="car" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 운행 정보 탭 */}
      {trips.length > 0 && (
        <Tabs defaultValue="list">
          <CardHeader className="px-0 pt-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">운행 정보</CardTitle>
              <TabsList className="h-8">
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
                      {trips.map((trip, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-xs p-2">
                            {formatDateTime(trip.oTime)}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {trip.offTime ? formatDateTime(trip.offTime) : "-"}
                          </TableCell>
                          <TableCell className="text-xs p-2">{trip.distance.toFixed(1)}</TableCell>
                          <TableCell className="text-xs p-2">
                            {addresses[idx]?.start ?? "주소 불러오는 중..."}
                          </TableCell>
                          <TableCell className="text-xs p-2">
                            {addresses[idx]?.end ?? "주소 불러오는 중..."}
                          </TableCell>
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
