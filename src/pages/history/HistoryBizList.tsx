import React, { useEffect, useState } from "react";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { drivehistoryService } from "@/libs/apis/drivehistoryApi";

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

const HistoryBizList: React.FC<HistoryListProps> = ({ onItemClick }) => {
  const {
    bizResults,
    searchType,
    selectedBiz,
    selectedDetail,
    setSelectedBiz,
    setSelectedDetail,
  } = useHistoryStore();

  // 각 biz의 drawer 상태를 개별적으로 관리
  const [openBiz, setOpenBiz] = useState<Set<string>>(new Set());

  // 업체 항목 클릭 핸들러
  const handleBizClick = (bizId: string, isArrowClick: boolean = false) => {
    // 화살표 클릭 시에는 해당 업체의 drawer 상태만 토글
    if (isArrowClick) {
      setOpenBiz((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(bizId)) {
          newSet.delete(bizId);
        } else {
          newSet.add(bizId);
        }
        return newSet;
      });
      return;
    }

    // 일반 클릭 시에는 선택된 업체만 업데이트
    const biz = bizResults.find((b) => b.bizId === bizId);
    if (biz) {
      setSelectedBiz(biz);
    }
  };

  // 트립 항목 클릭 핸들러
  const handleDriveClick = async (driveId: number) => {
    // 업체 검색 모드일 때
    if (searchType === "biz" && selectedBiz) {
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
  if (searchType === "biz" && bizResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
      {searchType === "biz" ? (
        // 업체 검색 결과 목록
        <div className="divide-y divide-gray-100">
          {bizResults.map((biz) => (
            <div key={biz.bizId} className="text-sm">
              <div
                className={`p-4 cursor-pointer transition-all duration-200 flex justify-between items-center
                  ${selectedBiz?.bizId === biz.bizId 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500" 
                    : "hover:bg-gray-50"}`}
                onClick={(e) => {
                  // 화살표 영역 클릭이거나 drawer가 열려있는 경우
                  if (
                    (e.target as HTMLElement).closest(".arrow-container") ||
                    openBiz.has(biz.bizId)
                  ) {
                    handleBizClick(biz.bizId, true);
                  } else {
                    // drawer가 닫혀있는 경우에는 drawer를 열고
                    handleBizClick(biz.bizId, true);
                  }
                  // 선택은 항상 업데이트
                  handleBizClick(biz.bizId);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${selectedBiz?.bizId === biz.bizId ? "text-blue-700" : "text-gray-800"}`}>
                    업체명 : {biz.bizName}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    <strong className="text-gray-700">{biz.managerName}</strong> | 사업자번호 <strong className="text-gray-700">{biz.businessNumber}</strong>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDateTime(biz.createdAt)} ~ {formatDateTime(biz.updatedAt)}
                  </div>
                </div>

                {biz.drivelist.length === 0 ? (
                  <div className="flex-shrink-0 ml-2 w-10">
                    <div className="h-5 text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">운행 전</div>
                  </div>
                ) : (
                  <div className="flex-shrink-0 ml-2 arrow-container">
                    {openBiz.has(biz.bizId) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                    )}
                  </div>
                )}
              </div>

              {/* 하위 운행 목록 */}
              {openBiz.has(biz.bizId) && (
                <div className="bg-gray-50 pl-4 max-h-[300px] overflow-y-auto">
                  {biz.drivelist.map((drive, idx: number) => (
                    <></>
                    // <div
                    //   key={idx}
                    //   className={`p-3 pl-4 border-l-2 cursor-pointer transition-all duration-200 mb-1 ml-2 text-xs
                    //     ${selectedDetail?.driveId === drive.driveId 
                    //       ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100" 
                    //       : "border-gray-200 hover:bg-gray-100"}`}
                    //   onClick={() => handleDriveClick(drive.driveId)}
                    // >
                    //   <div className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-700"}`}>
                    //     운행 ID : {drive.driveId}
                    //   </div>
                    //   <div className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-600"} mt-1`}>
                    //     {formatDateTime(drive.driveOnTime)} ~ {formatDateTime(drive.driveOffTime)}
                    //   </div>
                    //   <div className="mt-1">
                    //     <span className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-700"}`}>
                    //       거리:
                    //     </span>{" "}
                    //     <span className={`${selectedDetail?.driveId === drive.driveId ? "text-blue-700" : "text-gray-600"}`}>
                    //       {(drive.sum * 0.001).toFixed(2)}km
                    //     </span>
                    //   </div>
                    // </div>
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

export default HistoryBizList; 