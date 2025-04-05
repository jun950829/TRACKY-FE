/**
 * Polling interval for GPS updates (in milliseconds)
 */
export const POLLING_INTERVAL = 1000; // 1 second

/**
 * Default packet intervals for GPS data transmission (in seconds)
 */
export const GPS_PACKET_INTERVALS = [
  { value: 10, label: "10초" },
  { value: 60, label: "1분" },
  { value: 120, label: "2분" },
  { value: 180, label: "3분" },
];

/**
 * Default packet interval (in seconds)
 */
export const DEFAULT_PACKET_INTERVAL = 10;

/**
 * Mock location data path description
 */
export const MOCK_LOCATION_TEXT = "미왕빌딩에서 일산 행신동까지 경로 시뮬레이션";

/**
 * Real location data description
 */
export const REAL_LOCATION_TEXT = "실시간 차량 위치 정보 수집 및 전송 시스템";

/**
 * Mock GPS data settings
 */
export const MOCK_GPS_SETTINGS = {
  speedFactor: 2, // 모의 데이터 속도 배율
  interpolationPoints: 15, // 모의 데이터 보간 포인트 개수
};

/**
 * Geolocation API options
 */
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000, // 타임아웃 시간 (ms)
  maximumAge: 0, // 캐시된 위치를 사용하지 않음
};

/**
 * Default MDN (Mobile Directory Number) for engine requests
 */
export const DEFAULT_MDN = "9999999999";

/**
 * Default TID (Terminal ID) for engine requests
 */
export const DEFAULT_TID = "A001";

/**
 * Recent positions count for average speed calculation
 */
export const RECENT_POSITIONS_COUNT = 10;

/**
 * History positions limit (to prevent memory issues)
 */
export const MAX_HISTORY_POSITIONS = 100;

/**
 * Emulator version
 */
export const EMULATOR_VERSION = "v1.2.0";
