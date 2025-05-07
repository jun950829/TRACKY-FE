import { SseEventPayloadType } from "@/constants/types/types";
import { create } from "zustand";

type GpsPoint = {
  lat: number;
  lon: number;
  oTime: string;
}

type SseStore = {
  gpsList: GpsPoint[];
  setGpsList: (updater: (prev: GpsPoint[]) => GpsPoint[]) => void;
  clearGpsList: () => void;
};

export const useSseStore = create<SseStore>((set) => ({
  gpsList: [],
  setGpsList: (updater) =>
    set((state) => ({
      gpsList: updater(state.gpsList),
    })),
  clearGpsList: () => set({ gpsList: [] }),
}));
