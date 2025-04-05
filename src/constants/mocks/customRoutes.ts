/**
 * 여러 도시 간 경로를 위한 Mock GPS 데이터
 */

// 주요 지역 좌표 정의
export const LOCATIONS: Record<string, { lat: number; lng: number; name: string }> = {
  "서울시 강남구": { lat: 37.5172, lng: 127.0473, name: "강남구" },
  "서울시 영등포구": { lat: 37.5255, lng: 126.8974, name: "영등포구" },
  "고양시 일산동구": { lat: 37.6583, lng: 126.7737, name: "일산동구" },
  "고양시 일산서구": { lat: 37.6894, lng: 126.7559, name: "일산서구" },
  "김포시": { lat: 37.6155, lng: 126.7133, name: "김포시" },
  "인천시 계양구": { lat: 37.5374, lng: 126.7379, name: "계양구" },
  "성남시 분당구": { lat: 37.3839, lng: 127.1196, name: "분당구" },
  "부천시": { lat: 37.5035, lng: 126.7664, name: "부천시" },
  "광명시": { lat: 37.4794, lng: 126.8646, name: "광명시" },
  "수원시": { lat: 37.2636, lng: 127.0286, name: "수원시" }
};

// 두 지점 사이의 경로 생성을 위한 보간 함수
const interpolatePoints = (
  startPoint: { lat: number; lng: number; name?: string },
  endPoint: { lat: number; lng: number; name?: string },
  count: number
): { lat: number; lng: number }[] => {
  const points = [];
  
  // 직선 경로에 약간의 곡률 추가를 위한 중간점 계산
  const midLat = (startPoint.lat + endPoint.lat) / 2;
  const midLng = (startPoint.lng + endPoint.lng) / 2;
  
  // 시작점과 도착점 사이의 거리에 비례하는 변위 추가
  const distance = Math.sqrt(
    Math.pow(endPoint.lat - startPoint.lat, 2) + 
    Math.pow(endPoint.lng - startPoint.lng, 2)
  );
  
  // 변위 계산 (거리의 5-10% 정도)
  const offsetFactor = 0.05 + Math.random() * 0.05;
  const offset = distance * offsetFactor;
  
  // 무작위 방향으로 중간점 이동
  const angle = Math.random() * Math.PI * 2;
  const curvedMidLat = midLat + Math.sin(angle) * offset;
  const curvedMidLng = midLng + Math.cos(angle) * offset;
  
  // 중간점을 포함한 경로 포인트 보간
  for (let i = 0; i <= count; i++) {
    const ratio = i / count;
    
    // 베지어 곡선 보간 (시작점, 곡선 중간점, 도착점)
    let lat, lng;
    
    if (ratio < 0.5) {
      // 시작점에서 곡선 중간점까지
      const t = ratio * 2;
      lat = startPoint.lat * (1 - t) + curvedMidLat * t;
      lng = startPoint.lng * (1 - t) + curvedMidLng * t;
    } else {
      // 곡선 중간점에서 도착점까지
      const t = (ratio - 0.5) * 2;
      lat = curvedMidLat * (1 - t) + endPoint.lat * t;
      lng = curvedMidLng * (1 - t) + endPoint.lng * t;
    }
    
    // 직선 경로에 약간의 무작위 변동 추가 (시작점과 끝점 제외)
    if (i > 0 && i < count) {
      lat += (Math.random() - 0.5) * 0.005;
      lng += (Math.random() - 0.5) * 0.005;
    }
    
    points.push({ lat, lng });
  }
  
  return points;
};

// 두 위치 이름 사이의 경로 생성
export const generateRouteBetweenLocations = (
  startLocation: string,
  endLocation: string,
  pointCount: number = 30
): { lat: number; lng: number }[] => {
  // 존재하지 않는 위치인 경우 기본값 사용
  const startPoint = LOCATIONS[startLocation] || LOCATIONS["서울시 강남구"];
  const endPoint = LOCATIONS[endLocation] || LOCATIONS["고양시 일산동구"];
  
  if (startLocation === endLocation) {
    // 출발지와 도착지가 같은 경우 원형 경로 생성
    const center = { ...startPoint };
    const circlePoints = [];
    const radius = 0.01 + Math.random() * 0.01; // 약 1~2km 반경
    
    for (let i = 0; i <= pointCount; i++) {
      const angle = (i / pointCount) * Math.PI * 2;
      const lat = center.lat + Math.sin(angle) * radius;
      const lng = center.lng + Math.cos(angle) * radius;
      
      // 약간의 무작위성 추가
      const jitter = 0.001 * Math.random();
      circlePoints.push({ 
        lat: lat + (Math.random() - 0.5) * jitter, 
        lng: lng + (Math.random() - 0.5) * jitter 
      });
    }
    
    return circlePoints;
  }
  
  // 일반적인 경로 생성
  return interpolatePoints(startPoint, endPoint, pointCount);
};

// 위치에 근접한 짧은 경로 생성 (로컬 드라이브)
export const generateLocalRoute = (
  location: string,
  pointCount: number = 20
): { lat: number; lng: number }[] => {
  const center = LOCATIONS[location] || LOCATIONS["서울시 강남구"];
  
  // 무작위 방향으로 시작
  const startAngle = Math.random() * Math.PI * 2;
  const radius = 0.005 + Math.random() * 0.01; // 약 500m~1.5km
  
  const startPoint = {
    lat: center.lat + Math.sin(startAngle) * radius,
    lng: center.lng + Math.cos(startAngle) * radius
  };
  
  // 무작위 종료 지점 (시작점에서 약간 떨어진 곳)
  const endAngle = startAngle + Math.PI * (0.5 + Math.random());
  const endPoint = {
    lat: center.lat + Math.sin(endAngle) * radius,
    lng: center.lng + Math.cos(endAngle) * radius
  };
  
  return interpolatePoints(startPoint, endPoint, pointCount);
};

// 인접한 두 지역 사이의 여러 경로 생성
export const generateMultipleRoutes = (
  startLocation: string,
  endLocation: string,
  count: number = 5
): { lat: number; lng: number }[][] => {
  const routes = [];
  
  for (let i = 0; i < count; i++) {
    routes.push(generateRouteBetweenLocations(startLocation, endLocation, 30));
  }
  
  return routes;
}; 