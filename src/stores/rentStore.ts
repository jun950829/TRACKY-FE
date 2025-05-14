import { create } from 'zustand';
import { AddressResult } from '@/libs/apis/addressApi';

export interface RentFormState {
  // Step 1: User & Vehicle Info
  renterName: string;
  renterPhone: string;
  purpose: string;
  selectedVehicle: string | null;
  
  // Step 2: Date & Time
  rentStime: string | null;
  rentEtime: string | null;
  
  // Step 3: Locations
  rentLocation: AddressResult | null;
  returnLocation: AddressResult | null;
  
  // Current step
  currentStep: number;
  
  // Actions
  setStep1Data: (data: { renterName: string; renterPhone: string; purpose: string; selectedVehicle: string }) => void;
  setStep2Data: (data: { rentStime: string; rentEtime: string }) => void;
  setStep3Data: (data: { rentLocation: AddressResult; returnLocation: AddressResult }) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
}

const initialState = {
  renterName: '',
  renterPhone: '',
  purpose: '',
  selectedVehicle: null,
  rentStime: null,
  rentEtime: null,
  rentLocation: null,
  returnLocation: null,
  currentStep: 1,
};

export const useRentStore = create<RentFormState>((set) => ({
  ...initialState,
  
  setStep1Data: (data) => set((state) => ({
    ...state,
    ...data,
  })),
  
  setStep2Data: (data) => set((state) => ({
    ...state,
    ...data,
  })),
  
  setStep3Data: (data) => set((state) => ({
    ...state,
    ...data,
  })),
  
  setCurrentStep: (step) => set((state) => ({
    ...state,
    currentStep: step,
  })),
  
  resetForm: () => set(initialState),
})); 