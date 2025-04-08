import { SseEventPayloadType } from "@/constants/types/types";
import { create } from "zustand";

type SseEvent = {
  type: string;       // ex: 'car-create', 'rent-update'
  payload: SseEventPayloadType;       // 이벤트 내용
  timestamp: number;
};

type SseStore = {
  logs: SseEvent[];
  addEvent: (event: SseEvent) => void;
  clearEvents: () => void;
};

export const useSseStore = create<SseStore>((set) => ({
  logs: [],
  addEvent: (event) => set((state) => ({ logs: [event, ...state.logs] })),
  clearEvents: () => set({ logs: [] }),
}));
