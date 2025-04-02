export type CarTypes = {
  id: number;
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: string;
  createdAt?: string;
}

export type CarCreateTypes = {
  mdn: string;
  bizId?: string;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: number | string;
}

export type Devices = {
  id: number;
  tid: string;
  mid: string;
  did: string;
  pv: string;
}

export type CarDetailTypes = {
  id: number;
  mdn: string;
  bizId: number;
  carType: string;
  carPlate: string;
  carYear: string;
  purpose: string;
  status: string;
  sum: string;
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
