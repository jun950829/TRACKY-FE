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
  setDriveDetail: (detail: DriveRecord | null) => void;
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
})); 