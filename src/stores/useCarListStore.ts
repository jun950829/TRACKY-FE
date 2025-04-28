import { create } from 'zustand';
import driveService from '@/libs/apis/driveApi';
import { CarRecord } from '@/constants/types/historyTypes';

interface CarListState {
  carResults: CarRecord[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  searchText: string;
  setCarResults: (results: CarRecord[]) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalElements: (elements: number) => void;
  setPageSize: (size: number) => void;
  setSearchText: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
  fetchCars: (text: string, page?: number) => Promise<void>;
}

export const useCarListStore = create<CarListState>((set, get) => ({
  carResults: [],
  isLoading: false,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
  searchText: '',
  setCarResults: (results) => set({ carResults: results }),
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchCars(get().searchText, page);
  },
  setTotalPages: (pages) => set({ totalPages: pages }),
  setTotalElements: (elements) => set({ totalElements: elements }),
  setPageSize: (size) => set({ pageSize: size }),
  setSearchText: (text) => set({ searchText: text }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  fetchCars: async (text, page = 0, size = 20) => {
    try {
      set({ isLoading: true });
      const response = await driveService.getCars(text, page, size);
      set({
        carResults: response.data,
        currentPage: response.pageResponse.number,
        totalPages: response.pageResponse.totalPages,
        totalElements: response.pageResponse.totalElements,
        pageSize: response.pageResponse.size,
        searchText: text
      });
    } catch (error) {
      console.error('차량 검색 오류:', error);
    } finally {
      set({ isLoading: false });
    }
  }
})); 