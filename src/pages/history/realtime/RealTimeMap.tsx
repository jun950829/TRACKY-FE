import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useSseStore } from '@/stores/useSseStore';

import {  
  calculateBounds, 
  createMapBounds, 
  createPathSegments,
  PathSegment,
  getPathColor,
} from '@/libs/utils/historyUtils';
import { createCarIcon, getLastSixtyPoints } from './RealTimeTemp';

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
function MapController({ currentPosition }: { currentPosition: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (currentPosition) {
      map.setView(currentPosition, 16, {
        animate: true,
        duration: 1
      });
    }
  }, [currentPosition, map]);

  return null;
}

function RealTimeMap({ selectedDriveId, isRefresh, setIsRefresh  }: RealTimeMapProps) {
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([]);
  const [replaySegments, setReplaySegments] = useState<PathSegment[]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [currentSegment, setCurrentSegment] = useState<PathSegment | null>(null);
  const [markerRotation, setMarkerRotation] = useState<number>(0);

  const gpsList = useSseStore((state) => state.gpsList);
  const mapRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
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

  // 뒤로가기 시 경로 삭제
  useEffect(() => {
    if(isRefresh == true) {

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      setPathSegments([]);
      setReplaySegments([]);
      setCurrentPosition(null);
      setCurrentSegment(null);
      isInitialLoadRef.current = true;
      lastProcessedIndexRef.current = -1;
      setIsRefresh(false); 
    }
  },[ isRefresh ])

  // GPS 데이터 변경 감지 및 처리
  useEffect(() => {
    if (!gpsList.length) return;

    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;

      // 마지막 60개를 제외한 데이터로 고정 경로 생성
      const fixedData = gpsList.slice(0, -60);
      const recentData = getLastSixtyPoints(gpsList);
      
      // 기존 경로 path segment 
      setPathSegments(createPathSegments(fixedData));
      lastProcessedIndexRef.current = gpsList.length - 61;
      console.log("before interval : ", lastProcessedIndexRef.current );
      
      // 마지막 60개 데이터를 실시간처럼 애니메이션
      if (recentData.length > 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
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
            setTimeout(() => {
              setReplaySegments(prev => [...prev, newSegment]);
              setCurrentSegment(null);
              currentIndex++;
              
              // 다음 세그먼트 애니메이션 시작
              if (currentIndex < recentData.length - 1) {
                animateNextSegment();
              } else {

                lastProcessedIndexRef.current += 60;
                console.log("after 60 interval : ", lastProcessedIndexRef.current );

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
      
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
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

          // 애니메이션이 끝나면 세그먼트를 replaySegments에 추가
          setTimeout(() => {
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
  }

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
        
        {/* Add MapController */}
        <MapController currentPosition={currentPosition} />
        
        {/* 고정 경로 */}
        {pathSegments.map((segment, index) => (
          <Polyline
            key={`fixed-${index}`}
            positions={segment.positions}
            color={segment.color}
            weight={4}
          >
            <Tooltip sticky>
              {segment.points[0] && formatTime(segment.points[0].oTime)}
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
              {segment.points[0] && formatTime(segment.points[0].oTime)}
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
              {currentSegment.points[0] && formatTime(currentSegment.points[0].oTime)}
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
              {currentSegment?.points[0] && formatTime(currentSegment.points[0].oTime)}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default RealTimeMap;