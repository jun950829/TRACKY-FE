import { useSseStore } from "@/stores/useSseStore";
import { useEffect } from "react";

interface UseDriveSseProps {
  driveId: number;
}

export const useDriveSse = ({ driveId }: UseDriveSseProps) => {
  const connectSse = useSseStore((state) => state.connectSse);
  const resetSse = useSseStore((state) => state.resetSse);

  useEffect(() => {
    if (!driveId) return;

    // SSE 연결 시작
    connectSse(driveId);

    // 컴포넌트 언마운트 시 SSE 연결 해제
    return () => {
      resetSse();
    };
  }, [driveId]);
};

// import { useSseStore } from "@/stores/useSseStore";
// import { useEffect } from "react";

// interface UseDriveSseProps {
//   driveId: number;
// }

// export const useDriveSse = ({ driveId }: UseDriveSseProps) => {

//   useEffect(() => {
//     const connectSse = useSseStore((state) => state.connectSse);
//     if (!driveId) return;

//     // const eventSource = new EventSource(
//     //   `${import.meta.env.VITE_EVENTS_API_HOST}/subscribe?driveId=${driveId}`,
//     // );

//     connectSse.addEventListener("init", (event) => {
//       console.log("init 이벤트 수신:", event.data);
//     });

//     eventSource.addEventListener("drive_path", (event) => {
//       try {
//         const gpsData = JSON.parse(event.data);
//         console.log("drive_path 수신:", gpsData);
        
//         // 새로운 GPS 데이터를 스토어에 추가
//         useSseStore.getState().setGpsList((prev) => {
//           // 마지막 데이터의 시간을 확인
//           const lastTime = prev.length > 0 ? new Date(prev[prev.length - 1].oTime) : new Date(0);
          
//           // 새로운 데이터 중 마지막 데이터보다 이후의 데이터만 추가
//           const newData = gpsData.filter((point: any) => 
//             new Date(point.oTime) > lastTime
//           );
          
//           return [...prev, ...newData];
//         });
//       } catch (err) {
//         console.error("JSON 파싱 오류:", err, event.data);
//       }
//     });

//     eventSource.onmessage = (event) => {
//       console.log("기본 message 이벤트 수신:", event.data);
//     };

//     eventSource.onerror = (err) => {
//       console.error("SSE 오류 발생:", err);
//       console.log("SSE 상태코드:", eventSource.readyState);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//       console.log("SSE 연결 종료");
//     };
//   }, [driveId]);
// };

