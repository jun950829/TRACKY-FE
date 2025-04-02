import { CycleGpsRequest, CycleInfoRequest } from "@/constants/types";

// 지구 반지름 (단위: km)
const EARTH_RADIUS_KM = 6371;

/**
 * 두 위도/경도 좌표 간 거리 (meter)
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c * 1000; // meter
}

/**
 * 방향 (bearing) 계산 (단위: degree)
 */
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

/**
 * 위치 배열을 받아 주기 정보 리스트(CycleGpsRequest[]) 생성
 */
export function buildCycleGpsList(
  positions: GeolocationPosition[],
  sec: number
): CycleGpsRequest[] {
  let totalDistance = 0;
  const gpsList: CycleGpsRequest[] = [];

  for (let i = 0; i < positions.length; i++) {
    const curr = positions[i];
    const prev = positions[i - 1];

    let distance = 0;
    let speed = 0;
    let angle = 0;

    if (prev) {
      distance = haversineDistance(
        prev.coords.latitude,
        prev.coords.longitude,
        curr.coords.latitude,
        curr.coords.longitude
      );

      const timeDiffSec = (curr.timestamp - prev.timestamp) / 1000;
      speed = timeDiffSec > 0 ? distance / timeDiffSec : 0;

      angle = calculateBearing(
        prev.coords.latitude,
        prev.coords.longitude,
        curr.coords.latitude,
        curr.coords.longitude
      );
    }

    totalDistance += distance;

    gpsList.push({
      sec,
      gcd: "A", // 예: 정상 상태
      lat: Math.round(curr.coords.latitude * 1_000_000),  // 위도: 6자리 정밀도 후 정수
      lon: Math.round(curr.coords.longitude * 1_000_000), // 경도: 동일
      ang: Math.round(angle),                             // 방향: 정수
      spd: Math.round(speed),                             // 속도: 정수
      sum: parseFloat(totalDistance.toFixed(1)),          // 누적 거리: 소수점 1자리
    });
  }

  return gpsList;
}

/**
 * 전체 CycleInfoRequest 생성
 */
export function toCycleInfoRequest(
  gpsList: CycleGpsRequest[],
  options: {
    mdn: string;
    tid: string;
    mid: string;
    pv: string;
    did: string;
  }
): CycleInfoRequest {
  return {
    ...options,
    cCnt: gpsList.length,
    oTime: new Date().toISOString(),
    cList: gpsList,
  };
}