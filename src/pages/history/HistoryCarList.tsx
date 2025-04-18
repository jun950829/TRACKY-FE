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
    return <div className="p-4 text-center text-gray-500">검색 결과가 없습니다</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* 차량별 운행 검색 결과 목록 */}
      <div className="divide-y">
        {driveResults.map((car) => (
          <div key={car.carPlate} className="text-sm">
            {/* <div
              className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${selectedDrive?.driveId === drive.driveId ? "bg-gray-100" : ""}`}
              onClick={() => handleDriveClick(drive.driveId)}
            > */}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">차량 번호: {car.carPlate}</div>
                <div className="text-xs text-gray-500 truncate">차종: {car.carType}</div>
                
               
               
              </div>
            </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCarList;
