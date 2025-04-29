import { create } from 'zustand';
import { DriveDetailRecord, DriveRecord } from '@/constants/types/historyTypes';
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
  driveDetail: DriveDetailRecord | null;
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
  setDriveDetail: (detail: DriveDetailRecord | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalElements: (elements: number) => void;
  setPageSize: (size: number) => void;
  setSearchText: (text: string) => void;
  setSearchDate: (date: { sDate: Date; eDate: Date }) => void;
  fetchDrives: (text: string, mdn: string, searchDate: { sDate: Date; eDate: Date }, page: number, size: number) => Promise<void>;
}

export const useDriveListStore = create<DriveListState>((set, get) => ({
  driveResults: [],
  selectedCar: null,
  selectedDriveId: null,
  driveDetail: null,
  isLoading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pageSize: 10,
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