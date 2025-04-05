import { create } from "zustand";
import { RentRecord, TripRecord } from "@/constants/mocks/historyMockData";

// 히스토리 상태 인터페이스
interface HistoryState {
  // 검색 관련
  searchText: string;
  searchType: 'rent' | 'trip';
  isLoading: boolean;
  error: string | null;
  
  // 선택된 항목
  selectedRent: RentRecord | null;
  selectedTrip: TripRecord | null;
  
  // 검색 결과
  rentResults: RentRecord[];
  tripResults: TripRecord[];
  
  // 드로어 상태
  isDrawerOpen: boolean;
  
  // 액션
  setSearchText: (text: string) => void;
  setSearchType: (type: 'rent' | 'trip') => void;
  setRentResults: (rents: RentRecord[]) => void;
  setTripResults: (trips: TripRecord[]) => void;
  setSelectedRent: (rent: RentRecord | null) => void;
  setSelectedTrip: (trip: TripRecord | null) => void;
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
  selectedTrip: null,
  rentResults: [],
  tripResults: [],
  isDrawerOpen: true
};

// 상태 저장소 생성
export const useHistoryStore = create<HistoryState>((set) => ({
  ...initialState,
  
  setSearchText: (text) => set({ searchText: text }),
  
  setSearchType: (type) => set({ searchType: type }),
  
  setRentResults: (rents) => set({ rentResults: rents }),
  
  setTripResults: (trips) => set({ tripResults: trips }),
  
  setSelectedRent: (rent) => set({ 
    selectedRent: rent,
    // 렌트를 선택하면 첫 번째 트립도 자동 선택
    selectedTrip: rent && rent.trips.length > 0 ? rent.trips[0] : null 
  }),
  
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  
  resetAll: () => set(initialState)
})); 