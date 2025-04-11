import { CycleGpsRequest, CycleInfoRequest } from "@/constants/types/types";

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
  positions: GeolocationPosition[]
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
 * 현재 한국 시간을 'yyyyMMddHHmm' 형식으로 변환
 */
function getKoreanTimeFormatted(): string {
  // 현재 시간을 가져옴
  const now = new Date();
  
  // 한국 시간(UTC+9)으로 변환
  const koreanTime = new Date(now.getTime());
  
  // 'yyyyMMddHHmm' 형식으로 변환
  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  const hours = String(koreanTime.getHours()).padStart(2, '0');
  const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}`;
}

/**
 * 전체 CycleInfoRequest 생성
 * 두 가지 방식으로 호출 가능:
 * 1. gpsList와 options 객체 사용
 * 2. cycleId와 단일 position 사용
 */
export function toCycleInfoRequest(
  arg1: CycleGpsRequest[] | string,
  arg2: 
    | {
        mdn: string;
        tid: string;
        mid: string;
        pv: string;
        did: string;
      }
    | GeolocationPosition
): CycleInfoRequest {
  // 단일 위치 데이터를 받은 경우 (cycleId, position)
  if (typeof arg1 === 'string' && 'coords' in arg2) {
    const cycleId = arg1;
    const position = arg2 as GeolocationPosition;
    
    // 단일 위치를 CycleGpsRequest 배열로 변환
    const gpsList = buildCycleGpsList([position]);
    
    return {
      mdn: "01234567890",
      tid: "A001",
      mid: "6",
      pv: "5",
      did: cycleId,
      cCnt: gpsList.length,
      oTime: getKoreanTimeFormatted(),
      cList: gpsList,
    };
  } 
  // 원래 방식대로 CycleGpsRequest 배열과 옵션을 받은 경우
  else {
    const gpsList = arg1 as CycleGpsRequest[];
    const options = arg2 as {
      mdn: string;
      tid: string;
      mid: string;
      pv: string;
      did: string;
    };
    
    return {
      ...options,
      cCnt: gpsList.length,
      oTime: getKoreanTimeFormatted(),
      cList: gpsList,
    };
  }
}