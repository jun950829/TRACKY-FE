// GPS 데이터 타입 정의
export interface GpsData {
  lat: number;
  lon: number;
  spd: number;
  o_time: string;
}

// 운행 기록 타입 정의
export interface CarRecord {
  carPlate: string;
  carType: string;
  status: string;
  mdn: string;
  carName: string;
}

export interface DriveRecord {
  id: number;
  carPlate: string;
  carType: string;
  status: string;
  onTime: string;
  offTime: string;
  onLat: number;
  onLon: number;
  offLat: number;
  offLon: number;
  driveDistance: number;
  driveDuration: number;
  gpsDataList: Array<{
    lat: number;
    lon: number;
    time: string;
  }>;
  mdn: string;
  renterName: string;
  renterPhone: string;
  purpose: string;
  rentStatus: string;
  rentUuid: string;
  rentStime: string;
  rentEtime: string | null;
}

// 운행 상세 기록 타입 정의
export interface DriveDetailRecord {
  driveId: number;
  mdn: string;
  rentUuid: string;
  driveOnTime: string;
  driveOffTime: string;
  rentStime: string;
  rentEtime: string;
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

export interface BizRecord {
  bizId: string;
  bizName: string;
  businessNumber: string;
  managerName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  drivelist: CarRecord[];
} 