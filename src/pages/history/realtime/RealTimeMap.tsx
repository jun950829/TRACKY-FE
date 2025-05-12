import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import { useSseStore } from '@/stores/useSseStore';

import {  
  calculateBounds, 
  createMapBounds, 
  createPathSegments,
  PathSegment,
  getPathColor,
} from '@/libs/utils/historyUtils';
import { getLastSixtyPoints } from './RealTimeTemp';

import { useEffect, useRef, useState } from 'react';
import { interpolatePosition } from './RealTimeTemp';
import { GpsData } from '@/constants/types/historyTypes';

delete (Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealTimeMapProps {
  selectedDriveId: number | null;
  isRefresh: boolean;
  setIsRefresh: (isRefresh: boolean) => void;
}

// Add MapController component
function MapController({ currentPosition, isTracking }: { currentPosition: [number, number] | null; isTracking: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (currentPosition && isTracking) {
      map.setView(currentPosition, 16, {
        animate: true,
        duration: 1
      });
    }
  }, [currentPosition, map, isTracking]);

  return null;
}

// Add car icon creation function
const createCarIcon = (rotation: number) => {
  return divIcon({
    className: 'custom-car-icon',
    html: `
      <div style="
        transform: rotate(${rotation + 90}deg);
        width: 32px;
        height: 32px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
      ">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 차체 -->
          <path d="M4 12H20C21.1046 12 22 12.8954 22 14V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V14C2 12.8954 2.89543 12 4 12Z" 
            fill="#4A90E2" 
            stroke="white" 
            stroke-width="1.5"
          />
          <!-- 지붕 -->
          <path d="M6 12L7.5 8H16.5L18 12" 
            fill="#4A90E2" 
            stroke="white" 
            stroke-width="1.5"
          />
          <!-- 앞유리 -->
          <path d="M7.5 8L9 12" 
            stroke="white" 
            stroke-width="1.5"
            fill="none"
          />
          <!-- 뒷유리 -->
          <path d="M16.5 8L15 12" 
            stroke="white" 
            stroke-width="1.5"
            fill="none"
          />
          <!-- 앞바퀴 -->
          <circle cx="7" cy="16" r="2" 
            fill="#2C3E50" 
            stroke="white" 
            stroke-width="1"
          />
          <!-- 뒷바퀴 -->
          <circle cx="17" cy="16" r="2" 
            fill="#2C3E50" 
            stroke="white" 
            stroke-width="1"
          />
          <!-- 헤드라이트 -->
          <path d="M4 14H6" 
            stroke="white" 
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <!-- 후미등 -->
          <path d="M18 14H20" 
            stroke="white" 
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function RealTimeMap({ selectedDriveId, isRefresh, setIsRefresh  }: RealTimeMapProps) {
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([]);
  const [replaySegments, setReplaySegments] = useState<PathSegment[]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [currentSegment, setCurrentSegment] = useState<PathSegment | null>(null);
  const [markerRotation, setMarkerRotation] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(true);

  const gpsList = useSseStore((state) => state.gpsList);
  const mapRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedIndexRef = useRef<number>(-1);
  const startTimeRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  // 애니메이션 프레임 업데이트
  const updateAnimation = (startPoint: GpsData, endPoint: GpsData, startTime: number) => {
    const now = performance.now();
    const elapsed = now - startTime;
    const duration = 1000; // 1초
    const progress = Math.min(elapsed / duration, 1);

    const startPos: [number, number] = [
      startPoint.lat / 1_000_000,
      startPoint.lon / 1_000_000
    ];
    const endPos: [number, number] = [
      endPoint.lat / 1_000_000,
      endPoint.lon / 1_000_000
    ];

    const currentPos = interpolatePosition(startPos, endPos, progress);
    setCurrentPosition(currentPos);

    // Calculate rotation angle based on movement direction
    const angle = Math.atan2(
      endPos[1] - startPos[1],
      endPos[0] - startPos[0]
    ) * (180 / Math.PI);
    setMarkerRotation(angle);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(() => updateAnimation(startPoint, endPoint, startTime));
    }
  };

  // 뒤로가기 시 모든 상태 초기화
  useEffect(() => {
    if (isRefresh) {
      // 모든 타이머와 애니메이션 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // SSE 구독 해제
      useSseStore.getState().resetSse();

      // 모든 상태 초기화
      setPathSegments([]);
      setReplaySegments([]);
      setCurrentPosition(null);
      setCurrentSegment(null);
      setMarkerRotation(0);

      // ref 값들 초기화
      isInitialLoadRef.current = true;
      lastProcessedIndexRef.current = -1;
      startTimeRef.current = 0;

      // 지도 뷰 초기화
      if (mapRef.current) {
        mapRef.current.setView([37.5665, 126.9780], 13, {
          animate: true,
          duration: 1
        });
      }

      setIsRefresh(false);
    }
  }, [isRefresh, setIsRefresh]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // GPS 데이터 변경 감지 및 처리
  useEffect(() => {
    if (!gpsList.length) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;

      // 마지막 60개를 제외한 데이터로 고정 경로 생성
      const fixedData = gpsList.slice(0, -59);
      const recentData = getLastSixtyPoints(gpsList);
      // 기존 경로 path segment 
      setPathSegments(createPathSegments(fixedData));
      lastProcessedIndexRef.current = gpsList.length - 61;
      
      // 마지막 60개 데이터를 실시간처럼 애니메이션
      if (recentData.length > 0) {
        // 기존 타이머와 애니메이션 정리
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        let currentIndex = 0;
        const animateNextSegment = () => {
          if (currentIndex < recentData.length - 1) {
            const currentPoint = recentData[currentIndex];
            const nextPoint = recentData[currentIndex + 1];
            
            // 새로운 세그먼트 추가 (속도에 따른 색상 적용)
            const avgSpeed = (currentPoint.spd + nextPoint.spd) / 2;
            const newSegment: PathSegment = {
              positions: [
                [currentPoint.lat / 1_000_000, currentPoint.lon / 1_000_000] as [number, number],
                [nextPoint.lat / 1_000_000, nextPoint.lon / 1_000_000] as [number, number]
              ],
              color: getPathColor(avgSpeed),
              points: [currentPoint, nextPoint]
            };
            
            setCurrentSegment(newSegment);
            startTimeRef.current = performance.now();
            updateAnimation(currentPoint, nextPoint, startTimeRef.current);

            // 애니메이션이 끝나면 세그먼트를 replaySegments에 추가
            timeoutRef.current = setTimeout(() => {
              setReplaySegments(prev => [...prev, newSegment]);
              setCurrentSegment(null);
              currentIndex++;
              lastProcessedIndexRef.current++;
              
              // 다음 세그먼트 애니메이션 시작
              if (currentIndex < recentData.length - 1) {
                animateNextSegment();
              } else {
                // do Sse Cycle
                doSseCycle();
              }
            }, 1000);
          }
        };

        console.log("초기 인터벌 시작");
        animateNextSegment();
        isInitialLoadRef.current = false;
      }
    }
  }, [gpsList]);

  const doSseCycle = () => {
    console.log("lastProcessedIndexRef.current: ", lastProcessedIndexRef.current);
  
    const updatedGpsList = useSseStore.getState().gpsList;

    console.log("updatedGpsList: ", updatedGpsList);

    const newData = updatedGpsList.slice(lastProcessedIndexRef.current);

    console.log("newData : " ,newData );
      
    if (newData.length > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      let currentIndex = 0;
      const animateNextSegment = () => {

        if (currentIndex < newData.length - 1) {
          const currentPoint = newData[currentIndex];
          const nextPoint = newData[currentIndex + 1];
          
          // 새로운 세그먼트 추가 (속도에 따른 색상 적용)
          const avgSpeed = (currentPoint.spd + nextPoint.spd) / 2;
          const newSegment: PathSegment = {
            positions: [
              [currentPoint.lat / 1_000_000, currentPoint.lon / 1_000_000] as [number, number],
              [nextPoint.lat / 1_000_000, nextPoint.lon / 1_000_000] as [number, number]
            ],
            color: getPathColor(avgSpeed),
            points: [currentPoint, nextPoint]
          };
          
          setCurrentSegment(newSegment);
          startTimeRef.current = performance.now();
          updateAnimation(currentPoint, nextPoint, startTimeRef.current);

          timeoutRef.current = setTimeout(() => {
            setReplaySegments(prev => [...prev, newSegment]);
            setCurrentSegment(null);
            currentIndex++;
            lastProcessedIndexRef.current++;
            
            // 다음 세그먼트 애니메이션 시작
            if (currentIndex < newData.length - 1) {
              animateNextSegment();
            } else {
              console.log("다음 sse cycle")
              doSseCycle();
            }
          }, 1000);
        }
      };

      animateNextSegment();
    }
  };

  // 시간 포맷 함수 수정
  const formatTime = (oTime: string) => {
    // oTime 형식: 2025-05-11T21:19:26
    const date = new Date(oTime);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        ref={mapRef}
        center={[37.5665, 126.9780]}
        zoom={13}
        minZoom={7}
        maxZoom={18}
        maxBounds={[[33, 124], [39, 132]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Add MapController with isTracking prop */}
        <MapController currentPosition={currentPosition} isTracking={isTracking} />
        
        {/* 고정 경로 */}
        {pathSegments.map((segment, index) => (
          <Polyline
            key={`fixed-${index}`}
            positions={segment.positions}
            color={segment.color}
            weight={4}
          >
            <Tooltip sticky>
              {segment.points[0] && (
                <div>
                  <div>{formatTime(segment.points[0].oTime)}</div>
                  <div>속력: {segment.points[0].spd} km/h</div>
                </div>
              )}
            </Tooltip>
          </Polyline>
        ))}

        {/* 실시간 애니메이션 경로 */}
        {replaySegments.map((segment, index) => (
          <Polyline
            key={`replay-${index}`}
            positions={segment.positions}
            color={segment.color}
            weight={4}
          >
            <Tooltip sticky>
              {segment.points[0] && (
                <div>
                  <div>{formatTime(segment.points[0].oTime)}</div>
                  <div>속력: {segment.points[0].spd} km/h</div>
                </div>
              )}
            </Tooltip>
          </Polyline>
        ))}

        {/* 현재 진행 중인 세그먼트 */}
        {currentSegment && (
          <Polyline
            positions={currentSegment.positions}
            color={currentSegment.color}
            weight={4}
          >
            <Tooltip sticky>
              {currentSegment.points[0] && (
                <div>
                  <div>{formatTime(currentSegment.points[0].oTime)}</div>
                  <div>속력: {currentSegment.points[0].spd} km/h</div>
                </div>
              )}
            </Tooltip>
          </Polyline>
        )}

        {/* 현재 위치 마커 */}
        {currentPosition && (
          <Marker 
            position={currentPosition}
            icon={createCarIcon(markerRotation)}
          >
            <Tooltip sticky>
              {currentSegment?.points[0] && (
                <div>
                  <div>{formatTime(currentSegment.points[0].oTime)}</div>
                  <div>속력: {currentSegment.points[0].spd} km/h</div>
                </div>
              )}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>

      {/* Add tracking toggle button */}
      <button
        onClick={() => setIsTracking(!isTracking)}
        className="absolute bottom-4 left-4 z-[1000] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        title={isTracking ? "화면 추적 중지" : "화면 추적 시작"}
      >
        {isTracking ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default RealTimeMap;
