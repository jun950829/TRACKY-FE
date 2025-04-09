// 옵션 타입 정의
export type StatusOption = {
  value: string;
  label: string;
};

// ===========================
// 차량 관련 상태 정의
// ===========================

/**
 * 차량 상태 옵션
 */
export const CarStatus: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "running", label: "운행중" },
  { value: "fixing", label: "정비중" },
  { value: "waiting", label: "대기중" },
  { value: "closed", label: "폐차" },
];

/**
 * 차량 사용 목적 옵션
 */
export const CarPurpose: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "법인(업무)", label: "법인(업무)" },
  { value: "법인(영업)", label: "법인(영업)" },
  { value: "렌트카", label: "렌트카" },
  { value: "기타", label: "기타" },
];

/**
 * 차량 상태별 색상 스타일 매핑
 */
export const CarStatusColorMap: Record<string, string> = {
  running: "bg-green-100 text-green-800",
  fixing: "bg-yellow-100 text-yellow-800",
  waiting: "bg-blue-100 text-blue-800",
  closed: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

// ===========================
// 렌트 관련 상태 정의
// ===========================

/**
 * 렌트 상태 옵션
 */
export const RentStatus: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "reserved", label: "예약완료" },
  { value: "renting", label: "대여중" },
  { value: "returned", label: "반납완료" },
  { value: "canceled", label: "취소" },
];

/**
 * 렌트 상태별 색상 스타일 매핑
 */
export const RentStatusColorMap: Record<string, string> = {
  reserved: "bg-blue-100 text-blue-700",
  renting: "bg-yellow-100 text-yellow-700",
  returned: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};
