import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";

import { buildCycleGpsList, toCycleInfoRequest } from "@/libs/utils/gpsUtils"; // 유틸 경로 맞춰주세요

function Emulator() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locationBuffer = useRef<GeolocationPosition[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();
  const totalDistanceRef = useRef<number>(0); // 누적 거리 유지용

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }

    controls.start({
      x: [0, 300, 0],
      transition: {
        repeat: Infinity,
        duration: 60,
        ease: "linear",
      },
    });

    intervalId.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // console.log("위치 기록:", pos);
          setPosition(pos);
          locationBuffer.current.push(pos);

          if (locationBuffer.current.length >= 60) {
            const dataToSend = [...locationBuffer.current];
            locationBuffer.current = [];

            // 👉 gps 유틸 함수 사용해서 가공
            const gpsList = buildCycleGpsList(dataToSend, 1);

            console.log(gpsList);

            // 누적 거리 이어붙이기
            if (gpsList.length > 0) {
              const last = gpsList[gpsList.length - 1];
              totalDistanceRef.current += last.sum;
              // sum 값들을 현재까지 누적 거리로 덮어씌우기
              gpsList.forEach((item) => {
                item.sum += totalDistanceRef.current - last.sum;
              });
            }

            const cycleRequest = toCycleInfoRequest(gpsList, {
              mdn: "01234567890",
              tid: "A001",
              mid: "6",
              pv: "5",
              did: "1",
            });

            console.log("📦 전송할 패킷:", cycleRequest);

            // 실제 전송
            axios
              .post("/api/locations", cycleRequest)
              .then(() => {
                console.log("✅ 위치 정보 전송 성공");
              })
              .catch((err) => {
                console.error("🚨 위치 정보 전송 실패:", err);
              });
          }
        },
        (err) => {
          console.error("🚨 위치 가져오기 실패:", err.message);
          setError(`위치 정보를 가져오는 데 실패했습니다: ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }, 1000); // 1초 간격

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
      controls.stop();
    };
  }, []);

  return (
    <div className="p-4 rounded-xl shadow-md bg-white text-black space-y-4">
      <h2 className="text-lg font-bold mb-2">🚘 실시간 위치 추적 애니메이터</h2>
      <div className="h-24 bg-gray-100 rounded-xl flex items-center overflow-hidden relative">
        <motion.div
          animate={controls}
          className="w-16 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
        >
          🚗
        </motion.div>
      </div>
      {error && <p className="text-red-500">🚨 {error}</p>}
      {position ? (
        <div>
          <p>🌍 위도: {position.coords.latitude}</p>
          <p>🌍 경도: {position.coords.longitude}</p>
          <p>📶 정확도: {position.coords.accuracy} meters</p>
          <p>🕒 시간: {new Date(position.timestamp).toLocaleTimeString()}</p>
        </div>
      ) : (
        <p>📡 위치 정보를 가져오는 중...</p>
      )}
    </div>
  );
}

export default Emulator;
