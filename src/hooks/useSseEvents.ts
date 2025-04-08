import { useSseStore } from "@/stores/useSseStore";
import { useEffect } from "react";


export const useSseEvents = () => {
  useEffect(() => {
    const clientId = Date.now().toString();
    const eventSource = new EventSource(`${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?clientId=${clientId}`);

    const handleEvent = (eventType: string) => (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      console.log("sse : ", eventType, payload);
      useSseStore.getState().addEvent({
        type: eventType,
        payload,
        timestamp: Date.now(),
      });
    };

    eventSource.addEventListener("car_event", handleEvent("car-event"));
    eventSource.addEventListener("rent_event", handleEvent("rent-event"));

    return () => {
      eventSource.close();
      console.log("🔌 SSE 연결 종료");
    };
  }, []);
};
