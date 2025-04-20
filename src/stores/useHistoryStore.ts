import { create } from "zustand";
import { CarRecord, DriveDetailRecord, BizRecord, DriveRecord } from "@/constants/types/historyTypes";

// 히스토리 상태 인터페이스
interface HistoryState {
  // 검색 관련
  searchText: string;
  searchType: 'biz' | 'car';
  isLoading: boolean;
  error: string | null;
  
  // 선택된 항목
  selectedBiz: BizRecord | null;
  selectedCar: CarRecord | null;
  selectedDriveId: number | null;
  selectedDetail: DriveDetailRecord | null;
  
  // 검색 결과
  bizResults: BizRecord[];
  carResults: CarRecord[];
  driveResults: DriveRecord[];
  
  // 드로어 상태
  isDrawerOpen: boolean;
  
  // 액션
  setSearchText: (text: string) => void;
  setSearchType: (type: 'biz' | 'car') => void;
  setBizResults: (bizs: BizRecord[]) => void;
  setCarResults: (cars: CarRecord[]) => void;
  setDriveResults: (drives: DriveRecord[]) => void;
  setSelectedBiz: (biz: BizRecord | null) => void;
  setSelectedCar: (car: CarRecord | null) => void;
  setSelectedDriveId: (driveId: number | null) => void;
  setSelectedDetail: (detail: DriveDetailRecord | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  resetAll: () => void;
}

// 초기 상태
const initialState = {
  searchText: '',
  searchType: 'car' as const,
  isLoading: false,
  error: null,
  selectedBiz: null,
  selectedCar: null,
  selectedDriveId: null,
  selectedDetail: null,
  bizResults: [],
  carResults: [],
  driveResults: [],
  isDrawerOpen: true
};

// 상태 저장소 생성
export const useHistoryStore = create<HistoryState>((set) => ({
  ...initialState,
  
  setSearchText: (text) => set({ searchText: text }),
  
  setSearchType: (type) => set({ searchType: type }),
  
  setBizResults: (bizs) => set({ bizResults: bizs }),

  setCarResults: (cars) => set({ carResults: cars }),
  
  setDriveResults: (drives) => set({ driveResults: drives }),
  
  setSelectedBiz: (biz) => set({ selectedBiz: biz }),

  setSelectedCar: (car) => set({ selectedCar: car }),
  
  setSelectedDriveId: (driveId) => set({ selectedDriveId: driveId }),

  setSelectedDetail: (detail) => set({ selectedDetail: detail }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  
  resetAll: () => set(initialState)
})); 