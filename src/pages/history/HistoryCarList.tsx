import { useHistoryStore } from "@/stores/useHistoryStore";

interface HistoryListProps {
  onItemClick?: () => void;
}

const HistoryCarList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const { 
    driveResults, 
    searchType, 
    selectedDrive, 
    setSelectedRent, 
    setSelectedDrive
  } = useHistoryStore();

  // 주행 항목 클릭 핸들러
  const handleDriveClick = async (driveId: string) => {
    // 차량 검색 모드일 때
    const drive = driveResults.find(t => t.id === driveId);
    if (drive) {
      // 이 운행이 속한 렌트 찾기
      const rent = rentResults.find(r => r.rentUuid === drive.rentUuid);
      if (rent) {
        setSelectedRent(rent);
        setSelectedTrip(drive);
        
        if (onItemClick) {
          onItemClick();
        }
      }
    }
  };

  // 결과가 없을 때 표시할 메시지
  if (searchType === 'car' && driveResults.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
        {/* // 차량별 운행 검색 결과 목록 */}
        <div className="divide-y">
          {driveResults.map(trip => (
            <div key={trip.id} className="text-sm">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedTrip?.id === trip.id ? 'bg-gray-100' : ''}`}
                onClick={() => handleDriveClick(trip.id)}
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
    </div>
  );
};

export default HistoryCarList;