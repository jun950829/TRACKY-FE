/**
 * Mock GPS data utility to simulate movement from Seoul Miwang Building to Ilsan Haengsin-dong
 */

// Seoul Miwang Building to Ilsan Haengsin-dong route waypoints (detailed route)
const SEOUL_TO_ILSAN_ROUTE = [
  { lat: 37.524067, lng: 126.920126, name: "미왕빌딩" }, // Miwang Building (Starting point)
  { lat: 37.525847, lng: 126.917835, name: "여의도역" }, // Yeouido Station
  { lat: 37.528442, lng: 126.914584, name: "여의도공원" }, // Yeouido Park
  { lat: 37.530991, lng: 126.910679, name: "여의도 MBC" }, // MBC
  { lat: 37.534456, lng: 126.906944, name: "샛강역" }, // Saetgang Station
  { lat: 37.539783, lng: 126.902331, name: "국회의사당역" }, // National Assembly Station
  { lat: 37.544647, lng: 126.900121, name: "여의2교" }, // Yeouido Bridge 2
  { lat: 37.550152, lng: 126.904981, name: "한강대교" }, // Hangang Bridge
  { lat: 37.555523, lng: 126.910431, name: "마포역" }, // Mapo Station
  { lat: 37.559811, lng: 126.915710, name: "공덕역" }, // Gongdeok Station
  { lat: 37.565212, lng: 126.919959, name: "서울역 방향" }, // Towards Seoul Station
  { lat: 37.570984, lng: 126.924529, name: "충정로역" }, // Chungjeongno Station
  { lat: 37.576839, lng: 126.930344, name: "서대문역" }, // Seodaemun Station
  { lat: 37.583294, lng: 126.935923, name: "독립문역" }, // Dongnimmun Station
  { lat: 37.588978, lng: 126.940643, name: "경기대입구역" }, // Gyeonggi University Station
  { lat: 37.594521, lng: 126.945321, name: "홍제역" }, // Hongje Station
  { lat: 37.600133, lng: 126.949833, name: "홍은동" }, // Hongeun-dong
  { lat: 37.606421, lng: 126.954823, name: "연희동" }, // Yeonhui-dong
  { lat: 37.612764, lng: 126.959393, name: "연대앞" }, // In front of Yonsei University
  { lat: 37.618932, lng: 126.963941, name: "신촌로터리" }, // Sinchon Rotary
  { lat: 37.624512, lng: 126.968672, name: "서울월드컵경기장" }, // Seoul World Cup Stadium
  { lat: 37.630173, lng: 126.973232, name: "월드컵공원" }, // World Cup Park
  { lat: 37.636452, lng: 126.977781, name: "난지한강공원" }, // Nanji Hangang Park
  { lat: 37.642789, lng: 126.982102, name: "상암DMC" }, // Sangam DMC
  { lat: 37.648987, lng: 126.986652, name: "수색역" }, // Susaek Station
  { lat: 37.654823, lng: 126.991242, name: "디지털미디어시티역" }, // Digital Media City Station
  { lat: 37.660789, lng: 126.995563, name: "증산역" }, // Jeungsan Station
  { lat: 37.666412, lng: 127.000183, name: "구파발역 방향" }, // Towards Gupabal Station
  { lat: 37.672236, lng: 127.004494, name: "대조동" }, // Daejo-dong
  { lat: 37.678123, lng: 127.008814, name: "불광역" }, // Bulgwang Station
  { lat: 37.684452, lng: 127.012664, name: "연신내역" }, // Yeonsinnae Station
  { lat: 37.690423, lng: 127.016983, name: "구산역" }, // Gusan Station
  { lat: 37.696231, lng: 127.021134, name: "응암동" }, // Eungam-dong
  { lat: 37.702146, lng: 127.025133, name: "세곡입구" }, // Segok Entrance
  { lat: 37.708216, lng: 127.029224, name: "상암IC" }, // Sangam Interchange
  { lat: 37.714356, lng: 127.033314, name: "올림픽대로" }, // Olympic Expressway
  { lat: 37.720543, lng: 127.037324, name: "중산IC" }, // Jungsan Interchange
  { lat: 37.726723, lng: 127.041343, name: "전호리" }, // Jeonhori
  { lat: 37.732861, lng: 127.045243, name: "노고산동" }, // Nogosan-dong
  { lat: 37.739055, lng: 127.049233, name: "신곡동" }, // Singok-dong
  { lat: 37.744121, lng: 127.052743, name: "화전역 근처" }, // Near Hwajeon Station
  { lat: 37.751234, lng: 127.056323, name: "능곡역" }, // Neunggok Station
  { lat: 37.758121, lng: 127.060122, name: "행신사거리" }, // Haengsin Intersection
  { lat: 37.764231, lng: 127.063983, name: "행신역" }, // Haengsin Station
  { lat: 37.771257, lng: 127.067844, name: "행신동" }, // Haengsin-dong (Destination)
];

// Get intermediate points between two waypoints with more detailed interpolation
const getInterpolatedPoints = (
  point1: { lat: number; lng: number }, 
  point2: { lat: number; lng: number }, 
  count: number
): { lat: number; lng: number }[] => {
  const points = [];
  for (let i = 0; i <= count; i++) {
    const ratio = i / count;
    
    // Apply Bezier curve interpolation for more natural movement
    const lat = point1.lat + (point2.lat - point1.lat) * ratio;
    const lng = point1.lng + (point2.lng - point1.lng) * ratio;
    
    // Add small random variation to make it look more realistic
    // Keep precision to 6 decimal places for accuracy
    const randomLat = i > 0 && i < count 
      ? lat + (Math.random() - 0.5) * 0.0001 
      : lat;
    const randomLng = i > 0 && i < count 
      ? lng + (Math.random() - 0.5) * 0.0001 
      : lng;
    
    points.push({
      lat: parseFloat(randomLat.toFixed(6)),
      lng: parseFloat(randomLng.toFixed(6))
    });
  }
  return points;
};

// Generate detailed route with interpolated points between waypoints
export const generateDetailedRoute = (interpolationPoints = 10): { lat: number; lng: number }[] => {
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
      accuracy: 5 + Math.random() * 5, // 5-10m accuracy
      altitude: 20 + Math.random() * 30, // Random altitude between 20-50m
      altitudeAccuracy: 3 + Math.random() * 2,
      heading: Math.random() * 360, // Random heading
      speed: 8 + Math.random() * 12, // 8-20 m/s (28.8-72 km/h)
    },
    timestamp,
  } as GeolocationPosition;
};

// Mock route data with timestamps
export const createMockRouteData = (
  speedFactor = 1, // Higher = faster playback
  interpolationPoints = 10
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