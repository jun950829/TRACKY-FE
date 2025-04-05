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
  { value: "운행중", label: "운행중" },
  { value: "정비중", label: "정비중" },
  { value: "대기중", label: "대기중" },
  { value: "폐차", label: "폐차" }
];

/**
 * 차량 사용 목적 옵션
 */
export const CarPurpose: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "법인(업무)", label: "법인(업무)" },
  { value: "법인(영업)", label: "법인(영업)" },
  { value: "렌트카", label: "렌트카" },
  { value: "기타", label: "기타" }
];

/**
 * 차량 상태별 색상 스타일 매핑
 */
export const CarStatusColorMap: Record<string, string> = {
  '운행중': 'bg-green-100 text-green-800',
  '정비중': 'bg-yellow-100 text-yellow-800',
  '대기중': 'bg-blue-100 text-blue-800',
  'default': 'bg-gray-100 text-gray-800'
};

// ===========================
// 렌트 관련 상태 정의
// ===========================

/**
 * 렌트 상태 옵션
 */
export const RentStatus: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "예약", label: "예약" },
  { value: "대여중", label: "대여중" },
  { value: "반납완료", label: "반납완료" },
  { value: "취소", label: "취소" }
];

/**
 * 렌트 상태별 색상 스타일 매핑
 */
export const RentStatusColorMap: Record<string, string> = {
  '예약': 'bg-blue-100 text-blue-700',
  '대여중': 'bg-yellow-100 text-yellow-700',
  '반납완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
  'default': 'bg-gray-100 text-gray-700'
};