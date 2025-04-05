import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

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
