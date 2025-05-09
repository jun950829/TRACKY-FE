export const mockCars = [
  {
    id: 1,
    mdn: '0488539469',
    bizId: 1,
    carType: '소나타',
    carPlate: '전북 62서 1207',
    carYear: '2013',
    purpose: '법인',
    status: '운행중',
    sum: '23451',
    createdAt: '2020-05-16T23:30:46'
    },
    {
    id: 2,
    mdn: '0077184075',
    bizId: 1,
    carType: '아반떼',
    carPlate: '대전 51거 8511',
    carYear: '2017',
    purpose: '법인',
    status: '운행중',
    sum: '25285',
    createdAt: '2022-09-14T18:03:08'
    },
];

export const deviceInfo = {
  mdn: "9999999999",
  tid: "A001",
  mid: "6",
  pv: "5",
  did: "1",
};

// 시동 요청 타입
export interface EngineRequestType {
  mdn: string;
  tid: string;
  mid: string;
  pv: string;
  did: string;
  onTime: string;
  offTime: string | null;
  gcd: string;
  lat: number;
  lon: number;
  ang: string;
  spd: string;
  sum: number;
}