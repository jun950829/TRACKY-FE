import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { useSseStore } from '@/stores/useSseStore';

import { 
  GpsData, 
  calculateBounds, 
  createMapBounds, 
  createPathSegments,
  PathSegment
} from '@/libs/utils/historyUtils';
import { useEffect, useRef, useState } from 'react';

delete (Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealTimeMapProps {
  selectedDriveId: number | null;
}

function RealTimeMap({ selectedDriveId }: RealTimeMapProps) {
  const [pathSegments, setPathSegments] = useState<PathSegment[]>([]);
  const [replaySegments, setReplaySegments] = useState<PathSegment[]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);

  const gpsList = useSseStore((state) => state.gpsList);
  const mapRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1분 전 데이터와 최근 데이터 분리
  useEffect(() => {
    if (!gpsList.length) return;

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    // 1분 전 데이터와 최근 데이터 분리
    const oldData = gpsList.filter(point => new Date(point.oTime) <= oneMinuteAgo);
    const recentData = gpsList.filter(point => new Date(point.oTime) > oneMinuteAgo);

    // 1분 전 데이터로 고정 경로 생성
    setPathSegments(createPathSegments(oldData));

    // 최근 데이터로 애니메이션 경로 초기화
    setReplaySegments([]);
    setCurrentPosition(null);

    // 이전 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 최근 데이터가 있으면 애니메이션 시작
    if (recentData.length > 0) {
      let currentIndex = 0;
      
      intervalRef.current = setInterval(() => {
        if (currentIndex < recentData.length - 1) {
          const currentPoint = recentData[currentIndex];
          const nextPoint = recentData[currentIndex + 1];
          
          // 현재 위치 업데이트
          setCurrentPosition([
            currentPoint.lat / 1_000_000,
            currentPoint.lon / 1_000_000
          ]);

          // 새로운 세그먼트 추가
          setReplaySegments(prev => [...prev, {
            positions: [
              [currentPoint.lat / 1_000_000, currentPoint.lon / 1_000_000],
              [nextPoint.lat / 1_000_000, nextPoint.lon / 1_000_000]
            ],
            color: '#3388ff',
            points: [currentPoint, nextPoint]
          }]);

          currentIndex++;
        } else {
          // 애니메이션 종료
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 1000); // 1초마다 업데이트
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gpsList]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        ref={mapRef}
        center={[37.5665, 126.9780]}
        zoom={13}
        minZoom={7}
        maxZoom={13}
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
        
        {/* 1분 전 고정 경로 */}
        {pathSegments.map((segment, index) => (
          <Polyline
            key={`fixed-${index}`}
            positions={segment.positions}
            color={segment.color}
            weight={4}
          />
        ))}

        {/* 실시간 애니메이션 경로 */}
        {replaySegments.map((segment, index) => (
          <Polyline
            key={`replay-${index}`}
            positions={segment.positions}
            color={segment.color}
            weight={4}
          />
        ))}

        {/* 현재 위치 마커 */}
        {currentPosition && (
          <Marker position={currentPosition} />
        )}
      </MapContainer>
    </div>
  );
}

export default RealTimeMap;