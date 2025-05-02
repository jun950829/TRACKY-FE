// GPS 데이터 타입 정의
export interface GpsData {
  lat: number;
  lon: number;
  spd: number;
  ang: number;
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
  mdn: string;
  carPlate: string;
  rentUuid: string;
  renterName: string;
  purpose: string;
  driveDistance: number;
  driveOnTime: string;
  driveOffTime: string;
  driveEndLat: number;
  driveEndLon: number;
}

// 운행 상세 기록 타입 정의
export interface DriveDetailRecord {
  driveId: number;
  mdn: string;
  carPlate: string;
  onLat: number;
  onLon: number;
  offLat: number;
  offLon: number;
  driveDistance: number;
  rentUuid: string;
  renterName: string;
  renterPhone: string;
  rentStatus: string;
  purpose: string;
  status: string;
  driveOnTime: string;
  driveOffTime: string;
  rentStime: string;
  rentEtime: string;
  gpsDataList: GpsData[];
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