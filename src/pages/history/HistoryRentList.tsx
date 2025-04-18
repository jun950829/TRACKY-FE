import React, { useEffect, useState } from "react";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { drivehistoryService } from "@/libs/apis/drivehistoryApi";
import { use } from "chai";

// 날짜 포맷 헬퍼 함수
const formatDateTime = (dateStr: string) => {

  if(dateStr === null) {
    return "운행중"
  }

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

const HistoryRentList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const {
    rentResults,
    searchType,
    selectedRent,
    selectedDrive,
    selectedDetail,
    setSelectedRent,
    setSelectedDetail,
  } = useHistoryStore();

  // 각 rent의 drawer 상태를 개별적으로 관리
  const [openRents, setOpenRents] = useState<Set<string>>(new Set());

  // 렌트 항목 클릭 핸들러
  const handleRentClick = (rentUuid: string, isArrowClick: boolean = false) => {
    // 화살표 클릭 시에는 해당 렌트의 drawer 상태만 토글
    if (isArrowClick) {
      setOpenRents((prev) => {
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
    const rent = rentResults.find((r) => r.rentUuid === rentUuid);
    if (rent) {
      setSelectedRent(rent);
    }
  };

  // 트립 항목 클릭 핸들러
  const handleDriveClick = async (driveId: number) => {
    // 예약 검색 모드일 때
    if (searchType === "rent" && selectedRent) {
      // 운행 정보를 클릭했을 때 sheet 닫기
      if (onItemClick) {
        onItemClick();
      }

      // 차량 검색 모드일 때
      const response = await drivehistoryService.getDriveDetail(driveId);
      setSelectedDetail(response.data);
    }
  };

  // 결과가 없을 때 표시할 메시지
  if (searchType === "rent" && rentResults.length === 0) {
    return <div className="p-4 text-center text-gray-500">검색 결과가 없습니다</div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      {searchType === "rent" ? (
        // 예약 검색 결과 목록
        <div className="divide-y">
          {rentResults.map((rent) => (
            <div key={rent.rentUuid} className="text-sm">
              <div
                className={`p-3 cursor-pointer transition-colors duration-200 flex justify-between items-center
                  ${selectedRent?.rentUuid === rent.rentUuid 
                    ? "bg-blue-50 border-l-4 border-blue-500" 
                    : "hover:bg-gray-50"}`}
                onClick={(e) => {
                  // 화살표 영역 클릭이거나 drawer가 열려있는 경우
                  if (
                    (e.target as HTMLElement).closest(".arrow-container") ||
                    openRents.has(rent.rentUuid)
                  ) {
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
                  <div className={`font-medium truncate ${selectedRent?.rentUuid === rent.rentUuid ? "text-blue-700" : ""}`}>
                    예약 번호 : {rent.rentUuid}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    <strong>{rent.renterName}</strong> | 차량 관리번호 <strong>{rent.mdn}</strong>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}
                  </div>
                </div>

                {rent.drivelist.length === 0 ? (
                  <div className="flex-shrink-0 ml-2 w-10">
                    <div className="h-5 text-gray-500 text-xs">운행 전</div>
                  </div>
                ) : (
                  <div className="flex-shrink-0 ml-2 arrow-container">
                    {openRents.has(rent.rentUuid) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                )}
              </div>

              {/* 하위 운행 목록 */}
              {openRents.has(rent.rentUuid) && (
                <div className="bg-gray-50 pl-4 max-h-[300px] overflow-y-auto">
                  {rent.drivelist.map((drive, idx: number) => (
                    <div
                      key={idx}
                      className={`p-2 pl-3 border-l-2 cursor-pointer transition-colors duration-200 mb-1 ml-2 text-xs
                        ${selectedDetail?.driveId === drive.driveId 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-300 hover:bg-gray-100"}`}
                      onClick={() => handleDriveClick(drive.driveId)}
                    >
                      <div className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-500"}`}>운행 ID : {drive.driveId}</div>
                      <div className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-500"}`}>
                        {formatDateTime(drive.driveOnTime)} ~ {formatDateTime(drive.driveOffTime)}
                      </div>
                      <div className="mt-1 text-xs">
                        <span className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-700"}`}>
                          거리:
                        </span>{" "}
                        {(drive.sum * 0.001).toFixed(2)}km
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default HistoryRentList;
