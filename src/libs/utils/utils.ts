import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // 유효하지 않은 날짜일 경우

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0"); // 0-based
  const dd = String(date.getDate()).padStart(2, "0");

  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
}

/**
 * 대여 기간을 'yy/MM/dd hh:mm ~ MM/dd hh:mm' 형식으로 포맷팅하는 함수
 * @param startTimeString 대여 시작 시간 (ISO 문자열)
 * @param endTimeString 대여 종료 시간 (ISO 문자열)
 * @returns 포맷팅된 대여 기간 문자열
 */
export function formatRentPeriod(startTimeString: string, endTimeString: string): string {
  const startDate = new Date(startTimeString);
  const endDate = new Date(endTimeString);

  // 시작 날짜 포맷팅 (yy/MM/dd hh:mm)
  const startYear = startDate.getFullYear().toString().slice(2); // 년도 뒤 2자리
  const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  const startDay = String(startDate.getDate()).padStart(2, "0");
  const startHours = String(startDate.getHours()).padStart(2, "0");
  const startMinutes = String(startDate.getMinutes()).padStart(2, "0");

  // 종료 날짜 포맷팅 (MM/dd hh:mm)
  const endYear = endDate.getFullYear().toString().slice(2); // 년도 뒤 2자리
  const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
  const endDay = String(endDate.getDate()).padStart(2, "0");
  const endHours = String(endDate.getHours()).padStart(2, "0");
  const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

  return `${startYear}/${startMonth}/${startDay} ${startHours}:${startMinutes} ~ ${endYear}/${endMonth}/${endDay} ${endHours}:${endMinutes}`;
}

/**
 * 좌표를 1,000,000을 곱한 정수값으로 변환
 * @param coordinate 변환할 좌표 (위도 또는 경도)
 */
export const formatCoordinate = (coordinate: number): number => {
  // 소수점 6자리까지 자르고 1,000,000을 곱함
  return Math.round(parseFloat(coordinate.toFixed(6)) * 1000000);
};