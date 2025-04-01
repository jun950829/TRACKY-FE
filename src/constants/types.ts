export type CarTypes = {
  id: number;
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
  id: number;
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