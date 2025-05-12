import { GpsData } from "@/constants/types/historyTypes";
import { divIcon } from "leaflet";

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

export const createCarIcon = (rotation: number) => {
    return divIcon({
      className: 'custom-car-icon',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #4A90E2;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.3);
          transform: rotate(${rotation}deg);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };