import React, { useState } from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { drivehistoryService } from '@/libs/apis/drivehistoryApi';

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, 'yyyy-MM-dd HH:mm');
  } catch {
    return dateStr;
  }
};

interface HistoryListProps {
  onItemClick?: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const { 
    rentResults, 
    tripResults, 
    searchType, 
    selectedRent, 
    selectedTrip, 
    setSelectedRent, 
    setSelectedTrip 
  } = useHistoryStore();

  // 각 rent의 drawer 상태를 개별적으로 관리
  const [openRents, setOpenRents] = useState<Set<string>>(new Set());

  // 렌트 항목 클릭 핸들러
  const handleRentClick = (rentUuid: string, isArrowClick: boolean = false) => {
    // 화살표 클릭 시에는 해당 렌트의 drawer 상태만 토글
    if (isArrowClick) {
      setOpenRents(prev => {
        const newSet = new Set(prev);
        if (newSet.has(rentUuid)) {
          newSet.delete(rentUuid);
        } else {
          newSet.add(rentUuid);
        }
        return newSet;
      });
      return;
    }

    // 일반 클릭 시에는 선택된 렌트만 업데이트
    const rent = rentResults.find(r => r.rentUuid === rentUuid);
    if (rent) {
      setSelectedRent(rent);
      
      if (onItemClick) {
        onItemClick();
      }
    }
  };

  // 트립 항목 클릭 핸들러
  const handleTripClick = async (tripId: string) => {
    // 예약 검색 모드일 때
    if (searchType === 'rent' && selectedRent) {
      const trip = selectedRent.trips.find(t => t.id === tripId);
      if (trip) {

        setSelectedTrip(trip);
        
        if (onItemClick) {
          onItemClick();
        }
      }
    } 
    // 운행 검색 모드일 때
    else if (searchType === 'trip') {
      const trip = tripResults.find(t => t.id === tripId);
      if (trip) {
        // 이 운행이 속한 렌트 찾기
        const rent = rentResults.find(r => r.rentUuid === trip.rentUuid);
        if (rent) {
          setSelectedRent(rent);
          setSelectedTrip(trip);
          
          if (onItemClick) {
            onItemClick();
          }
        }
      }
    }
  };

  // 결과가 없을 때 표시할 메시지
  if ((searchType === 'rent' && rentResults.length === 0) || 
      (searchType === 'trip' && tripResults.length === 0)) {
    return (
      <div className="p-4 text-center text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {searchType === 'rent' ? (
        // 예약 검색 결과 목록
        <div className="divide-y">
          {rentResults.map(rent => (
            <div key={rent.rentUuid} className="text-sm">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedRent?.rentUuid === rent.rentUuid ? 'bg-gray-100' : ''}`}
                onClick={(e) => {
                  // 화살표 영역 클릭이거나 drawer가 열려있는 경우
                  if ((e.target as HTMLElement).closest('.arrow-container') || openRents.has(rent.rentUuid)) {
                    handleRentClick(rent.rentUuid, true);
                  } else {
                    // drawer가 닫혀있는 경우에는 drawer를 열고
                    handleRentClick(rent.rentUuid, true);
                  }
                  // 선택은 항상 업데이트
                  handleRentClick(rent.rentUuid);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{rent.rentUuid}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {rent.renterName} | {rent.mdn}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2 arrow-container">
                  {openRents.has(rent.rentUuid) ? 
                    <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  }
                </div>
              </div>
              
              {/* 하위 운행 목록 */}
              {openRents.has(rent.rentUuid) && (
                <div className="bg-gray-50 pl-4 max-h-[300px] overflow-y-auto">
                  {rent.trips.map(trip => (
                    <div 
                      key={trip.id}
                      className={`p-2 pl-3 border-l-2 cursor-pointer hover:bg-gray-100 mb-1 ml-2 text-xs
                        ${selectedTrip?.id === trip.id ? 'border-black bg-gray-100' : 'border-gray-300'}`}
                      onClick={() => handleTripClick(trip.id)}
                    >
                      <div className="font-medium truncate">{trip.id}</div>
                      <div className="text-gray-500">
                        {formatDateTime(trip.startTime)} ~ {formatDateTime(trip.endTime)}
                      </div>
                      <div className="text-gray-500 mt-1 truncate">
                        {trip.startLocation} → {trip.endLocation}
                      </div>
                      <div className="mt-1 text-xs">
                        <span className="text-gray-700">거리:</span> {trip.distance.toFixed(1)}km | 
                        <span className="text-gray-700 ml-1">평균:</span> {trip.avgSpeed}km/h
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // 차량별 운행 검색 결과 목록
        <div className="divide-y">
          {tripResults.map(trip => (
            <div key={trip.id} className="text-sm">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedTrip?.id === trip.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleTripClick(trip.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">차량: {trip.mdn}</div>
                  <div className="text-xs text-gray-500 truncate">
                    예약: {trip.rentUuid}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(trip.startTime)} ~ {formatDateTime(trip.endTime)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {trip.startLocation} → {trip.endLocation}
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="text-gray-700">거리:</span> {trip.distance.toFixed(1)}km | 
                    <span className="text-gray-700 ml-1">평균:</span> {trip.avgSpeed}km/h
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList; 