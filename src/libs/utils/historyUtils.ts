import L from 'leaflet';

// GPS 데이터 타입 정의
export interface GpsData {
  lat: number;
  lon: number;
  spd: number;
  o_time: string;
}

// 경로의 전체 범위 계산
export const calculateBounds = (gpsDataList: GpsData[]) => {
  return gpsDataList.reduce((acc, point) => {
    const lat = point.lat / 1_000_000;
    const lon = point.lon / 1_000_000;
    return {
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat),
      minLon: Math.min(acc.minLon, lon),
      maxLon: Math.max(acc.maxLon, lon),
    };
  }, {
    minLat: Number.MAX_VALUE,
    maxLat: Number.MIN_VALUE,
    minLon: Number.MAX_VALUE,
    maxLon: Number.MIN_VALUE,
  });
};

// 경로의 전체 범위를 포함하는 bounds 생성
export const createMapBounds = (bounds: ReturnType<typeof calculateBounds>) => {
  return L.latLngBounds(
    [bounds.minLat, bounds.minLon],
    [bounds.maxLat, bounds.maxLon]
  );
};

// 속도에 따른 경로 색상 계산
export const getPathColor = (speed: number) => {
  if (speed < 30) return '#3388ff'; // 천천히 - 파란색
  if (speed < 60) return '#33cc33'; // 보통 - 녹색
  if (speed < 90) return '#ffcc00'; // 빠름 - 노란색
  return '#ff3300';                 // 매우 빠름 - 빨간색
};

// 경로 세그먼트 생성
export const createPathSegments = (gpsDataList: GpsData[]) => {
  const segments = [];
  for (let i = 0; i < gpsDataList.length - 1; i++) {
    const avgSpeed = (gpsDataList[i].spd + gpsDataList[i+1].spd) / 2;
    segments.push({
      positions: [
        [gpsDataList[i].lat / 1_000_000, gpsDataList[i].lon / 1_000_000] as [number, number],
        [gpsDataList[i + 1].lat / 1_000_000, gpsDataList[i + 1].lon / 1_000_000] as [number, number]
      ],
      color: getPathColor(avgSpeed)
    });
  }
  return segments;
};


export const calculateDriveDuration = (driveOnTimeStr: string, driveOffTimeStr: string) => {
  const driveOnTime = new Date(driveOnTimeStr).getTime();
  const driveOffTime = new Date(driveOffTimeStr).getTime();

  const durationMs = driveOffTime - driveOnTime;

  if (isNaN(durationMs) || durationMs < 0) {
    return '잘못된 시간 값입니다';
  }

  const totalMinutes = Math.floor(durationMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}시간 ${minutes}분`;
}