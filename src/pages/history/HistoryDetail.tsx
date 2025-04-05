import React from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import HistoryMap from './HistoryMap';

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'yyyy년 MM월 dd일 HH:mm');
  } catch {
    return dateStr;
  }
};

interface HistoryDetailProps {
  onBackClick?: () => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ onBackClick }) => {
  const { selectedRent, selectedTrip } = useHistoryStore();

  // 선택된 데이터가 없는 경우
  if (!selectedTrip || !selectedRent) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md p-6">
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
    <div className="space-y-4 bg-white rounded-lg shadow-md p-4">
      {/* 모바일 뷰에서 뒤로가기 버튼 */}
      <div className="md:hidden mb-2">
        <button 
          className="flex items-center text-sm text-gray-600"
          onClick={onBackClick}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> 
          목록으로 돌아가기
        </button>
      </div>
      
      {/* 요약 정보 카드 (상단) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gray-50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-gray-500">총 주행 거리</div>
            <div className="text-2xl font-bold mt-1">{selectedTrip.distance.toFixed(1)} km</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-gray-500">최고 속도</div>
            <div className="text-2xl font-bold mt-1">{selectedTrip.maxSpeed} km/h</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-gray-500">평균 속도</div>
            <div className="text-2xl font-bold mt-1">{selectedTrip.avgSpeed} km/h</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-sm font-medium text-gray-500">운행 시간</div>
            <div className="text-2xl font-bold mt-1">
              {(() => {
                const start = new Date(selectedTrip.startTime);
                const end = new Date(selectedTrip.endTime);
                const diffMs = end.getTime() - start.getTime();
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                return `${diffHrs}시간 ${diffMins}분`;
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 지도 컴포넌트 */}
      <Card className="shadow-sm">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-lg">주행 경로</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <HistoryMap 
            points={selectedTrip.points} 
            height="400px"
            tripId={selectedTrip.id}
          />
        </CardContent>
      </Card>
      
      {/* 상세 정보 카드 (하단) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">운행 정보</CardTitle>
              <div className="text-xs font-medium text-gray-500">{selectedTrip.id}</div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs font-medium text-gray-500">출발 시간</div>
                <div className="mt-1">{formatDateTime(selectedTrip.startTime)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">도착 시간</div>
                <div className="mt-1">{formatDateTime(selectedTrip.endTime)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">출발 위치</div>
                <div className="mt-1">{selectedTrip.startLocation}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">도착 위치</div>
                <div className="mt-1">{selectedTrip.endLocation}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">예약 정보</CardTitle>
              <Badge className={`text-xs px-2 py-1 ${getStatusBadgeColor(selectedRent.rentStatus)}`}>
                {selectedRent.rentStatus === 'SCHEDULED' && '예약됨'}
                {selectedRent.rentStatus === 'INPROGRESS' && '진행중'}
                {selectedRent.rentStatus === 'COMPLETED' && '완료됨'}
                {selectedRent.rentStatus === 'CANCELED' && '취소됨'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs font-medium text-gray-500">예약 ID</div>
                <div className="mt-1">{selectedRent.rentUuid}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">차량 ID</div>
                <div className="mt-1">{selectedRent.mdn}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">예약자</div>
                <div className="mt-1">{selectedRent.renterName}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">연락처</div>
                <div className="mt-1">{selectedRent.renterPhone}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">대여 기간</div>
                <div className="mt-1">
                  {formatDateTime(selectedRent.rentStime).slice(0, 13)} ~ {formatDateTime(selectedRent.rentEtime).slice(0, 13)}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">사용 목적</div>
                <div className="mt-1">{selectedRent.purpose}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryDetail; 