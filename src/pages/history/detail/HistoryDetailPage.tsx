import React, { useState, useEffect, Suspense, lazy } from "react";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reverseGeocodeOSM } from "@/libs/utils/reverseGeocode";
import driveService from "@/libs/apis/driveApi";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";
import { getStatusLabel, getStatusBadgeClass } from "@/libs/utils/getClassUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Car, User, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HistoryMap = lazy(() => import("./HistoryMap")); // Lazy Load

const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
};

const HistoryDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedDriveId, driveDetail, setDriveDetail, setLoading, setError, isLoading } = useDriveListStore();
  const [onAddress, setOnAddress] = useState("주소 불러오는 중...");
  const [offAddress, setOffAddress] = useState("주소 불러오는 중...");

  useEffect(() => {
    const searchDriveId = selectedDriveId ?? localStorage.getItem("searchDriveId");

    if (!searchDriveId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await driveService.getDriveById(Number(searchDriveId));
        setDriveDetail(response.data);
        localStorage.setItem("searchDriveId", searchDriveId.toString());
      } catch (error) {
        console.error("운행 기록 상세 조회 실패:", error);
        setError("운행 기록 상세 조회 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!driveDetail) return;

    const { onLat, onLon, offLat, offLon } = driveDetail;

    if (
      typeof onLat !== "number" ||
      typeof onLon !== "number" ||
      typeof offLat !== "number" ||
      typeof offLon !== "number"
    ) {
      setOnAddress("좌표 없음");
      setOffAddress("좌표 없음");
      return;
    }

    const fetchAddress = async () => {
      try {
        const [on, off] = await Promise.all([
          reverseGeocodeOSM(onLat / 1_000_000, onLon / 1_000_000),
          reverseGeocodeOSM(offLat / 1_000_000, offLon / 1_000_000),
        ]);
        setOnAddress(on);
        setOffAddress(off);
      } catch {
        setOnAddress("주소 불러오기 실패");
        setOffAddress("주소 불러오기 실패");
      }
    };

    // 주소 로딩은 UI 렌더링 이후에 실행
    setTimeout(fetchAddress, 100);
  }, [driveDetail]);

  if (isLoading || !driveDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p>운행 상세 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="p-10 h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        {/* 지도 영역 */}
        <Card className="shadow-sm col-span-2">
          <CardHeader className="p-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                주행 경로
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <Suspense fallback={<div className="h-[200px] flex justify-center items-center text-gray-400">지도 로딩 중...</div>}>
              <HistoryMap
                gpsDataList={driveDetail.gpsDataList}
                startPoint={{ lat: driveDetail.onLat, lon: driveDetail.onLon, spd: 0, o_time: driveDetail.driveOnTime }}
                endPoint={{ lat: driveDetail.offLat, lon: driveDetail.offLon, spd: 0, o_time: driveDetail.driveOffTime }}
                height="200px"
              />
            </Suspense>
          </CardContent>
        </Card>

        {/* 기타 카드 렌더링 공통화 */}
        {[
          {
            icon: <Car className="h-4 w-4" />,
            title: "차량 정보",
            content: (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">차량 번호</div>
                    <div className="text-sm font-medium">{driveDetail.carPlate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">운행 상태</div>
                    <Badge className={getStatusBadgeClass(driveDetail.status, "car")}>
                      {getStatusLabel("car", driveDetail.status)}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-1" />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">운행 거리</div>
                    <div className="text-sm font-medium">{driveDetail.driveDistance?.toFixed(1) || 0} km</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">운행 시간</div>
                    <div className="text-sm font-medium">
                      {driveDetail.driveOffTime === null
                        ? calculateDriveDuration(driveDetail.driveOnTime, new Date().toISOString())
                        : calculateDriveDuration(driveDetail.driveOnTime, driveDetail.driveOffTime)}
                    </div>
                  </div>
                </div>
              </>
            ),
          },
          {
            icon: <User className="h-4 w-4" />,
            title: "사용자 정보",
            content: (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-500">이름</div>
                    <div className="text-sm font-medium">{driveDetail.renterName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">연락처</div>
                    <div className="text-sm font-medium">{driveDetail.renterPhone}</div>
                  </div>
                </div>
                <Separator className="my-1" />
                <div>
                  <div className="text-xs text-gray-500">목적</div>
                  <div className="text-sm font-medium">{driveDetail.purpose || "기타업무"}</div>
                </div>
              </>
            ),
          },
          {
            icon: <Clock className="h-4 w-4" />,
            title: "시간 정보",
            content: (
              <>
                <div>
                  <div className="text-xs text-gray-500">출발 시간</div>
                  <div className="text-sm font-medium">{formatDateTime(driveDetail.driveOnTime)}</div>
                </div>
                <Separator className="my-1" />
                <div>
                  <div className="text-xs text-gray-500">도착 시간</div>
                  <div className="text-sm font-medium">
                    {driveDetail.driveOffTime ? formatDateTime(driveDetail.driveOffTime) : "운행중"}
                  </div>
                </div>
                <Separator className="my-1" />
                <div>
                  <div className="text-xs text-gray-500">예약 기간</div>
                  <div className="text-sm font-medium">
                    {formatDateTime(driveDetail.rentStime)} ~ {formatDateTime(driveDetail.rentEtime)}
                  </div>
                </div>
              </>
            ),
          },
          {
            icon: <Target className="h-4 w-4" />,
            title: "위치 정보",
            content: (
              <>
                <div>
                  <div className="text-xs text-gray-500">출발지</div>
                  <div className="text-sm font-medium">{onAddress}</div>
                </div>
                <Separator className="my-1" />
                <div>
                  <div className="text-xs text-gray-500">도착지</div>
                  <div className="text-sm font-medium">{offAddress}</div>
                </div>
              </>
            ),
          },
        ].map(({ icon, title, content }, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardHeader className="p-2">
              <CardTitle className="text-base flex items-center gap-1">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-2">{content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryDetailPage;
