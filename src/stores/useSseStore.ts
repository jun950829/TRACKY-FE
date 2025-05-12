import { GpsData } from "@/constants/types/historyTypes";
import { SseEventPayloadType } from "@/constants/types/types";
import { create } from "zustand";

type SseStore = {
  //gpsList
  gpsList: GpsData[];
  cycleGpsList: GpsData[],
  
  setGpsList: (updater: (prev: GpsData[]) => GpsData[]) => void;
  clearGpsList: () => void;

  // sse
  eventSource: EventSource | null;
  connectSse: (driveId: number) => void;
  resetSse: () => void;
};

export const useSseStore = create<SseStore>((set, get) => ({
  gpsList: [],
  cycleGpsList: [],
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

    const es = new EventSource(`${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=${driveId}`);

    es.addEventListener("drive_path", (event: MessageEvent) => {
      try {
        const gpsData = JSON.parse(event.data);
        set((state) => ({
          gpsList: [...state.gpsList, ...gpsData],
          cycleGpsList: [...gpsData]
        }));
      } catch (err) {
        console.error("drive_path 이벤트 파싱 오류:", err);
      }
    });

    es.onmessage = (event) => {
      console.log("기본 message 이벤트 수신:", event.data);
    }

    es.onerror = (err) => {
      console.error("SSE 오류 발생:", err);
      console.log("SSE 상태코드:", es.readyState);
      es.close();
    };

    set({ eventSource: es });
  },

  resetSse: () => {
    const es = get().eventSource;
    if (es) es.close();
    set({ gpsList: [], eventSource: null });
  },
}));
