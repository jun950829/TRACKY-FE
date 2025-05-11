import { GpsData } from "@/constants/types/historyTypes";

// 두 점 사이의 보간된 위치 계산
  export const interpolatePosition = (start: [number, number], end: [number, number], progress: number): [number, number] => {
    return [
      start[0] + (end[0] - start[0]) * progress,
      start[1] + (end[1] - start[1]) * progress
    ];
  };



  // 마지막 60개의 데이터를 반환하는 함수 추가
export const getLastSixtyPoints = (gpsDataList: GpsData[]) => {
    return gpsDataList.slice(-60);
  };