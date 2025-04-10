import { format } from 'date-fns';
import { drivehistoryService } from "@/libs/apis/drivehistoryApi";
import { useHistoryStore } from "@/stores/useHistoryStore";

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

const HistoryCarList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const { 
    driveResults, 
    searchType, 
    selectedDrive, 
    setSelectedDetail
  } = useHistoryStore();

  // 주행 항목 클릭 핸들러
  const handleDriveClick = async (driveId: number) => {

    if( onItemClick ) {
      onItemClick();
    }

    // 차량 검색 모드일 때
    const response = await drivehistoryService.getDriveDetail(driveId);

    setSelectedDetail(response.data);

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
        {/* 차량별 운행 검색 결과 목록 */}
        <div className="divide-y">
          {driveResults.map(drive => (
            <div key={drive.driveId} className="text-sm">
              <div 
                className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedDrive?.driveId === drive.driveId ? 'bg-gray-100' : ''}`}
                onClick={() => handleDriveClick(drive.driveId)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">차량 관리번호: {drive.mdn}</div>
                  <div className="text-xs text-gray-500 truncate">
                    예약: {drive.rentUuid}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(drive.driveOnTime)} ~ {formatDateTime(drive.driveOffTime)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {drive.onLat}, {drive.onLon} → {drive.offLat}, {drive.offLon}
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="text-gray-700">거리:</span> {drive.sum.toFixed(1)}km | 
                    {/* <span className="text-gray-700 ml-1">평균:</span> {drive.avgSpeed}km/h */}
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