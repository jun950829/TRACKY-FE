import { CarDetailTypes, RentDetailTypes } from "../types/types";
import { TripInfo } from "@/stores/useInfoStore";

// 예약 정보 Mock 데이터
export const mockRentDetail: RentDetailTypes = {
  rent_uuid: "RT123456",
  mdn: "0488539469",
  renterName: "김철수",
  renterPhone: "010-1234-5678",
  purpose: "출장",
  rentStatus: "INPROGRESS",
  rentStime: "2023-04-05T09:00:00",
  rentLoc: "서울시 강남구",
  rentEtime: "2023-04-08T18:00:00",
  returnLoc: "서울시 강남구",
  createdAt: "2023-04-03T15:30:00",
};

// 차량 정보 Mock 데이터
export const mockCarDetail: CarDetailTypes = {
  mdn: "0488539469",
  bizId: 1,
  carType: "소나타",
  carPlate: "서울 12가 3456",
  carYear: "2022",
  purpose: "법인",
  status: "운행중",
  sum: 12345,
  deviceInfo: {
    id: 1,
    tid: "T001",
    mid: "M001",
    did: "D001",
    pv: "1.0"
  },
  createdAt: "2022-01-15T10:30:00"
};

// 운행 정보 Mock 데이터
export const mockTrips: TripInfo[] = [
  {
    oTime: "2023-04-05T09:15:00",
    lat: 37.5665,
    lon: 126.9780,
    sum: 0,
    spd: 0,
  },
  {
    oTime: "2023-04-05T10:30:00",
    lat: 37.5832,
    lon: 126.9890,
    sum: 5420,
    spd: 65,
  },
  {
    oTime: "2023-04-05T11:45:00",
    lat: 37.6050,
    lon: 127.0100,
    sum: 9850,
    spd: 45,
  },
  {
    oTime: "2023-04-05T13:00:00",
    lat: 37.6230,
    lon: 127.0220,
    sum: 15300,
    spd: 70,
  },
  {
    oTime: "2023-04-05T14:15:00",
    lat: 37.6400,
    lon: 127.0350,
    sum: 19850,
    spd: 50,
  },
  {
    oTime: "2023-04-05T15:30:00",
    lat: 37.6550,
    lon: 127.0480,
    sum: 24320,
    spd: 60,
  },
  {
    oTime: "2023-04-05T16:45:00",
    lat: 37.6700,
    lon: 127.0600,
    sum: 28920,
    spd: 55,
  },
  {
    oTime: "2023-04-06T09:30:00",
    lat: 37.5700,
    lon: 126.9800,
    sum: 29000,
    spd: 0,
  },
  {
    oTime: "2023-04-06T10:45:00",
    lat: 37.5850,
    lon: 126.9950,
    sum: 34520,
    spd: 75,
  },
  {
    oTime: "2023-04-06T12:00:00",
    lat: 37.6000,
    lon: 127.0100,
    sum: 39850,
    spd: 62,
  },
];

// 다양한 상태의 예약 정보 Mock 데이터
export const mockRentDetails: RentDetailTypes[] = [
  {
    ...mockRentDetail,
    rent_uuid: "RT123456",
    rentStatus: "INPROGRESS",
  },
  {
    ...mockRentDetail,
    rent_uuid: "RT789012",
    renterName: "이영희",
    renterPhone: "010-9876-5432",
    rentStatus: "COMPLETED",
    rentStime: "2023-03-15T14:00:00",
    rentEtime: "2023-03-18T18:00:00",
    createdAt: "2023-03-10T11:30:00",
  },
  {
    ...mockRentDetail,
    rent_uuid: "RT345678",
    renterName: "박지민",
    renterPhone: "010-5555-7777",
    rentStatus: "SCHEDULED",
    rentStime: "2023-04-20T10:00:00",
    rentEtime: "2023-04-23T17:00:00",
    createdAt: "2023-04-01T09:45:00",
  },
  {
    ...mockRentDetail,
    rent_uuid: "RT901234",
    renterName: "최수진",
    renterPhone: "010-2222-3333",
    rentStatus: "CANCELED",
    rentStime: "2023-03-25T09:00:00",
    rentEtime: "2023-03-26T18:00:00",
    createdAt: "2023-03-20T16:20:00",
  },
]; 