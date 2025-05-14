import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  noText?: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  noText = false,
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
}) => {
  // 표시할 페이지 버튼 개수
  const maxPageButtons = 5;

  // 페이지 버튼 범위 계산
  const getPageRange = () => {
    if (totalPages <= 0) return [];

    const halfMax = Math.floor(maxPageButtons / 2);
    let start = Math.max(currentPage - halfMax, 0);
    const end = Math.min(start + maxPageButtons - 1, totalPages - 1);

    // 표시할 버튼 개수가 maxPageButtons보다 작을 경우, start 조정
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(end - maxPageButtons + 1, 0);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 항목 범위 계산
  const getItemRange = () => {
    const start = totalElements === 0 ? 0 : currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalElements);
    return { start, end };
  };

  // 데이터가 없을 때만 페이지네이션 숨김 (페이지가 1개여도 표시)
  if (totalElements === 0) return null;

  const { start, end } = getItemRange();
  const pageRange = getPageRange();

  return (
    <div className={`w-full flex flex-col items-center ${noText ? "justify-center" : "justify-between"} space-y-2 py-4 sm:flex-row sm:space-y-0`}>
      {!noText && (
        <div className="text-sm text-gray-500">
          총 {totalElements} 중 {start}-{end}개
        </div>
      )}

      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
          disabled={currentPage <= 0}
          className="h-8 w-8 p-0"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageRange.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0"
            aria-label={`${page + 1} 페이지`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
          className="h-8 w-8 p-0"
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
