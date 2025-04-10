import { create } from "zustand";
import { RentDetailTypes, CarDetailTypes } from "@/constants/types/types";

// 운행 정보 타입 정의
export interface TripInfo {
  oTime: string;
  offTime: string | null;
  distance: number;
  startAddress: string;
  endAddress: string;

  // 📌 좌표 추가!
  driveStartLat: number;
  driveStartLon: number;
  driveEndLat: number;
  driveEndLon: number;
}
// 정보 조회 결과 타입 정의
export interface InfoSearchResult {
  rent: RentDetailTypes | null;
  car: CarDetailTypes | null;
  trips: TripInfo[];
  isLoading: boolean;
  error: string | null;
}

interface InfoStore extends InfoSearchResult {
  setInfo: (data: Partial<InfoSearchResult>) => void;
  resetInfo: () => void;
}

// 초기 상태 정의
const initialState: InfoSearchResult = {
  rent: null,
  car: null,
  trips: [],
  isLoading: false,
  error: null,
};

// Zustand 스토어 생성
export const useInfoStore = create<InfoStore>((set) => ({
  ...initialState,

  setInfo: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  resetInfo: () => set(initialState),
}));
