import { create } from "zustand";
import { RentRecord, DriveRecord, DriveDetailRecord } from "@/constants/historyTypes";

// 히스토리 상태 인터페이스
interface HistoryState {
  // 검색 관련
  searchText: string;
  searchType: 'rent' | 'car';
  isLoading: boolean;
  error: string | null;
  
  // 선택된 항목
  selectedRent: RentRecord | null;
  selectedDrive: DriveRecord | null;
  selectedDetail: DriveDetailRecord | null;
  
  // 검색 결과
  rentResults: RentRecord[];
  driveResults: DriveRecord[];
  
  // 드로어 상태
  isDrawerOpen: boolean;
  
  // 액션
  setSearchText: (text: string) => void;
  setSearchType: (type: 'rent' | 'car') => void;
  setRentResults: (rents: RentRecord[]) => void;
  setDriveResults: (drives: DriveRecord[]) => void;
  setSelectedRent: (rent: RentRecord | null) => void;
  setSelectedDrive: (drive: DriveRecord | null) => void;
  setSelectedDetail: (detail: DriveDetailRecord | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  resetAll: () => void;
}

// 초기 상태
const initialState = {
  searchText: '',
  searchType: 'rent' as const,
  isLoading: false,
  error: null,
  selectedRent: null,
  selectedDrive: null,
  selectedDetail: null,
  rentResults: [],
  driveResults: [],
  isDrawerOpen: true
};

// 상태 저장소 생성
export const useHistoryStore = create<HistoryState>((set) => ({
  ...initialState,
  
  setSearchText: (text) => set({ searchText: text }),
  
  setSearchType: (type) => set({ searchType: type }),
  
  setRentResults: (rents) => set({ rentResults: rents }),
  
  setDriveResults: (drives) => set({ driveResults: drives }),
  
  setSelectedRent: (rent) => set({ selectedRent: rent }),
  
  setSelectedDrive: (drive) => set({ selectedDrive: drive }),

  setSelectedDetail: (detail) => set({ selectedDetail: detail }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  
  resetAll: () => set(initialState)
})); 