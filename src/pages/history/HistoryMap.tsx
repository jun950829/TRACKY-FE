import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Leaflet 마커 아이콘 오류 수정
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 컴포넌트 임포트
import MapView from './components/MapView';

// 유틸리티 함수 임포트
import { 
  GpsData, 
  calculateBounds, 
  createMapBounds, 
  createPathSegments 
} from '@/libs/utils/historyUtils';

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

// 지도 컴포넌트 props 타입
interface HistoryMapProps {
  gpsDataList: GpsData[];
  height?: string;
  driveId?: string;
}

const HistoryMap: React.FC<HistoryMapProps> = ({ gpsDataList, height = '400px', driveId = '' }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isPathRendering, setIsPathRendering] = useState(true);
  
  useEffect(() => {
    // 브라우저 환경에서만 지도 렌더링
    setMapLoaded(typeof window !== 'undefined');
  }, []);
  
  // 경로가 없는 경우 처리
  if (!gpsDataList || gpsDataList.length === 0) {
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
  const firstPoint = gpsDataList[0];
  const lastPoint = gpsDataList[gpsDataList.length - 1];
  const center: [number, number] = [
    (firstPoint.lat + lastPoint.lat) / 2 / 1_000_000,
    (firstPoint.lon + lastPoint.lon) / 2 / 1_000_000
  ];

  // 경로의 전체 범위 계산 및 bounds 생성
  const bounds = calculateBounds(gpsDataList);
  const mapBounds = createMapBounds(bounds);
  
  // 경로 세그먼트 생성
  const pathSegments = createPathSegments(gpsDataList);
  
  return (
    <>
      {mapLoaded ? (
        <div style={{ height, width: '100%', position: 'relative' }}>
          {isPathRendering && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-white">경로 로딩 중...</p>
              </div>
            </div>
          )}
          <MapContainer
            key={driveId}
            center={center}
            zoom={12}
            style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
            whenReady={() => {
              // 지도가 준비되면 경로 렌더링 시작
              setTimeout(() => {
                setIsPathRendering(false);
              }, 100);
            }}
          >
            {/* 지도 타일 레이어 */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* 시작 마커 */}
            <Marker position={[firstPoint.lat / 1_000_000, firstPoint.lon / 1_000_000]}>
              <Popup>
                출발: {new Date(firstPoint.o_time).toLocaleString()}
              </Popup>
            </Marker>
            
            {/* 도착 마커 */}
            <Marker position={[lastPoint.lat / 1_000_000, lastPoint.lon / 1_000_000]}>
              <Popup>
                도착: {new Date(lastPoint.o_time).toLocaleString()}
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
            <MapView bounds={mapBounds} />
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