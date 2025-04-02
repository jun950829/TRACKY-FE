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
}

export type CarCreateTypes = {
  mdn: string;
  bizId?: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
}

export type CarUpdateTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
}

export type Devices = {
  id: number;
  tid: string;
  mid: string;
  did: string;
  pv: string;
}

export type CarDetailTypes = {
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number;
  deviceInfo: Devices;
  createdAt: string;
}

export type CycleGpsRequest = {
  sec: number;  // 주기
  gcd: string;  // GPS 상태
  lat: number;  // 위도
  lon: number;  // 경도
  ang: number;  // 방향
  spd: number;  // 속도
  sum: number;  // 누적 주행거리
}

export type CycleInfoRequest = {
  mdn: string;    // 차량 번호
  tid: string;    // 터미널 아이디
  mid: string;    // 제조사 아이디
  pv: string;     // 패킷 버전
  did: string;    // 디바이스 아이디
  cCnt: number;   // 주기 정보 개수
  oTime: string;  // 발생시간
  cList: CycleGpsRequest[]; // 주기정보 리스트
}

export type RentCreateTypes = {
  mdn: string;           // 차량 번호판
  renterName: string;    // 사용자 이름
  renterPhone: string;   // 사용자 전화번호
  rentStime: string;     // 대여 시작 시간
  rentEtime: string;     // 대여 종료 시간
  rentLoc: string;       // 대여 위치
  returnLoc: string;     // 반납 위치
  purpose: string;       // 사용 목적
}

export type RentDetailTypes = {
    id: number;
    rent_uuid: string;        // 8자리 대여 UUID
    mdn: string;             // 차량 식별키
    renterName: string;      // 사용자 이름
    renterPhone: string;     // 사용자 전화번호
    purpose: string;         // 차량 사용 목적
    rentStime: string;       // 대여 시작 시간
    rentLoc: string;         // 대여 위치
    rentEtime: string;       // 대여 종료 시간
    returnLoc: string;      // 반납 위치
    rentStatus: string;      // 대여 상태
}
