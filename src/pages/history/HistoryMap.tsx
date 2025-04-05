import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet 마커 아이콘 오류 수정
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet 기본 아이콘 설정
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Leaflet이 document 환경을 필요로 하므로 아이콘 설정을 클라이언트 사이드에서만 실행
if (typeof window !== 'undefined') {
  L.Marker.prototype.options.icon = DefaultIcon;
}

// MapView 요소 props 타입
interface MapViewProps {
  center: [number, number];
  zoom: number;
}

// 지도 뷰 설정 컴포넌트
const MapView: React.FC<MapViewProps> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// 지도 컴포넌트 props 타입
interface HistoryMapProps {
  points: { lat: number; lng: number; speed: number; timestamp: string }[];
  height?: string;
  tripId?: string; // 트립 ID 추가
}

const HistoryMap: React.FC<HistoryMapProps> = ({ points, height = '400px', tripId = '' }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // 브라우저 환경에서만 지도 렌더링
    setMapLoaded(typeof window !== 'undefined');
  }, []);
  
  // 경로가 없는 경우 처리
  if (!points || points.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded" 
        style={{ height }}
      >
        <p className="text-gray-500">경로 데이터가 없습니다</p>
      </div>
    );
  }
  
  // 지도 중심점 계산 (첫 번째와 마지막 포인트의 중간점)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const center: [number, number] = [
    (firstPoint.lat + lastPoint.lat) / 2,
    (firstPoint.lng + lastPoint.lng) / 2
  ];
  
  // 속도에 따른 경로 색상 계산
  const getPathColor = (speed: number) => {
    if (speed < 30) return '#3388ff'; // 천천히 - 파란색
    if (speed < 60) return '#33cc33'; // 보통 - 녹색
    if (speed < 90) return '#ffcc00'; // 빠름 - 노란색
    return '#ff3300';                 // 매우 빠름 - 빨간색
  };
  
  // 속도 별 경로 세그먼트 생성
  const pathSegments = [];
  for (let i = 0; i < points.length - 1; i++) {
    const avgSpeed = (points[i].speed + points[i+1].speed) / 2;
    pathSegments.push({
      positions: [
        [points[i].lat, points[i].lng] as [number, number],
        [points[i+1].lat, points[i+1].lng] as [number, number]
      ],
      color: getPathColor(avgSpeed)
    });
  }
  
  return (
    <>
      {mapLoaded ? (
        <div style={{ height, width: '100%' }}>
          {/* key를 tripId로 설정하여 트립이 변경될 때 지도 컴포넌트를 완전히 재생성하도록 함 */}
          <MapContainer
            key={tripId}
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
          >
            {/* 지도 타일 레이어 */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* 시작 마커 */}
            <Marker position={[firstPoint.lat, firstPoint.lng]}>
              <Popup>
                출발: {new Date(firstPoint.timestamp).toLocaleString()}
              </Popup>
            </Marker>
            
            {/* 도착 마커 */}
            <Marker position={[lastPoint.lat, lastPoint.lng]}>
              <Popup>
                도착: {new Date(lastPoint.timestamp).toLocaleString()}
              </Popup>
            </Marker>
            
            {/* 속도 별 경로 세그먼트 */}
            {pathSegments.map((segment, i) => (
              <Polyline 
                key={i}
                positions={segment.positions}
                color={segment.color}
                weight={4}
              />
            ))}
            
            {/* 지도 뷰 설정 */}
            <MapView center={center} zoom={12} />
          </MapContainer>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-100 rounded" 
          style={{ height }}
        >
          <p className="text-gray-500">지도 로딩 중...</p>
        </div>
      )}
    </>
  );
};

export default HistoryMap; 