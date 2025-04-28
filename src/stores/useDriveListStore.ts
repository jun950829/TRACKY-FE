import { create } from 'zustand';
import { DriveRecord } from '@/constants/types/historyTypes';
import driveService from '@/libs/apis/driveApi';
import { subMonths } from 'date-fns';

interface DriveListState {
  driveResults: DriveRecord[];
  selectedCar: {
    carMdn: string;
    carPlate: string;
    carType: string;
    status: string;
  } | null;
  selectedDriveId: number | null;
  driveDetail: DriveRecord | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  searchText: string;
  searchDate: {
    sDate: Date;
    eDate: Date;
  };
  setDriveResults: (results: DriveRecord[]) => void;
  setSelectedCar: (car: { carMdn: string; carPlate: string; carType: string; status: string } | null) => void;
  setSelectedDriveId: (id: number | null) => void;
  setDriveDetail: (detail: DriveRecord | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDrives: (text: string, mdn: string, date: {sDate: Date, eDate: Date}, page?: number, size?: number) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalElements: (elements: number) => void;
  setPageSize: (size: number) => void;
  setSearchText: (text: string) => void;
}

export const useDriveListStore = create<DriveListState>((set) => ({
  driveResults: [],
  selectedCar: null,
  selectedDriveId: null,
  driveDetail: null,
  isLoading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 1,
  searchDate: {
    sDate: subMonths(new Date(), 3),
    eDate: new Date()
  },
  searchText: '',
  setDriveResults: (results) => set({ driveResults: results }),
  setSelectedCar: (car) => set({ selectedCar: car }),
  setSelectedDriveId: (id) => set({ selectedDriveId: id }),
  setDriveDetail: (detail) => set({ driveDetail: detail }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
  setTotalElements: (elements) => set({ totalElements: elements }),
  setPageSize: (size) => set({ pageSize: size }),
  fetchDrives: async (text: string, mdn: string, date: {sDate: Date, eDate: Date}, page?: number, size?: number) => {
    set({ isLoading: true });
    try {
      const response = await driveService.getDriveBySearchFilter(text, mdn, date, page, size);
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
  setSearchText: (text) => set({ searchText: text })
})); 