import { EngineRequestType } from "@/constants/mocks/mockData";

/**
 * 한국 시간을 'yyyyMMddHHmm' 형식으로 변환하는 함수
 */
export const getKoreanTimeFormatted = (): string => {
  // 현재 시간을 가져옴
  const now = new Date();
  
  const koreanTime = new Date(now.getTime());
  
  // 'yyyyMMddHHmm' 형식으로 변환
  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  const hours = String(koreanTime.getHours()).padStart(2, '0');
  const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}`;
};

/**
 * 위도 경도를 소수점 6자리까지 자르고 1,000,000을 곱한 정수값으로 변환
 * @param coordinate 변환할 좌표 (위도 또는 경도)
 */
export const formatCoordinate = (coordinate: number): number => {
  // 소수점 6자리까지 자르고 1,000,000을 곱함
  return Math.round(parseFloat(coordinate.toFixed(6)) * 1000000);
};

/**
 * 두 위치 사이의 거리를 계산 (미터 단위)
 * @param pos1 첫 번째 위치
 * @param pos2 두 번째 위치
 */
export const calculateDistance = (pos1: GeolocationPosition, pos2: GeolocationPosition): number => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = (pos1.coords.latitude * Math.PI) / 180;
  const φ2 = (pos2.coords.latitude * Math.PI) / 180;
  const Δφ = ((pos2.coords.latitude - pos1.coords.latitude) * Math.PI) / 180;
  const Δλ = ((pos2.coords.longitude - pos1.coords.longitude) * Math.PI) / 180;

  const a = 
    Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * 시동 ON 요청 객체 생성
 * @param position 현재 위치
 */
export const createEngineOnRequest = (position: GeolocationPosition): EngineRequestType => {
  return {
    mdn: "9999999999",
    tid: "A001",
    mid: "6",
    pv: "5",
    did: "1",
    onTime: getKoreanTimeFormatted(),
    offTime: null,
    gcd: "A",
    lat: formatCoordinate(position.coords.latitude),
    lon: formatCoordinate(position.coords.longitude),
    ang: position.coords.heading?.toFixed(0) || "0",
    spd: (position.coords.speed || 0).toFixed(0),
    sum: 0
  };
};

/**
 * 시동 OFF 요청 객체 생성
 * @param position 현재 위치
 * @param onTime 시동 ON 시간
 * @param totalDistance 누적 거리
 */
export const createEngineOffRequest = (
  position: GeolocationPosition, 
  onTime: string, 
  totalDistance: number
): EngineRequestType => {
  return {
    mdn: "9999999999",
    tid: "A001",
    mid: "6",
    pv: "5",
    did: "1",
    onTime: onTime,
    offTime: getKoreanTimeFormatted(),
    gcd: "A",
    lat: formatCoordinate(position.coords.latitude),
    lon: formatCoordinate(position.coords.longitude),
    ang: position.coords.heading?.toFixed(0) || "0",
    spd: (position.coords.speed || 0).toFixed(0),
    sum: Math.round(totalDistance)
  };
};

/**
 * 위치 초기화 함수
 * @param useMockData 모의 데이터 사용 여부
 * @param mockDataFn 모의 데이터 생성 함수
 * @param setError 에러 설정 함수
 * @param setPosition 위치 설정 함수
 */
export const initLocation = (
  useMockData: boolean,
  mockDataFn: () => GeolocationPosition[],
  setPosition: (position: GeolocationPosition) => void,
  setError: (error: string) => void
): void => {
  if (useMockData) {
    // 모의 데이터 사용 시 첫 번째 위치 정보 설정
    const initialPosition = mockDataFn()[0];
    if (initialPosition) {
      setPosition(initialPosition);
    }
  } else {
    // 실제 위치 정보 가져오기
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(position);
        },
        (error) => {
          setError(`위치 정보를 가져올 수 없습니다: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("이 브라우저에서는 위치 정보가 지원되지 않습니다");
    }
  }
}; 