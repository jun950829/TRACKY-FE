import { useEffect } from "react";
import { useSseStore } from "@/stores/useSseStore";

interface UseDriveSseProps {
  driveId: number;
}

export const useDriveSse = ({ driveId }: UseDriveSseProps) => {
  useEffect(() => {
    if (!driveId) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=99`
      // `${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=${driveId}`
    );

    const handleDrivePath = (event: MessageEvent) => {
      const gpsList = JSON.parse(event.data); 
      console.log("SSE: drive_path", gpsList);

      useSseStore.getState().setGpsList((prev) => [...prev, ...gpsList]);
    };

    eventSource.addEventListener("drive_path", handleDrivePath);

    return () => {
      eventSource.close();
      console.log("SSE 연결 종료");
    };
  }, [driveId]);
};
