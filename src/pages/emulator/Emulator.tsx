import { useEffect, useState, useRef } from "react";
import mockGpsData from "@/libs/utils/mockGpsData";
import gpsBuffer from "@/libs/utils/gpsBuffer";
import { hubApiService } from "@/libs/apis/hubApi";
import {
  calculateDistance,
  createEngineOnRequest,
  createEngineOffRequest,
  initLocation
} from "@/libs/utils/emulatorUtils";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom components
import GpsMap from "@/components/custom/GpsMap";
import EmulatorSettings from "@/components/custom/EmulatorSettings";

const POLLING_INTERVAL = 1000; // 1 second

// Car SVG icon
const CarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10M7 13.5C7 14.3284 6.32843 15 5.5 15C4.67157 15 4 14.3284 4 13.5C4 12.6716 4.67157 12 5.5 12C6.32843 12 7 12.6716 7 13.5ZM20 13.5C20 14.3284 19.3284 15 18.5 15C17.6716 15 17 14.3284 17 13.5C17 12.6716 17.6716 12 18.5 12C19.3284 12 20 12.6716 20 13.5Z" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Stats component for reusability
const StatCard = ({ title, value, unit = "" }: { title: string; value: number | string; unit?: string }) => (
  <Card className="bg-card/50 border-border/30">
    <CardContent className="p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-1">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
      </p>
    </CardContent>
  </Card>
);

interface IGpsTrackingState {
  isTracking: boolean;
  currentPosition: GeolocationPosition | null;
  previousPosition: GeolocationPosition | null;
  positionHistory: GeolocationPosition[];
  error: string | null;
  engineOn: boolean;
  totalDistance: number;
  stats: {
    packetsCount: number;
    totalDistance: number;
    avgSpeed: number;
    bufferSize: number;
  };
}

interface IGpsTrackingProps {
  cycleId?: string;
}

export default function Emulator({ cycleId = '1' }: IGpsTrackingProps) {
  const [trackingState, setTrackingState] = useState<IGpsTrackingState>({
    isTracking: false,
    currentPosition: null,
    previousPosition: null,
    positionHistory: [],
    error: null,
    engineOn: false,
    totalDistance: 0,
    stats: {
      packetsCount: 0,
      totalDistance: 0,
      avgSpeed: 0,
      bufferSize: 0,
    }
  });

  const [selectedTab, setSelectedTab] = useState("map");
  const [packetInterval, setPacketInterval] = useState<number>(10); // 기본 10초
  
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDistanceRef = useRef<number>(0);
  const packetsCountRef = useRef<number>(0);
  
  // Mock data related state
  const [useMockData, setUseMockData] = useState(false);
  const mockDataRef = useRef<GeolocationPosition[]>([]);
  const mockStartTimeRef = useRef<number>(0);

  const [onTime, setOnTime] = useState<string>("");

  // Initialize mock data when needed
  useEffect(() => {
    if (useMockData && mockDataRef.current.length === 0) {
      // Generate the mock route data with a speed factor (higher = faster)
      mockDataRef.current = mockGpsData.createMockRouteData(2, 15); // 15 interpolation points
    }
  }, [useMockData]);

  // GpsBuffer 초기화
  useEffect(() => {
    gpsBuffer.setInterval(packetInterval);
    gpsBuffer.setCycleId(cycleId);
  }, [packetInterval, cycleId]);

  // 에러 설정 함수
  const setError = (errorMessage: string) => {
    setTrackingState(prev => ({
      ...prev,
      error: errorMessage
    }));
  };

  // 토스트 메시지 표시 함수
  const showToast = (message: string) => {
    console.log(message); // 실제로는 토스트 컴포넌트로 대체
    // 임시로 에러 상태에 메시지 표시
    setTrackingState(prev => ({
      ...prev,
      error: message
    }));
  };

  // 위치 초기화 함수
  const initializeLocation = () => {
    initLocation(
      useMockData,
      () => {
        if (mockDataRef.current.length === 0) {
          // 모의 데이터 생성 (실제 mockGpsData 모듈 사용)
          mockDataRef.current = mockGpsData.createMockRouteData(2, 15);
        }
        return mockDataRef.current;
      },
      (position) => {
        setTrackingState((prev) => ({
          ...prev,
          currentPosition: position,
          previousPosition: position,
        }));
      },
      setError
    );
  };

  // 컴포넌트 마운트 시 위치 정보 초기화
  useEffect(() => {
    initializeLocation();
  }, []);

  // 데이터 소스 변경 시 위치 정보 다시 초기화
  useEffect(() => {
    initializeLocation();
  }, [useMockData]);

  // 주기 정보 전송 시작
  const startTracking = () => {
    // 기존 추적 중지
    stopTracking();
    
    // 통계, 패킷 기록, 버퍼 초기화
    totalDistanceRef.current = 0;
    packetsCountRef.current = 0;
    gpsBuffer.reset();

    // 추적 상태 업데이트
    setTrackingState(prev => ({
      ...prev,
      isTracking: true,
      error: null,
      positionHistory: [],
      stats: {
        packetsCount: 0,
        totalDistance: 0,
        avgSpeed: 0,
        bufferSize: 0,
      }
    }));
    
    if (useMockData) {
      // Use mock data for tracking
      mockStartTimeRef.current = Date.now();
      startMockTracking();
    } else {
      // Use real geolocation API
      startRealTracking();
    }
  };


  // 실제 위치 추적 시작
  const startRealTracking = () => {
    if ("geolocation" in navigator) {
      try {
        // watchPosition 대신 1초마다 직접 위치 확인 로직 구현
        timerRef.current = setInterval(() => {
          try {
            navigator.geolocation.getCurrentPosition(
              handlePositionUpdate,
              (error) => {
                // 에러가 발생해도 타이머는 계속 유지
                handlePositionError(error);
                console.warn(`⚠️ [${new Date().toLocaleTimeString()}] 위치 정보 요청 실패. 다음 요청 계속 진행...`);
              },
              {
                enableHighAccuracy: true,
                timeout: 5000, // 타임아웃 시간을 줄여 응답성 향상
                maximumAge: 0, // 항상 새로운 위치 정보 요청
              }
            );
          } catch (error) {
            console.error(`❌ [${new Date().toLocaleTimeString()}] getCurrentPosition 호출 실패:`, error);
            // 에러가 발생해도 타이머는 계속 유지
          }
        }, POLLING_INTERVAL);
        
        console.log(`🔄 [${new Date().toLocaleTimeString()}] 실시간 위치 추적 시작 (간격: ${POLLING_INTERVAL}ms)`);
      } catch (error) {
        setTrackingState(prev => ({
          ...prev,
          isTracking: false,
          error: "트래킹 시작 실패: " + (error as Error).message,
        }));
      }
    } else {
      setTrackingState(prev => ({
        ...prev,
        isTracking: false,
        error: "이 브라우저에서는 위치 정보가 지원되지 않습니다",
      }));
    }
  };

  const startMockTracking = () => {
    // Set initial position from mock data
    const initialPosition = mockGpsData.getCurrentPositionFromMockData(
      mockDataRef.current,
      mockStartTimeRef.current
    );
    
    if (initialPosition) {
      handlePositionUpdate(initialPosition);
    }
    
    // Start polling for mock position updates
    timerRef.current = setInterval(() => {
      const currentPosition = mockGpsData.getCurrentPositionFromMockData(
        mockDataRef.current,
        mockStartTimeRef.current
      );
      
      if (currentPosition) {
        handlePositionUpdate(currentPosition);
      } else {
        // End of route
        stopTracking();
      }
    }, POLLING_INTERVAL);
  };

  const stopTracking = () => {
    // Clear real tracking
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    // Clear tracking timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      console.log(`⏹️ [${new Date().toLocaleTimeString()}] 위치 추적 타이머 중지됨`);
    }
    
    // 마지막으로 버퍼에 남아있는 데이터 전송
    if (gpsBuffer.getBufferSize() > 0) {
      console.log(`📤 [${new Date().toLocaleTimeString()}] 추적 중지 시 버퍼에 남은 ${gpsBuffer.getBufferSize()}개의 데이터 전송 시도...`);
      
      // 비동기 함수이지만 UI 업데이트를 위해 동기적으로 처리
      gpsBuffer.sendData()
        .then(success => {
          if (success) {
            console.log(`✅ [${new Date().toLocaleTimeString()}] 추적 중지 시 데이터 전송 성공`);
          } else {
            console.log(`⚠️ [${new Date().toLocaleTimeString()}] 추적 중지 시 데이터 전송 실패 또는 버퍼가 비어있음`);
          }
          
          // 통계 UI 업데이트 (비동기 작업 후 최신 상태 반영)
          setTrackingState(prev => ({
            ...prev,
            isTracking: false,
            stats: {
              ...prev.stats,
              packetsCount: gpsBuffer.getTotalPacketsCount(),
              bufferSize: gpsBuffer.getBufferSize(),
            }
          }));
        })
        .catch(error => {
          console.error(`❌ [${new Date().toLocaleTimeString()}] 추적 중지 시 데이터 전송 중 오류:`, error);
          
          // 오류가 발생해도 UI는 업데이트
          setTrackingState(prev => ({
            ...prev,
            isTracking: false,
            stats: {
              ...prev.stats,
              packetsCount: gpsBuffer.getTotalPacketsCount(),
              bufferSize: gpsBuffer.getBufferSize(),
            }
          }));
        });
    } else {
      // 버퍼가 비어있으면 바로 상태 업데이트
      setTrackingState(prev => ({
        ...prev,
        isTracking: false,
      }));
    }
  };

  // 위치 업데이트 핸들러 (실제 및 모의 데이터 모두 적용)
  const handlePositionUpdate = (position: GeolocationPosition) => {
    // 새 GPS 데이터를 버퍼에 추가 (주기별로 cList에 포함될 데이터)
    gpsBuffer.addPosition(position);
    
    setTrackingState(prev => {
      // 이전 위치와 비교하여 이동 거리 계산
      let distance = 0;
      if (prev.currentPosition) {
        distance = calculateDistance(prev.currentPosition, position);
        totalDistanceRef.current += distance;
      }
      
      // 이력에 현재 위치 추가
      const updatedHistory = [...prev.positionHistory, position];
      
      // 최근 위치 기반으로 평균 속도 계산 (최근 10개 포인트)
      const recentPositions = updatedHistory.slice(-10);
      let avgSpeed = 0;
      
      if (recentPositions.length > 1) {
        const speedSum = recentPositions
          .filter(pos => pos.coords.speed !== null && pos.coords.speed !== undefined)
          .reduce((sum, pos) => sum + (pos.coords.speed || 0), 0);
        
        const speedCount = recentPositions
          .filter(pos => pos.coords.speed !== null && pos.coords.speed !== undefined)
          .length;
          
        avgSpeed = speedCount > 0 ? speedSum / speedCount : 0;
      }
      
      // 새 위치 정보 로깅 - 초당 수집 확인용
      console.log(`🛣️ 위치 데이터 수집: 위도=${position.coords.latitude.toFixed(6)}, 경도=${position.coords.longitude.toFixed(6)}, 속도=${position.coords.speed || 0}m/s, 버퍼=${gpsBuffer.getBufferSize()}`);
      
      return {
        ...prev,
        currentPosition: position,
        previousPosition: prev.currentPosition,
        positionHistory: updatedHistory,
        error: null,
        stats: {
          packetsCount: gpsBuffer.getTotalPacketsCount(),
          totalDistance: parseFloat(totalDistanceRef.current.toFixed(1)),
          avgSpeed: parseFloat(avgSpeed.toFixed(1)),
          bufferSize: gpsBuffer.getBufferSize(),
        }
      };
    });
  };

  // 버퍼 및 패킷 카운트 업데이트
  useEffect(() => {
    if (!trackingState.isTracking) return;

    const bufferTimer = setInterval(() => {
      setTrackingState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          packetsCount: gpsBuffer.getTotalPacketsCount(),
          bufferSize: gpsBuffer.getBufferSize(),
        }
      }));
    }, 1000);

    return () => clearInterval(bufferTimer);
  }, [trackingState.isTracking]);

  // 위치 에러 핸들러
  const handlePositionError = (error: GeolocationPositionError) => {
    // 오류 코드에 따른 상세 메시지
    let errorMessage = "알 수 없는 위치 정보 오류";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "사용자가 위치 정보 접근을 거부했습니다";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "위치 정보를 사용할 수 없습니다";
        break;
      case error.TIMEOUT:
        errorMessage = "위치 정보 요청 시간이 초과되었습니다";
        break;
    }
    
    console.warn(`⚠️ [${new Date().toLocaleTimeString()}] ${errorMessage} (${error.code})`);
    
    // 에러 상태 업데이트 (이전 에러와 다를 경우에만)
    setTrackingState(prev => {
      if (prev.error !== errorMessage) {
        return {
          ...prev,
          error: errorMessage,
        };
      }
      return prev;
    });
  };

  // 주기 변경 핸들러
  const handleIntervalChange = (value: number) => {
    setPacketInterval(value);
    gpsBuffer.setInterval(value);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  // 데이터 소스 토글
  const toggleDataSource = () => {
    setUseMockData(prev => !prev);
  };

  // 시동 ON 함수
  const handleEngineOn = async () => {
    if (!trackingState.currentPosition) {
      showToast("위치 정보가 없습니다. 위치 정보를 먼저 가져와 주세요.");
      return;
    }
    
    try {
      // emulatorUtils에서 제공하는 함수를 사용하여 요청 객체 생성
      const engineRequest = createEngineOnRequest(trackingState.currentPosition);
      
      // 시동 ON 시간 상태 저장
      setOnTime(engineRequest.onTime);
      
      // 엔진 ON API 요청
      const response = await hubApiService.sendEngineOn(engineRequest);
      
      console.log("시동 ON 요청 성공:", response);
      showToast("시동 ON 요청이 성공적으로 전송되었습니다.");
      
      // 엔진 상태 변경
      setTrackingState((prev) => ({
        ...prev,
        engineOn: true
      }));
    } catch (error) {
      console.error("시동 ON 요청 실패:", error);
      showToast("시동 ON 요청에 실패했습니다.");
    }
  };
  
  // 시동 OFF 함수
  const handleEngineOff = async () => {
    if (!trackingState.currentPosition) {
      showToast("위치 정보가 없습니다. 위치 정보를 먼저 가져와 주세요.");
      return;
    }
    
    try {
      console.log(`🔄 [${new Date().toLocaleTimeString()}] 시동 OFF 요청 시작 - 버퍼에 남은 GPS 데이터 전송 중...`);
      
      // 버퍼에 남아있는 모든 GPS 데이터 즉시 전송
      if (gpsBuffer.getBufferSize() > 0) {
        // reset 함수의 첫 번째 인자를 true로 설정하여 남은 데이터 모두 전송
        await gpsBuffer.reset(true);
        
        // 버퍼와 패킷 카운트 정보 업데이트
        setTrackingState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            packetsCount: gpsBuffer.getTotalPacketsCount(),
            bufferSize: gpsBuffer.getBufferSize(), // 버퍼가 비워졌으므로 0이 될 것
          }
        }));
        
        console.log(`✅ [${new Date().toLocaleTimeString()}] 버퍼에 남은 모든 GPS 데이터 전송 완료, 버퍼: ${gpsBuffer.getBufferSize()}, 패킷: ${gpsBuffer.getTotalPacketsCount()}`);
      }
      
      // 추적 중이면 추적 중지
      if (trackingState.isTracking) {
        stopTracking();
      }
      
      // emulatorUtils에서 제공하는 함수를 사용하여 요청 객체 생성
      const engineRequest = createEngineOffRequest(
        trackingState.currentPosition,
        onTime,
        trackingState.totalDistance
      );
      
      // 엔진 OFF API 요청
      const response = await hubApiService.sendEngineOff(engineRequest);
      
      console.log(`✅ [${new Date().toLocaleTimeString()}] 시동 OFF 요청 성공:`, response);
      showToast("시동 OFF 요청이 성공적으로 전송되었습니다.");
      
      // 엔진 상태, 총 거리 초기화하되 패킷 카운트는 유지
      setTrackingState((prev) => ({
        ...prev,
        engineOn: false,
        totalDistance: 0,
        // 최종 통계 업데이트 보장
        stats: {
          ...prev.stats,
          packetsCount: gpsBuffer.getTotalPacketsCount(),
          bufferSize: gpsBuffer.getBufferSize(),
        }
      }));
    } catch (error) {
      console.error(`❌ [${new Date().toLocaleTimeString()}] 시동 OFF 요청 실패:`, error);
      showToast("시동 OFF 요청에 실패했습니다.");
      
      // 오류가 발생해도 UI 상태는 업데이트
      setTrackingState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          packetsCount: gpsBuffer.getTotalPacketsCount(),
          bufferSize: gpsBuffer.getBufferSize(),
        }
      }));
    }
  };

  // 상단에 추가할 함수
  const formatTimeToYYYYMMDDHHMM = (timestamp: number): string => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}`;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-screen-xl py-4 md:py-8">
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/50 border-none shadow-xl">
        <CardHeader className="border-b bg-card/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                <CarIcon /> 차량 GPS 에뮬레이터
              </CardTitle>
              <CardDescription className="text-sm">
                {useMockData 
                  ? "미왕빌딩에서 일산 행신동까지 경로 시뮬레이션" 
                  : "실시간 차량 위치 정보 수집 및 전송 시스템"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={trackingState.isTracking ? "default" : "secondary"} 
                className="px-3 py-1.5 text-sm font-medium shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  {trackingState.isTracking ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      활성 상태
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400"></span>
                      </span>
                      대기 상태
                    </>
                  )}
                </div>
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5 h-9 px-3 border-border shadow-sm"
                onClick={() => {
                  // 모든 상태 초기화
                  stopTracking();
                  totalDistanceRef.current = 0;
                  packetsCountRef.current = 0;
                  gpsBuffer.reset();
                  
                  setTrackingState({
                    isTracking: false,
                    currentPosition: null,
                    previousPosition: null,
                    positionHistory: [],
                    error: null,
                    engineOn: false,
                    totalDistance: 0,
                    stats: {
                      packetsCount: 0,
                      totalDistance: 0,
                      avgSpeed: 0,
                      bufferSize: 0,
                    }
                  });

                  // 모의 데이터 초기화
                  if (useMockData) {
                    mockDataRef.current = mockGpsData.createMockRouteData(2, 15);
                    mockStartTimeRef.current = 0;
                  }
                  
                  // 위치 초기화
                  initializeLocation();
                  
                  showToast("에뮬레이터가 초기화 되었습니다.");
                }}
                disabled={trackingState.engineOn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 9.00001C19.9828 7.56329 19.1209 6.28161 17.9845 5.27419C16.848 4.26678 15.4745 3.56506 13.9917 3.24053C12.5089 2.916 10.9652 2.98326 9.51894 3.43398C8.0727 3.8847 6.76895 4.70081 5.76001 5.80001L1 10M23 14L18.24 18.2C17.2311 19.2992 15.9273 20.1153 14.4811 20.566C13.0349 21.0168 11.4911 21.084 10.0083 20.7595C8.52547 20.435 7.15198 19.7333 6.01553 18.7258C4.87907 17.7184 4.01718 16.4367 3.51001 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                초기화
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <div className="md:grid md:grid-cols-12 md:gap-6">
          {/* 왼쪽 패널: 컨트롤 및 데이터 */}
          <div className="md:col-span-5 lg:col-span-4">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-6">
                {/* 상태 지표 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 gap-3">
                  <StatCard title="총 거리" value={trackingState.stats.totalDistance.toFixed(1)} unit="m" />
                  <StatCard title="평균 속도" value={Math.round(trackingState.stats.avgSpeed)} unit="m/s" />
                  <StatCard title="전송 패킷" value={trackingState.stats.packetsCount} />
                  <StatCard 
                    title="버퍼" 
                    value={trackingState.stats.bufferSize}
                  />
                </div>
                
                {/* 전송 주기 설정 */}
                <EmulatorSettings 
                  interval={packetInterval}
                  onIntervalChange={handleIntervalChange}
                  isTracking={trackingState.isTracking}
                />
                
                {/* 시동 ON/OFF */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="flex-1"
                    onClick={handleEngineOn} 
                    variant="default"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    시동 ON
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleEngineOff} 
                    variant="destructive"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M16 6H6L4 10M16 6H18L20 10M16 6V4M6 6V4M4 10H20M4 10V17C4 17.5523 4.44772 18 5 18H6C6.55228 18 7 17.5523 7 17V16H17V17C17 17.5523 17.4477 18 18 18H19C19.5523 18 20 17.5523 20 17V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    시동 OFF
                  </Button>
                </div>
                
                {/* 주기정보 전송 시작/중지 버튼 */}
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full text-sm md:text-base py-5 sm:py-6"
                    onClick={startTracking} 
                    disabled={trackingState.isTracking}
                    variant="outline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 8L16 12L10 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    주기정보 전송 시작
                  </Button>
                  <Button 
                    className="w-full text-sm md:text-base py-5 sm:py-6"
                    onClick={stopTracking} 
                    disabled={!trackingState.isTracking}
                    variant="outline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 flex-shrink-0">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    주기정보 전송 중지
                  </Button>
                </div>
                
                {/* 데이터 소스 토글 */}
                <Button 
                  onClick={toggleDataSource} 
                  variant="outline" 
                  className="w-full"
                  disabled={trackingState.isTracking}
                >
                  <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {useMockData ? "실제 위치 사용" : "모의 데이터 사용"}
                </Button>
                
                {/* 에러 메시지 */}
                {trackingState.error && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-md p-3 text-sm">
                    <p className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      {trackingState.error}
                    </p>
                    {trackingState.isTracking && (
                      <p className="mt-2 text-xs flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        위치 정보 에러가 발생했지만, 데이터 수집 및 전송은 계속 진행됩니다. 다음 요청에서 위치 정보를 다시 가져옵니다.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            
            {/* 위치 정보 */}
            {trackingState.currentPosition && (
              <CardContent className="border-t p-4 md:p-6 border-border/20">
                <h3 className="text-lg font-medium mb-3">현재 위치 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">위도</span>
                    <span className="font-mono">{trackingState.currentPosition.coords.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">경도</span>
                    <span className="font-mono">{trackingState.currentPosition.coords.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">고도</span>
                    <span className="font-mono">
                      {trackingState.currentPosition.coords.altitude 
                        ? `${trackingState.currentPosition.coords.altitude.toFixed(2)} m` 
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">속도</span>
                    <span className="font-mono">
                      {trackingState.currentPosition.coords.speed !== null
                        ? `${(trackingState.currentPosition.coords.speed * 3.6).toFixed(1)} km/h`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">방향</span>
                    <span className="font-mono">
                      {trackingState.currentPosition.coords.heading !== null
                        ? `${trackingState.currentPosition.coords.heading.toFixed(1)}°`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">정확도</span>
                    <span className="font-mono">{trackingState.currentPosition.coords.accuracy.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">시간</span>
                    <span className="font-mono">{formatTimeToYYYYMMDDHHMM(trackingState.currentPosition.timestamp)}</span>
                  </div>
                </div>
              </CardContent>
            )}
          </div>
            
          {/* 오른쪽 패널: 시각화 */}
          <div className="md:col-span-7 lg:col-span-8 border-t md:border-t-0 md:border-l border-border/20">
            <CardContent className="h-full p-4 md:p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="map">지도 보기</TabsTrigger>
                  <TabsTrigger value="data">데이터 통계</TabsTrigger>
                </TabsList>
                
                <TabsContent value="map" className="mt-0">
                  {/* 지도 컴포넌트 */}
                  <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] relative rounded-lg overflow-hidden">
                    <GpsMap 
                      currentPosition={trackingState.currentPosition}
                      positionHistory={trackingState.positionHistory}
                      isTracking={trackingState.isTracking}
                      autoCenter={true}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="data" className="mt-0">
                  <div className="bg-card/30 backdrop-blur-sm rounded-lg h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">수집된 위치 데이터 (최근 10개)</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">전송 주기: {packetInterval}초</Badge>
                        <Badge variant="outline">버퍼: {trackingState.stats.bufferSize}개</Badge>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/40">
                            <th className="text-left pb-2 font-medium">순번</th>
                            <th className="text-left pb-2 font-medium">위도</th>
                            <th className="text-left pb-2 font-medium">경도</th>
                            <th className="text-left pb-2 font-medium">속도</th>
                            <th className="text-left pb-2 font-medium">시간</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trackingState.positionHistory.slice(-10).reverse().map((pos, idx) => (
                            <tr key={pos.timestamp} className="border-b border-border/10">
                              <td className="py-2">#{trackingState.positionHistory.length - idx}</td>
                              <td className="py-2 font-mono">{pos.coords.latitude.toFixed(6)}</td>
                              <td className="py-2 font-mono">{pos.coords.longitude.toFixed(6)}</td>
                              <td className="py-2 font-mono">
                                {pos.coords.speed !== null
                                  ? `${(pos.coords.speed * 3.6).toFixed(1)} km/h`
                                  : "N/A"}
                              </td>
                              <td className="py-2 font-mono">{formatTimeToYYYYMMDDHHMM(pos.timestamp)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {trackingState.positionHistory.length === 0 && (
                      <div className="text-center text-muted-foreground mt-8">
                        <p>위치 추적을 시작하면 데이터가 이곳에 표시됩니다.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </div>
        
        <CardFooter className="border-t border-border/20 bg-card/20 backdrop-blur-sm p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12L10 10M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              최근 업데이트: {trackingState.currentPosition ? formatTimeToYYYYMMDDHHMM(trackingState.currentPosition.timestamp) : '--:--:--'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">주기: {packetInterval}초</Badge>
            <Badge variant="outline" className="font-mono">위치 이력: {trackingState.positionHistory.length}개</Badge>
            <Badge variant="outline" className="font-mono">v1.2.0</Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
