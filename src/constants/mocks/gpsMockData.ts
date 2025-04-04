/**
 * Mock GPS data utility to simulate movement from Seoul to Ilsan
 */

// Seoul to Ilsan route waypoints (approximate route along major highways)
const SEOUL_TO_ILSAN_ROUTE = [
  { lat: 37.5665, lng: 126.9780, name: "서울시청" }, // Seoul City Hall
  { lat: 37.5838, lng: 126.9688, name: "서대문" },
  { lat: 37.5926, lng: 126.9664, name: "신촌" },
  { lat: 37.6034, lng: 126.9541, name: "연희동" },
  { lat: 37.6079, lng: 126.9334, name: "수색" },
  { lat: 37.6142, lng: 126.9154, name: "디지털미디어시티" },
  { lat: 37.6199, lng: 126.8976, name: "상암" },
  { lat: 37.6307, lng: 126.8781, name: "가양" },
  { lat: 37.6407, lng: 126.8628, name: "방화" },
  { lat: 37.6569, lng: 126.8339, name: "개화" },
  { lat: 37.6686, lng: 126.8118, name: "김포공항" },
  { lat: 37.6861, lng: 126.7989, name: "운서" },
  { lat: 37.7014, lng: 126.7667, name: "신바람" },
  { lat: 37.7142, lng: 126.7653, name: "신공항영업소" },
  { lat: 37.7288, lng: 126.7639, name: "검단" },
  { lat: 37.7418, lng: 126.7614, name: "검단사거리" },
  { lat: 37.7587, lng: 126.7689, name: "풍무" },
  { lat: 37.7699, lng: 126.7675, name: "김포IC" },
  { lat: 37.7821, lng: 126.7683, name: "김포" },
  { lat: 37.7894, lng: 126.7772, name: "금빛로" },
  { lat: 37.8002, lng: 126.7884, name: "대화" },
  { lat: 37.8041, lng: 126.7674, name: "장항" },
  { lat: 37.8009, lng: 126.7550, name: "주엽" },
  { lat: 37.7964, lng: 126.7343, name: "대화" },
  { lat: 37.7846, lng: 126.7216, name: "마두" },
  { lat: 37.7712, lng: 126.7093, name: "백석" },
  { lat: 37.7580, lng: 126.7024, name: "일산서구청" },
  { lat: 37.7426, lng: 126.7078, name: "일산동구청" },
  { lat: 37.7324, lng: 126.7144, name: "정발산역" },
  { lat: 37.7219, lng: 126.7250, name: "웨스턴돔" },
  { lat: 37.7156, lng: 126.7250, name: "킨텍스" },
  { lat: 37.7080, lng: 126.7354, name: "일산 호수공원" }, // Destination: Ilsan Lake Park
];

// Get intermediate points between two waypoints
const getInterpolatedPoints = (
  point1: { lat: number; lng: number }, 
  point2: { lat: number; lng: number }, 
  count: number
): { lat: number; lng: number }[] => {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const ratio = i / count;
    points.push({
      lat: point1.lat + (point2.lat - point1.lat) * ratio,
      lng: point1.lng + (point2.lng - point1.lng) * ratio,
      // Add small random variation to make it look more realistic
      ...(i > 0 && i < count && {
        lat: point1.lat + (point2.lat - point1.lat) * ratio + (Math.random() - 0.5) * 0.0005,
        lng: point1.lng + (point2.lng - point1.lng) * ratio + (Math.random() - 0.5) * 0.0005,
      })
    });
  }
  return points;
};

// Generate detailed route with interpolated points between waypoints
export const generateDetailedRoute = (interpolationPoints = 5): { lat: number; lng: number }[] => {
  let detailedRoute: { lat: number; lng: number }[] = [];
  
  for (let i = 0; i < SEOUL_TO_ILSAN_ROUTE.length - 1; i++) {
    const points = getInterpolatedPoints(
      SEOUL_TO_ILSAN_ROUTE[i],
      SEOUL_TO_ILSAN_ROUTE[i + 1],
      interpolationPoints
    );
    
    // Add all points except the last one (to avoid duplicates)
    if (i < SEOUL_TO_ILSAN_ROUTE.length - 2) {
      detailedRoute = [...detailedRoute, ...points.slice(0, -1)];
    } else {
      // For the last segment, include the final point
      detailedRoute = [...detailedRoute, ...points];
    }
  }
  
  return detailedRoute;
};

// Create a GeolocationPosition from a coordinate
export const createMockPosition = (
  coordinate: { lat: number; lng: number },
  timestamp: number
): GeolocationPosition => {
  return {
    coords: {
      latitude: coordinate.lat,
      longitude: coordinate.lng,
      accuracy: 10 + Math.random() * 5, // 10-15m accuracy
      altitude: 20 + Math.random() * 30, // Random altitude between 20-50m
      altitudeAccuracy: 5 + Math.random() * 5,
      heading: Math.random() * 360, // Random heading
      speed: 10 + Math.random() * 20, // 10-30 m/s (36-108 km/h)
    },
    timestamp,
  } as GeolocationPosition;
};

// Mock route data with timestamps
export const createMockRouteData = (
  speedFactor = 1, // Higher = faster playback
  interpolationPoints = 5
): GeolocationPosition[] => {
  const route = generateDetailedRoute(interpolationPoints);
  const now = Date.now();
  
  // Create mock GPS data with timestamps
  // Timestamps are spaced according to speedFactor (higher = more time between points)
  return route.map((point, index) => {
    // Add 1 second per point, adjusted by speed factor
    const timestamp = now + index * (1000 / speedFactor);
    return createMockPosition(point, timestamp);
  });
};

// Get current position based on elapsed time
export const getCurrentPositionFromMockData = (
  mockData: GeolocationPosition[],
  startTime: number
): GeolocationPosition | null => {
  const elapsedTime = Date.now() - startTime;
  
  // Find the position that corresponds to the elapsed time
  for (let i = 0; i < mockData.length; i++) {
    const pointTime = mockData[i].timestamp - mockData[0].timestamp;
    if (pointTime >= elapsedTime) {
      return mockData[i];
    }
  }
  
  // If we've gone through all points, return the last one
  return mockData.length > 0 ? mockData[mockData.length - 1] : null;
};

// Get a slice of the route data representing position history
export const getMockPositionHistory = (
  mockData: GeolocationPosition[],
  startTime: number
): GeolocationPosition[] => {
  const elapsedTime = Date.now() - startTime;
  
  return mockData.filter(pos => {
    const pointTime = pos.timestamp - mockData[0].timestamp;
    return pointTime <= elapsedTime;
  });
};

// Default export for easy importing
export default {
  SEOUL_TO_ILSAN_ROUTE,
  createMockRouteData,
  getCurrentPositionFromMockData,
  getMockPositionHistory
};