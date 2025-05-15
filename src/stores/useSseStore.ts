import { GpsData } from "@/constants/types/historyTypes";
import { SseEventPayloadType } from "@/constants/types/types";
import { create } from "zustand";

type SseStore = {
  //gpsList
  gpsList: GpsData[];
  cycleGpsList: GpsData[];
  gpsQueue: GpsData[][];  // 60개씩 묶인 데이터 큐
  
  setGpsList: (updater: (prev: GpsData[]) => GpsData[]) => void;
  clearGpsList: () => void;
  addToQueue: (data: GpsData[]) => void;
  getNextCycle: () => GpsData[] | null;
  clearQueue: () => void;

  // sse
  eventSource: EventSource | null;
  connectSse: (driveId: number) => void;
  resetSse: () => void;
};

export const useSseStore = create<SseStore>((set, get) => ({
  gpsList: [],
  cycleGpsList: [],
  gpsQueue: [],
  eventSource: null,

  setGpsList: (updater) =>
    set((state) => ({
      gpsList: updater(state.gpsList),
    })),
  clearGpsList: () => set({ gpsList: [] }),

  addToQueue: (data) => {
    console.log("새로운 데이터 큐에 추가:", data[0], "~", data[data.length - 1]);
    console.log("현재 큐 길이:", get().gpsQueue.length);
    
    // 마지막 데이터와 새로운 데이터의 시간 차이를 확인
    const lastQueue = get().gpsQueue[get().gpsQueue.length - 1];
    if (lastQueue && lastQueue.length > 0) {
      const lastPoint = lastQueue[lastQueue.length - 1];
      const newFirstPoint = data[0];
      
      // 시간 차이가 2초 이상이면 새로운 큐로 추가
      const timeDiff = new Date(newFirstPoint.oTime).getTime() - new Date(lastPoint.oTime).getTime();
      if (timeDiff > 2000) {
        set((state) => ({
          gpsQueue: [...state.gpsQueue, data]
        }));
      } else {
        // 시간 차이가 2초 이하면 마지막 큐에 데이터 추가
        set((state) => {
          const newQueue = [...state.gpsQueue];
          newQueue[newQueue.length - 1] = [...lastQueue, ...data];
          return { gpsQueue: newQueue };
        });
      }
    } else {
      // 첫 번째 데이터인 경우
      set((state) => ({
        gpsQueue: [...state.gpsQueue, data]
      }));
    }
  },

  getNextCycle: () => {
    const state = get();
    if (state.gpsQueue.length === 0) {
      console.log("큐가 비어있음");
      return null;
    }
    
    const nextCycle = state.gpsQueue[0];
    console.log("다음 사이클 가져오기:", nextCycle[0], "~", nextCycle[nextCycle.length - 1]);
    console.log("남은 큐 길이:", state.gpsQueue.length - 1);
    
    set((state) => ({
      gpsQueue: state.gpsQueue.slice(1)
    }));
    return nextCycle;
  },

  clearQueue: () => {
    console.log("큐 초기화");
    set({ gpsQueue: [] });
  },

  //sse
  connectSse: (driveId: number) => {
    // 이전 SSE 연결이 있다면 해제
    const prev = get().eventSource;
    if (prev) {
      prev.close();
      set({ eventSource: null });
    }

    console.log("SSE 연결 시작:", driveId);
    const es = new EventSource(`${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=${driveId}`);

    es.addEventListener("drive_path", (event: MessageEvent) => {
      try {
        const gpsData = JSON.parse(event.data);
        console.log("SSE 이벤트 수신:", gpsData[0], "~", gpsData[gpsData.length - 1]);
        // 새로운 데이터를 큐에 추가
        get().addToQueue(gpsData);
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
      set({ eventSource: null });
    };

    set({ eventSource: es });
  },

  resetSse: () => {
    console.log("SSE 리셋");
    const es = get().eventSource;
    if (es) {
      es.close();
      set({ 
        gpsList: [], 
        cycleGpsList: [],
        eventSource: null, 
        gpsQueue: [] 
      });
    }
  },
}));
