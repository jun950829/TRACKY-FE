import { GpsData } from "@/constants/types/historyTypes";
import { SseEventPayloadType } from "@/constants/types/types";
import { create } from "zustand";

type SseStore = {
  //gpsList
  gpsList: GpsData[];
  setGpsList: (updater: (prev: GpsData[]) => GpsData[]) => void;
  clearGpsList: () => void;

  // sse
  eventSource: EventSource | null;
  connectSse: (driveId: number) => void;
  resetSse: () => void;
};

export const useSseStore = create<SseStore>((set, get) => ({
  gpsList: [],
  eventSource: null,

  setGpsList: (updater) =>
    set((state) => ({
      gpsList: updater(state.gpsList),
    })),
  clearGpsList: () => set({ gpsList: [] }),


  //sse
  connectSse: (driveId: number) => {
    const prev = get().eventSource;
    if (prev) prev.close();

    const es = new EventSource(`${import.meta.env.VITE_API_BASE}/subscribe?driveId=${driveId}`);

    es.addEventListener("drive_path", (event: MessageEvent) => {
      try {
        const gpsData = JSON.parse(event.data);
        set((state) => ({
          gpsList: [...state.gpsList, ...gpsData],
        }));
      } catch (err) {
        console.error("drive_path 이벤트 파싱 오류:", err);
      }
    });

    set({ eventSource: es });
  },

  resetSse: () => {
    const es = get().eventSource;
    if (es) es.close();
    set({ gpsList: [], eventSource: null });
  },
}));
