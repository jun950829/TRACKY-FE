import { format } from "date-fns";
import { drivehistoryService } from "@/libs/apis/drivehistoryApi";
import { useHistoryStore } from "@/stores/useHistoryStore";

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return format(date, "yyyy-MM-dd HH:mm");
  } catch {
    return dateStr;
  }
};

interface HistoryListProps {
  onItemClick?: () => void;
}

const HistoryCarList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const { driveResults, searchType, selectedDrive, setSelectedDetail } = useHistoryStore();

  // 주행 항목 클릭 핸들러
  const handleDriveClick = async (driveId: number) => {
    if (onItemClick) {
      onItemClick();
    }

    // 차량 검색 모드일 때
    const response = await drivehistoryService.getDriveDetail(driveId);

    setSelectedDetail(response.data);
  };

  // 결과가 없을 때 표시할 메시지
  if (searchType === "car" && driveResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
      <div className="divide-y divide-gray-100">
        {driveResults.map((car) => (
          <div key={car.carPlate} className="text-sm">
            <div className="p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  차량 번호: {car.carPlate}
                </div>
                <div className="text-xs text-gray-600 truncate mt-1">
                  차종: {car.carType}
                </div>
                {car.driveOnTime && car.driveOffTime && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDateTime(car.driveOnTime)} ~ {formatDateTime(car.driveOffTime)}
                  </div>
                )}
                {car.sum && (
                  <div className="mt-1">
                    <span className="text-gray-700">거리:</span>{" "}
                    <span className="text-gray-600">{(car.sum * 0.001).toFixed(2)}km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCarList;
