import { generateRouteBetweenLocations, generateLocalRoute } from './customRoutes';

// 날짜 포맷 헬퍼 함수
const formatDate = (date: Date) => {
  return date.toISOString();
};

export interface DriveDetailRecord {
  driveId: number;
  mdn: string;
  rentUuid: string;
  driveOnTime: string;
  driveOffTime: string;
  onLat: number;
  onLon: number;
  offLat: number;
  offLon: number;
  sum: number;
  maxSpeed: number;
  avgSpeed: number;
  gpsDataList: {
    lat: number;
    lon: number;
    spd: number;
    o_time: string; 
  }[];
  renterName: string;
  renterPhone: string;
  purpose: string;
  rentStatus: string;
}

// 운행 기록 타입 정의
export interface DriveRecord {
  driveId: number;
  mdn: string;
  rentUuid: string;
  driveOnTime: string;
  driveOffTime: string;
  onLat: number;
  onLon: number;
  offLat: number;
  offLon: number;
  sum: number;
  maxSpeed?: number;
  avgSpeed?: number;
  gpsDataList?: {
    lat: number;
    lon: number;
    spd: number;
    o_time: string;
  }[];
}

// 예약 정보 타입 정의
export interface RentRecord {
  rentUuid: string;
  mdn: string;
  renterName: string;
  renterPhone?: string;
  purpose?: string;
  rentStatus?: string;
  rentStime: string;
  rentEtime: string;
  rentLoc?: string;
  returnLoc?: string;
  drivelist: DriveRecord[];
}

// 렌터카 mock 데이터 생성
const createMockTrip = (id: string, rentUuid: string, mdn: string, startDate: Date, durationHours: number, startLocation: string, endLocation: string): DriveRecord => {
  // 시작 및 종료 시간 계산
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
  
  // 경로 포인트 생성 (실제 출발지와 도착지 기반)
  let routePoints;
  
  // 같은 위치면 로컬 경로, 그렇지 않으면 두 위치 사이 경로 생성
  if (startLocation === endLocation) {
    routePoints = generateLocalRoute(startLocation, 25);
  } else {
    routePoints = generateRouteBetweenLocations(startLocation, endLocation, 30);
  }
  
  // 속도 및 거리 계산
  const maxSpeed = 90 + Math.floor(Math.random() * 30); // 90-120 km/h
  const avgSpeed = 60 + Math.floor(Math.random() * 20); // 60-80 km/h
  
  // 실제 경로 거리 계산 (근사 계산)
  let totalDistance = 0;
  for (let i = 1; i < routePoints.length; i++) {
    const p1 = routePoints[i-1];
    const p2 = routePoints[i];
    
    // 두 점 사이의 거리 (하버사인 공식)
    const R = 6371; // 지구 반경(km)
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng - p1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    totalDistance += distance;
  }
  
  // 거리가 너무 짧으면 기본값으로 설정
  const distance = Math.max(totalDistance, avgSpeed * durationHours * 0.5);
  
  // 시간에 따른 포인트 생성
  const points = routePoints.map((point, index) => {
    const pointTimestamp = new Date(
      startDate.getTime() + (index / routePoints.length) * durationHours * 60 * 60 * 1000
    );
    
    // 속도 프로필 생성 (시작과 끝은 느리게, 중간은 빠르게)
    let speedFactor;
    const normalizedPos = index / (routePoints.length - 1);
    if (normalizedPos < 0.2) {
      // 가속 구간
      speedFactor = normalizedPos * 5;
    } else if (normalizedPos > 0.8) {
      // 감속 구간
      speedFactor = (1 - normalizedPos) * 5;
    } else {
      // 정속 구간
      speedFactor = 1.0;
    }
    
    // 기본 속도에 변동성 추가
    const baseSpeed = avgSpeed * speedFactor;
    const speed = Math.min(
      Math.max(10, baseSpeed + (Math.random() - 0.5) * 20),
      maxSpeed
    );
    
    return {
      lat: point.lat,
      lng: point.lng,
      speed: Math.floor(speed),
      timestamp: formatDate(pointTimestamp)
    };
  });
  
  return {
    id,
    mdn,
    rentUuid,
    startTime: formatDate(startDate),
    endTime: formatDate(endDate),
    startLocation,
    endLocation,
    distance,
    maxSpeed,
    avgSpeed,
    points
  };
};

// 렌트 기록 mock 데이터 생성
const createMockRentRecord = (rentUuid: string, mdn: string, tripsCount: number): RentRecord => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 5); // 5일 전 시작
  
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 2); // 2일 후 종료
  
  // 가능한 위치들
  const locations = ['서울시 강남구', '서울시 영등포구', '고양시 일산동구', '고양시 일산서구', '김포시', '인천시 계양구'];
  const randomRentLoc = locations[Math.floor(Math.random() * locations.length)];
  const randomReturnLoc = locations[Math.floor(Math.random() * locations.length)];
  
  // 트립 생성
  const trips: DriveRecord[] = [];
  let totalDistance = 0;
  let lastLocation = randomRentLoc;
  
  // 렌트 기간 내 여러 트립 생성
  for (let i = 0; i < tripsCount; i++) {
    const tripStartDate = new Date(startDate);
    tripStartDate.setHours(tripStartDate.getHours() + i * 12); // 각 트립은 12시간 간격으로 시작
    
    // 출발지는 이전 트립의 도착지
    const tripStartLocation = lastLocation;
    
    // 도착지 선택 (일부 트립은 같은 지역에서 시작하고 끝날 수 있음)
    let tripEndLocation;
    if (Math.random() < 0.3) {
      // 30% 확률로 같은 위치 내 로컬 드라이브
      tripEndLocation = tripStartLocation;
    } else {
      // 70% 확률로 다른 위치로 이동
      do {
        tripEndLocation = locations[Math.floor(Math.random() * locations.length)];
      } while (tripEndLocation === tripStartLocation && locations.length > 1);
    }
    
    // 마지막 트립은 렌트 반납 위치로 설정
    if (i === tripsCount - 1) {
      tripEndLocation = randomReturnLoc;
    }
    
    const duration = 1 + Math.random() * 3; // 1-4시간 운행
    const trip = createMockTrip(
      `TRIP-${rentUuid}-${i+1}`,
      rentUuid,
      mdn,
      tripStartDate,
      duration,
      tripStartLocation,
      tripEndLocation
    );
    
    trips.push(trip);
    totalDistance += trip.distance;
    lastLocation = tripEndLocation;
  }
  
  return {
    rentUuid,
    mdn,
    renterName: ['김철수', '이영희', '박지민', '최수진'][Math.floor(Math.random() * 4)],
    renterPhone: `010-${1000 + Math.floor(Math.random() * 9000)}-${1000 + Math.floor(Math.random() * 9000)}`,
    purpose: ['업무', '출장', '여행', '개인용무'][Math.floor(Math.random() * 4)],
    rentStatus: ['SCHEDULED', 'INPROGRESS', 'COMPLETED', 'CANCELED'][Math.floor(Math.random() * 4)],
    rentStime: formatDate(startDate),
    rentEtime: formatDate(endDate),
    rentLoc: randomRentLoc,
    returnLoc: randomReturnLoc,
    trips,
    totalDistance,
    createdAt: formatDate(new Date(startDate.getTime() - 24 * 60 * 60 * 1000)) // 하루 전 생성
  };
};

// 여러 렌트 기록 생성
export const mockRentRecords: RentRecord[] = [
  createMockRentRecord('RENT-001', 'MDN-A001', 3),
  createMockRentRecord('RENT-002', 'MDN-B002', 2),
  createMockRentRecord('RENT-003', 'MDN-C003', 4),
  createMockRentRecord('RENT-004', 'MDN-D004', 1),
  createMockRentRecord('RENT-005', 'MDN-E005', 5),
];

// 모든 트립 데이터를 단일 배열로 변환 (트립 ID로 검색 용이하게)
export const mockTripRecords: DriveRecord[] = mockRentRecords.flatMap(rent => rent.trips);

// 렌트 ID로 렌트 데이터 조회
export const findRentByUuid = (rentUuid: string): RentRecord | undefined => {
  return mockRentRecords.find(rent => rent.rentUuid === rentUuid);
};

// 트립 ID로 트립 데이터 조회
export const findTripById = (tripId: string): DriveRecord | undefined => {
  return mockTripRecords.find(trip => trip.id === tripId);
};

// 검색어로 렌트 데이터 검색
export const searchRentRecords = (searchText: string): RentRecord[] => {
  if (!searchText || searchText.trim() === '') return mockRentRecords;
  
  const lowerCaseSearch = searchText.toLowerCase();
  return mockRentRecords.filter(rent => 
    rent.rentUuid.toLowerCase().includes(lowerCaseSearch) ||
    rent.mdn.toLowerCase().includes(lowerCaseSearch) ||
    rent.renterName.toLowerCase().includes(lowerCaseSearch)
  );
};

// 검색어로 트립 데이터 검색
export const searchTripRecords = (searchText: string): DriveRecord[] => {
  if (!searchText || searchText.trim() === '') return mockTripRecords;
  
  const lowerCaseSearch = searchText.toLowerCase();
  return mockTripRecords.filter(trip => 
    trip.id.toLowerCase().includes(lowerCaseSearch) ||
    trip.rentUuid.toLowerCase().includes(lowerCaseSearch) ||
    trip.mdn.toLowerCase().includes(lowerCaseSearch)
  );
}; 