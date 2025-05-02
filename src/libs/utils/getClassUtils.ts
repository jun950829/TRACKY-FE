import { CarStatus, CarStatusColorMap, CarType, RentStatus, RentStatusColorMap } from "@/constants/datas/status";
import { Member } from "@/constants/types/types";

/**
 * UI 관련 유틸리티 함수 모음
 * 스타일 클래스 및 디자인 관련 헬퍼 함수들이 포함되어 있습니다.
 */

/**
 * 상태에 따른 색상 스타일 클래스 반환
 * @param status 상태 문자열
 * @param type 유형 ('car' | 'rent')
 * @returns 해당 상태에 맞는 스타일 클래스
 */
export const getStatusColorClass = (status: string, type: 'car' | 'rent'): string => {
  const colorMap = type === 'car' ? CarStatusColorMap : RentStatusColorMap;
  return colorMap[status.toLowerCase()] || colorMap.default;
};

/**
 * 상태 배지에 공통적으로 적용되는 기본 클래스 반환
 * @returns 상태 배지의 기본 스타일 클래스
 */
export const getStatusBadgeBaseClass = (): string => {
  return "px-2 py-1 rounded-full text-xs font-medium";
};

/**
 * 상태 배지의 완전한 클래스 문자열 반환
 * @param status 상태 문자열
 * @param type 유형 ('car' | 'rent')
 * @param additionalClasses 추가적인 클래스 (선택사항)
 * @returns 완성된 배지 클래스 문자열
 */
export const getStatusBadgeClass = (
  status: string, 
  type: 'car' | 'rent', 
  additionalClasses?: string
): string => {
  return `${getStatusBadgeBaseClass()} ${getStatusColorClass(status, type)} ${additionalClasses || ''}`;
};

/**
 * 상태 value에 해당하는 label 값을 반환합니다.
 * @param value 상태 value 문자열
 * @param type 유형 ('car' | 'rent')
 * @returns 해당 value에 맞는 label 문자열
 */
export const getStatusLabel = (type: 'car' | 'rent', value: string): string => {
  const statusOptions = type === 'car' ? CarStatus : RentStatus;
  const option = statusOptions.find(opt => opt.value === value.toLowerCase());
  return option ? option.label : value.toLowerCase();
};

/**
 * 차량 타입 value에 해당하는 label 값을 반환합니다. d
 * @param value 차량 타입 value 문자열 Gb
 * @returns 해당 value에 맞는 label 문자열
 */
export const getCarTypeLabel = (value: string): string => {
  const option = CarType.find(opt => opt.value == value.toLowerCase());
  return option ? option.label : value.toLowerCase();
};

export const getStatusStyle = (status: Member["status"]) => {
  switch (status.toLowerCase()) {
    case "active":
      return "text-green-600 bg-green-50";
    case "deactive":
      return "text-red-600 bg-red-50";
    case "wait":
      return "text-yellow-600 bg-yellow-50";
    case "deleted":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const getStatusText = (status: Member["status"]) => {
  switch (status.toLowerCase()) {
    case "active":
      return "활성화";
    case "deactive":
      return "비활성화";
    case "wait":
      return "승인대기";
    case "deleted":
      return "삭제됨";
    default:
      return "알 수 없음";
  }
};