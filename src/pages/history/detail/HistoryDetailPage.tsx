import React, { useState, useEffect } from "react";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reverseGeocodeOSM } from "@/libs/utils/reverseGeocode";
import HistoryMap from "./HistoryMap";
import driveService from "@/libs/apis/driveApi";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";
import { getStatusLabel, getStatusBadgeClass } from "@/libs/utils/getClassUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Car, User, Target } from "lucide-react";

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
  } catch {
    return dateStr;
  }
};

const HistoryDetailPage: React.FC = () => {
  const { selectedDriveId, driveDetail, setDriveDetail, setLoading, setError } = useDriveListStore();
  const [onAddress, setOnAddress] = useState("주소 불러오는 중...");
  const [offAddress, setOffAddress] = useState("주소 불러오는 중...");

  useEffect(() => {
    getDriveById();
  }, [selectedDriveId]);

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

    const startLat = onLat / 1_000_000;
    const startLon = onLon / 1_000_000;
    const endLat = offLat / 1_000_000;
    const endLon = offLon / 1_000_000;

    const fetchAddress = async () => {
      try {
        const [on, off] = await Promise.all([
          reverseGeocodeOSM(startLat, startLon),
          reverseGeocodeOSM(endLat, endLon),
        ]);
        setOnAddress(on);
        setOffAddress(off);
      } catch {
        setOnAddress("주소 불러오기 실패");
        setOffAddress("주소 불러오기 실패");
      }
    };

    fetchAddress();
  }, [driveDetail]);

  if (!driveDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-4">
        <p className="text-gray-500">좌측 목록에서 운행 기록을 선택하세요</p>
      </div>
    );
  }

  async function getDriveById() {
    if (!selectedDriveId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await driveService.getDriveById(selectedDriveId);
      setDriveDetail(response.data);
    } catch (error) {
      console.error('운행 기록 상세 조회 실패:', error);
      setError('운행 기록 상세 조회 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-2 h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        {/* 지도 영역 */}
        <Card className="shadow-sm col-span-2">
          <CardHeader className="p-2">
            <CardTitle className="text-base flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              주행 경로
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <HistoryMap gpsDataList={driveDetail.gpsDataList || []} height="200px" />
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2">
            <CardTitle className="text-base flex items-center gap-1">
              <Car className="h-4 w-4" />
              차량 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">차량 번호</div>
                <div className="text-sm font-medium">{driveDetail.carPlate}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">운행 상태</div>
                <Badge className={getStatusBadgeClass(driveDetail.status, 'car')}>
                  {getStatusLabel('car', driveDetail.status)}
                </Badge>
              </div>
            </div>
            <Separator className="my-1" />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">운행 거리</div>
                <div className="text-sm font-medium">{driveDetail.driveDistance?.toFixed(1) || 0} km</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">운행 시간</div>
                <div className="text-sm font-medium">
                  {driveDetail.driveOffTime === null 
                    ? calculateDriveDuration(driveDetail.driveOnTime, new Date().toISOString())
                    : calculateDriveDuration(driveDetail.driveOnTime, driveDetail.driveOffTime)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 사용자 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2">
            <CardTitle className="text-base flex items-center gap-1">
              <User className="h-4 w-4" />
              사용자 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">이름</div>
                <div className="text-sm font-medium">{driveDetail.renterName}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-gray-500">연락처</div>
                <div className="text-sm font-medium">{driveDetail.renterPhone}</div>
              </div>
            </div>
            <Separator className="my-1" />
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">목적</div>
              <div className="text-sm font-medium">{driveDetail.purpose || '기타업무'}</div>
            </div>
          </CardContent>
        </Card>

        {/* 시간 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2">
            <CardTitle className="text-base flex items-center gap-1">
              <Clock className="h-4 w-4" />
              시간 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">출발 시간</div>
              <div className="text-sm font-medium">{formatDateTime(driveDetail.driveOnTime)}</div>
            </div>
            <Separator className="my-1" />
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">도착 시간</div>
              <div className="text-sm font-medium">
                {driveDetail.driveOffTime ? formatDateTime(driveDetail.driveOffTime) : "운행중"}
              </div>
            </div>
            <Separator className="my-1" />
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">예약 기간</div>
              <div className="text-sm font-medium">
                {formatDateTime(driveDetail.rentStime)} ~ {formatDateTime(driveDetail.rentEtime)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 위치 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2">
            <CardTitle className="text-base flex items-center gap-1">
              <Target className="h-4 w-4" />
              위치 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 space-y-2">
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">출발지</div>
              <div className="text-sm font-medium">{onAddress}</div>
            </div>
            <Separator className="my-1" />
            <div className="space-y-0.5">
              <div className="text-xs text-gray-500">도착지</div>
              <div className="text-sm font-medium">{offAddress}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
