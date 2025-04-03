import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { buildCycleGpsList, toCycleInfoRequest } from "@/libs/utils/gpsUtils";
import carApiService from "@/libs/apis/carApi";

function Emulator() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [stats, setStats] = useState({
    packetsCount: 0,
    totalDistance: 0,
    avgSpeed: 0,
  });
  
  const locationBuffer = useRef<GeolocationPosition[]>([]);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const totalDistanceRef = useRef<number>(0);
  
  // Car SVG icon
  const CarIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const startTracking = () => {
    if (isTracking) return;
    
    setIsTracking(true);
    locationBuffer.current = [];
    
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }
    
    intervalId.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          locationBuffer.current.push(pos);
          
          if (locationBuffer.current.length >= 10) {
            const dataToSend = [...locationBuffer.current];
            locationBuffer.current = [];
            
            // GPS 데이터 가공
            const gpsList = buildCycleGpsList(dataToSend, 1);
            
            // 누적 거리 계산
            if (gpsList.length > 0) {
              const last = gpsList[gpsList.length - 1];
              totalDistanceRef.current += last.sum;
              
              // sum 값들을 현재까지 누적 거리로 업데이트
              gpsList.forEach((item) => {
                item.sum += totalDistanceRef.current - last.sum;
              });
              
              // 상태 업데이트
              setStats(prev => ({
                packetsCount: prev.packetsCount + 1,
                totalDistance: parseFloat(totalDistanceRef.current.toFixed(1)),
                avgSpeed: gpsList.reduce((sum, item) => sum + item.spd, 0) / gpsList.length
              }));
            }
            
            const cycleRequest = toCycleInfoRequest(gpsList, {
              mdn: "01234567890",
              tid: "A001",
              mid: "6",
              pv: "5",
              did: "1",
            });
            
            // 데이터 전송
            carApiService.sendCycleInfo(cycleRequest)
              .then(() => console.log("✅ 위치 정보 전송 성공"))
              .catch((err) => console.error("🚨 위치 정보 전송 실패:", err));
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
    }, 1000);
  };
  
  const stopTracking = () => {
    if (!isTracking) return;
    
    setIsTracking(false);
    
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    
    // 남은 버퍼 데이터 전송
    if (locationBuffer.current.length > 0) {
      const dataToSend = [...locationBuffer.current];
      locationBuffer.current = [];
      
      const gpsList = buildCycleGpsList(dataToSend, 1);
      
      if (gpsList.length > 0) {
        const last = gpsList[gpsList.length - 1];
        totalDistanceRef.current += last.sum;
        
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
      
      carApiService.sendCycleInfo(cycleRequest)
        .then(() => console.log("✅ 남은 위치 정보 전송 성공"))
        .catch((err) => console.error("🚨 남은 위치 정보 전송 실패:", err));
    }
  };
  
  useEffect(() => {
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-slate-700/50 p-4 md:p-6 border-b border-slate-600">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <CarIcon /> 차량 GPS 에뮬레이터
          </h1>
          <p className="text-slate-300 mt-1">실시간 차량 위치 정보 수집 및 전송</p>
        </div>
        
        {/* 메인 콘텐츠 */}
        <div className="md:flex">
          {/* 좌측: 지표 및 컨트롤 */}
          <div className="p-4 md:p-6 md:w-1/2 lg:w-2/5">
            <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">총 거리</p>
                <p className="text-2xl font-bold">{stats.totalDistance} m</p>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">평균 속도</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgSpeed)} m/s</p>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">전송 패킷</p>
                <p className="text-2xl font-bold">{stats.packetsCount}</p>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">상태</p>
                <p className="text-2xl font-bold flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isTracking ? 'bg-green-500' : 'bg-slate-500'}`}></span>
                  {isTracking ? '활성' : '대기'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mb-6">
              <button
                onClick={startTracking}
                disabled={isTracking}
                className={`flex-1 py-3 px-4 rounded-md font-medium flex justify-center items-center gap-2 transition-all ${
                  isTracking 
                    ? 'bg-green-800/40 text-green-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                시작
              </button>
              <button
                onClick={stopTracking}
                disabled={!isTracking}
                className={`flex-1 py-3 px-4 rounded-md font-medium flex justify-center items-center gap-2 transition-all ${
                  !isTracking 
                    ? 'bg-red-800/40 text-red-300 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-500 text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                중지
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-md mb-4">
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            {position && (
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-medium text-slate-200 mb-2">현재 위치</h3>
                <div className="flex justify-between">
                  <span className="text-slate-400">위도</span>
                  <span className="font-mono">{position.coords.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">경도</span>
                  <span className="font-mono">{position.coords.longitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">정확도</span>
                  <span className="font-mono">{position.coords.accuracy.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">시간</span>
                  <span className="font-mono">{new Date(position.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* 우측: 시각화 */}
          <div className="p-4 md:p-6 md:w-1/2 lg:w-3/5 border-t md:border-t-0 md:border-l border-slate-700">
            <div className="bg-slate-800/50 rounded-lg overflow-hidden h-64 md:h-full min-h-80 flex items-center justify-center relative">
              {position ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="relative w-full h-40 md:h-56 lg:h-72 overflow-hidden bg-slate-900/60 rounded-lg mb-4">
                    {isTracking && (
                      <motion.div
                        className="absolute"
                        animate={{
                          x: [0, '100%', '0%'],
                          y: ['40%', '60%', '40%'],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="text-blue-500">
                          <CarIcon />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* 가상 경로 */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d="M0,50 C20,30 40,70 60,50 C80,30 100,70 100,50"
                        stroke="rgba(59, 130, 246, 0.3)"
                        strokeWidth="0.5"
                        fill="none"
                      />
                    </svg>
                  </div>
                  
                  <div className="text-center px-4">
                    <p className="text-slate-300 text-sm">
                      {isTracking 
                        ? '위치 데이터 수집 및 전송 중...' 
                        : '시작 버튼을 눌러 위치 데이터 전송을 시작하세요'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-4 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>위치 정보를 가져오는 중...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emulator;
