// GPS 데이터 타입 정의
export interface GpsData {
  lat: number;
  lon: number;
  spd: number;
  o_time: string;
}

// 운행 기록 타입 정의
export interface DriveRecord {
  id: string;
  mdn: string;
  rentUuid: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  maxSpeed: number;
  avgSpeed: number;
  points: {
    lat: number;
    lng: number;
    speed: number;
    timestamp: string;
  }[];
}

// 대여 기록 타입 정의
export interface RentRecord {
  rentUuid: string;
  mdn: string;
  renterName: string;
  renterPhone: string;
  purpose: string;
  rentStatus: string;
  rentStime: string;
  rentEtime: string;
  rentLoc: string;
  returnLoc: string;
  trips: DriveRecord[];
  totalDistance: number;
  createdAt: string;
}

// 운행 상세 기록 타입 정의
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
  gpsDataList: GpsData[];
  renterName: string;
  renterPhone: string;
  purpose: string;
  rentStatus: string;
} 