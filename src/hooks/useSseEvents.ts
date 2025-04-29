import { useSseStore } from "@/stores/useSseStore";
import { useState } from "react";

export const useSseEvents = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const connect = () => {
    if (isConnected) return;

    const clientId = Date.now().toString();
    const newEventSource = new EventSource(`${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?clientId=${clientId}`);

    const handleEvent = (eventType: string) => (event: MessageEvent) => {
      const payload = JSON.parse(event.data);
      console.log("sse : ", eventType, payload);
      useSseStore.getState().addEvent({
        type: eventType,
        payload,
        timestamp: Date.now(),
      });
    };

    newEventSource.addEventListener("gps_data", handleEvent("gps_data"));

    setEventSource(newEventSource);
    setIsConnected(true);
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
      setIsConnected(false);
      console.log("SSE 연결 종료");
    }
  };

  return {
    isConnected,
    connect,
    disconnect
  };
};
