import React from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HistoryMap from './HistoryMap';

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'yyyy년 MM월 dd일 HH:mm:ss');
  } catch {
    return dateStr;
  }
};

const HistoryDetail: React.FC = () => {
  const { selectedDetail } = useHistoryStore();

  // 선택된 데이터가 없는 경우
  if (!selectedDetail) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-6">
        <p className="text-gray-500">
          좌측 목록에서 운행 기록을 선택하세요
        </p>
      </div>
    );
  }

  // 렌트 상태에 따른 배지 색상
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'INPROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-2 sm:p-4 h-full overflow-y-auto">
      <div className="space-y-3 sm:space-y-4">
        {/* 모바일 우선: 지도 컴포넌트 */}
        <Card className="shadow-sm">
          <CardHeader className="p-2 sm:p-4 pb-0">
            <CardTitle className="text-base sm:text-lg">주행 경로</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
            <HistoryMap 
              gpsDataList={selectedDetail.gpsDataList || []} 
              height="200px"
            />
          </CardContent>
        </Card>
        
        {/* 요약 정보 카드 (상단) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-500">총 주행 거리</div>
              <div className="text-base sm:text-xl font-bold mt-1">{selectedDetail.sum} km</div>
            </CardContent>
          </Card>
          
          {/* <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-500">최고 속도</div>
              <div className="text-base sm:text-xl font-bold mt-1">{selectedDetail.maxSpeed} km/h</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-500">평균 속도</div>
              <div className="text-base sm:text-xl font-bold mt-1">{selectedDetail.avgSpeed} km/h</div>
            </CardContent>
          </Card> */}
          
          <Card className="bg-gray-50 shadow-sm">
            <CardContent className="p-2 sm:p-3 text-center">
              <div className="text-xs sm:text-sm font-medium text-gray-500">운행 시간</div>
              <div className="text-base sm:text-xl font-bold mt-1">
                {(() => {
                  const start = new Date(selectedDetail.driveOnTime);
                  const end = new Date(selectedDetail.driveOffTime);
                  const diffMs = end.getTime() - start.getTime();
                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
                  return `${diffHrs}시간 ${diffMins}분 ${diffSecs}초`;
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 상세 정보 카드 (하단) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <Card className="shadow-sm">
            <CardHeader className="p-2 sm:p-3 pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg">운행 정보</CardTitle>
                <div className="text-xs font-medium text-gray-500 truncate">{selectedDetail.driveId}</div>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 pt-0">
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <div className="text-xs font-medium text-gray-500">출발 시간</div>
                  <div className="mt-1 truncate">{formatDateTime(selectedDetail.driveOnTime)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">도착 시간</div>
                  <div className="mt-1 truncate">{formatDateTime(selectedDetail.driveOffTime)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">출발 위치</div>
                  <div className="mt-1 truncate">{selectedDetail.onLat}, {selectedDetail.onLon}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">도착 위치</div>
                  <div className="mt-1 truncate">{selectedDetail.offLat}, {selectedDetail.offLon}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="p-2 sm:p-3 pb-1">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg">예약 정보</CardTitle>
                <Badge className={`text-xs px-2 py-0.5 ${getStatusBadgeColor(selectedDetail.rentStatus)}`}>
                  {selectedDetail.rentStatus === 'SCHEDULED' && '예약됨'}
                  {selectedDetail.rentStatus === 'INPROGRESS' && '진행중'}
                  {selectedDetail.rentStatus === 'COMPLETED' && '완료됨'}
                  {selectedDetail.rentStatus === 'CANCELED' && '취소됨'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 pt-0">
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <div className="text-xs font-medium text-gray-500">예약 ID</div>
                  <div className="mt-1 truncate">{selectedDetail.rentUuid}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">차량 ID</div>
                  <div className="mt-1 truncate">{selectedDetail.mdn}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">예약자</div>
                  <div className="mt-1 truncate">{selectedDetail.renterName}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">연락처</div>
                  <div className="mt-1 truncate">{selectedDetail.renterPhone}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-medium text-gray-500">대여 기간</div>
                  <div className="mt-1 truncate">
                    {formatDateTime(selectedDetail.driveOnTime).slice(0, 13)} ~ {formatDateTime(selectedDetail.driveOffTime).slice(0, 13)}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-medium text-gray-500">사용 목적</div>
                  <div className="mt-1 truncate">{selectedDetail.purpose}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail; 
