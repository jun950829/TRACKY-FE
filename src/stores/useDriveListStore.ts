import { create } from 'zustand';
import { DriveRecord } from '@/constants/types/historyTypes';

interface DriveListState {
  driveResults: DriveRecord[];
  selectedCar: {
    carPlate: string;
    carType: string;
    status: string;
  } | null;
  selectedDriveId: number | null;
  driveDetail: DriveRecord | null;
  isLoading: boolean;
  error: string | null;
  setDriveResults: (results: DriveRecord[]) => void;
  setSelectedCar: (car: { carPlate: string; carType: string; status: string } | null) => void;
  setSelectedDriveId: (id: number | null) => void;
  setDriveDetail: (detail: DriveDetailRecord | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDriveListStore = create<DriveListState>((set) => ({
  driveResults: [],
  selectedCar: null,
  selectedDriveId: null,
  driveDetail: null,
  isLoading: false,
  error: null,
  setDriveResults: (results) => set({ driveResults: results }),
  setSelectedCar: (car) => set({ selectedCar: car }),
  setSelectedDriveId: (id) => set({ selectedDriveId: id }),
  setDriveDetail: (detail) => set({ driveDetail: detail }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => {
    set({ currentPage: page })
    get().fetchDrives(get().searchText, get().selectedCar?.carMdn || "", get().searchDate, page, get().pageSize);
  },
  setTotalPages: (pages) => set({ totalPages: pages }),
  setTotalElements: (elements) => set({ totalElements: elements }),
  setPageSize: (size) => set({ pageSize: size }),
  setSearchText: (text) => {
    set({ searchText: text })
    get().fetchDrives(text, get().selectedCar?.carMdn || "", get().searchDate, get().currentPage, get().pageSize);
  },
  setSearchDate: (date) => set({ searchDate: date }),
  fetchDrives: async (text: string, mdn: string, searchDate: { sDate: Date; eDate: Date }, page: number, size: number) => {
    set({ isLoading: true });
    try {
      const response = await driveService.getDriveBySearchFilter(
        text,
        mdn,
        searchDate,
        page,
        size
      );
      set({
        driveResults: response.data,
        currentPage: response.pageResponse.number,
        totalPages: response.pageResponse.totalPages,
        totalElements: response.pageResponse.totalElements,
        pageSize: response.pageResponse.size,
      });
    } catch (error) {
      console.error('차량 검색 오류:', error);
    } finally {
      set({ isLoading: false });
    }
  },
})); 