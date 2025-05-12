export type Approves = {
  bizName: string;
  bizRegNum: string;
  bizAdmin: string;
  bizPhoneNum: string;
  memberId: string;
  email: string;
  role: string;
  status: "active" | "deactive" | "wait" | "deleted";
  createAt: string;
};

export type SseEventPayloadType = {
  event: string;
  method: string;
  message: string;
  createdAt: string;
};

export type Statistics = {
  totalDriveDistance: number;
  totalRentCount: number;
  totalCarCount: number;
  totalRentDurationInMinutes: number;
  totalDriveDurationInMinutes: number;
};

export type StatisticsItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
};

export type CarTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  createdAt?: string;
};

export type CarCreateTypes = {
  mdn: string;
  bizId?: number;
  carType: string;
  carPlate: string;
  carYear: string | number;
  purpose: string;
  status?: string;
  sum: number;
};

export type CarUpdateTypes = {
  mdn: string;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
};

export type CarDetailTypes = {
  mdn: string;
  bizInfo: BizInfo;
  bizName: string;
  carType: string;
  carPlate: string;
  carName: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
  createdAt: string;
};
export type CarTypeEnum = "MINI" | "SEDAN" | "VAN" | "SUV" | "TRUCK" | "BUS" | "SPORTS" | "ETC";


export type CarStatusEnum = 'RUNNING' | 'WAITING' | 'FIXING' | 'CLOSED';

export const CarStatusLabels: Record<CarStatusEnum, string> = {
  RUNNING: '운행중',
  WAITING:  '대기중',
  FIXING: '정비중',
  CLOSED: '폐차',
};

export type CarStatusTypes = Record<CarStatusEnum, number>;

export type Devices = {
  id: number;
  tid: string;
  mid: string;
  did: string;
  pv: string;
};

export type BizInfo = {
  id: number;
  bizName: string;
  bizRegNum: string;
  bizAdmin: string;
  bizPhoneNum: string;
};

export type CycleGpsRequest = {
  gcd: string; // GPS 상태
  lat: number; // 위도
  lon: number; // 경도
  ang: number; // 방향
  spd: number; // 속도
  sum: number; // 누적 주행거리
  oTime: string; // 발생시간
};

export type CycleInfoRequest = {
  mdn: string; // 차량 번호
  tid: string; // 터미널 아이디
  mid: string; // 제조사 아이디
  pv: string; // 패킷 버전
  did: string; // 디바이스 아이디
  cCnt: number; // 주기 정보 개수
  oTime: string; // 발생시간
  cList: CycleGpsRequest[]; // 주기정보 리스트
};

export type ReturnStatus = {
  rentUuid: string;
  renterName: string;
  mdn: string;
  carPlate: string;
  carType: string;
  rentStatus: string;
  rentStime: string;
  rentEtime: string;
};

export type RentCreateTypes = {
  mdn: string; // 차량 번호판
  renterName: string; // 사용자 이름
  renterPhone: string; // 사용자 전화번호
  purpose: string; // 사용 목적
  rentStime: string; // 대여 시작 시간
  rentEtime: string; // 대여 종료 시간
  rentLat: number; // 대여 위도
  rentLon: number; // 대여 경도
  returnLat: number; // 반납 위도
  returnLon: number; // 반납 경도
  rentLoc: string; // 대여 위치
  returnLoc: string; // 반납 위치
};

export type RentUpdateTypes = {
  mdn: string; // 차량 번호판
  renterName: string; // 사용자 이름
  renterPhone: string; // 사용자 전화번호
  rentStime: string; // 대여 시작 시간
  rentEtime: string; // 대여 종료 시간
  rentLoc: string; // 대여 위치
  returnLoc: string; // 반납 위치
  purpose: string; // 사용 목적
};

export type RentDetailTypes = {
    rent_uuid: string;        // 8자리 대여 UUID
    mdn: string;             // 차량 식별키
    bizName: string;         // 업체 이름
    renterName: string;      // 사용자 이름
    renterPhone: string;     // 사용자 전화번호
    purpose: string;         // 차량 사용 목적
    rentStatus: string;      // 대여 상태    
    rentStime: string;       // 대여 시작 시간
    rentLoc: string;         // 대여 위치
    rentEtime: string;       // 대여 종료 시간
    returnLoc: string;      // 반납 위치
    createdAt: string;      // 생성 시간
}

export type Member = {
  bizName: string;
  bizRegNum: string;
  bizAdmin: string;
  bizPhoneNum: string;
  memberId: string;
  email: string;
  role: string;
  status: "active" | "deactive" | "wait" | "deleted";
};

export type MonthlyStatistic = {
  avgOperationRate: number;
  nonOperatingCarCount: number;
  totalDriveCount: number;
  dailyDriveCount: number[];
};
