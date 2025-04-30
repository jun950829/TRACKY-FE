import React, { useState, useEffect } from "react";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reverseGeocodeOSM } from "@/libs/utils/reverseGeocode";
import StatusBadge from "@/components/custom/StatusBadge";
import HistoryMap from "./HistoryMap";
import driveService from "@/libs/apis/driveApi";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";
import { getStatusLabel, getStatusBadgeClass } from "@/libs/utils/getClassUtils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, MapPin, Car, User, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "yyyy년 MM월 dd일 HH:mm:ss");
  } catch {
    return dateStr;
  }
};

const HistoryDetailPage: React.FC = () => {
  const navigate = useNavigate();
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

    // 정수형 좌표 → 실수형으로 변환
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
      } catch (err) {
        setOnAddress("주소 불러오기 실패");
        setOffAddress("주소 불러오기 실패");
      }
    };

    fetchAddress();
  }, [driveDetail]);

  // 선택된 데이터가 없는 경우
  if (!driveDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-6">
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
            {driveDetail?.gpsDataList ? (
              <HistoryMap 
                gpsDataList={driveDetail.gpsDataList} 
                startPoint={{ lat: driveDetail.onLat, lon: driveDetail.onLon, spd: 0, o_time: driveDetail.driveOnTime }}
                endPoint={{ lat: driveDetail.offLat, lon: driveDetail.offLon, spd: 0, o_time: driveDetail.driveOffTime }}
                height="200px" 
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">경로 데이터를 불러오는 중...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2 sm:p-4 sm:pb-0 pb-0">
            <CardTitle className="text-base sm:text-lg">주행 경로</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <HistoryMap gpsDataList={driveDetail.gpsDataList || []} height="200px" />
          </CardContent>
        </Card>

        {/* 요약 정보 카드 (상단) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-sm text-gray-500">출발</div>
              <div className="text-base font-medium">{onAddress}</div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDateTime(driveDetail.onTime)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-sm text-gray-500">도착</div>
              <div className="text-base font-medium">{offAddress}</div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDateTime(driveDetail.offTime)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상세 정보 카드 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2 sm:p-4 sm:pb-0 pb-0">
            <CardTitle className="text-base sm:text-lg">상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">차량 번호</div>
                <div className="text-base font-medium">{driveDetail.carPlate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">운행 상태</div>
                <div className="mt-1">
                  <StatusBadge status={driveDetail.status} type="drive" />
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">운행 거리</div>
                <div className="text-base font-medium">
                  {driveDetail.driveDistance?.toFixed(1) || 0} km
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">운행 시간</div>
                <div className="text-base font-medium">
                  {driveDetail.driveDuration || 0} 분
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
