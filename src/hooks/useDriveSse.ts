import { useSseStore } from "@/stores/useSseStore";
import { useEffect } from "react";

interface UseDriveSseProps {
  driveId: number;
}

export const useDriveSse = ({ driveId }: UseDriveSseProps) => {

  useEffect(() => {
    //console.log("useDriveSse 실행됨! driveId:", driveId);
    if (!driveId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=${driveId}`,
    );

    eventSource.addEventListener("init", (event) => {
      console.log("init 이벤트 수신:", event.data);
    });

    eventSource.addEventListener("drive_path", (event) => {
      try {
        const gpsList = JSON.parse(event.data);
        console.log("drive_path 수신:", gpsList);
        useSseStore.getState().setGpsList((prev) => [...prev, ...gpsList]);
      } catch (err) {
        console.error("JSON 파싱 오류:", err, event.data);
      }
    });

    eventSource.onmessage = (event) => {
      console.log("기본 message 이벤트 수신:", event.data);
    };

    eventSource.onerror = (err) => {
      console.error("SSE 오류 발생:", err);
      console.log("SSE 상태코드:", eventSource.readyState);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      console.log("SSE 연결 종료");
    };
  }, [driveId]);
};

