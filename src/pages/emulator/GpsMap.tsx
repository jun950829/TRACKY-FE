import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 기본 Leaflet 아이콘에 대한 문제 해결 (기본 아이콘 이미지 경로 문제)
// 실제 배포 시에는 public 폴더에 이미지를 추가하고 경로를 설정해야 합니다
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// 차량 아이콘 커스텀
const carIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // 차량 아이콘 이미지로 변경 필요
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 맵 뷰를 현재 위치로 자동 이동시키는 컴포넌트
function MapCenterUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  
  return null;
}

interface GpsMapProps {
  positions: GeolocationPosition[];
  currentPosition: GeolocationPosition | null;
  isTracking: boolean;
}

function GpsMap({ positions, currentPosition, isTracking }: GpsMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // 경로 좌표 배열 생성
  const pathPositions: [number, number][] = positions.map(pos => 
    [pos.coords.latitude, pos.coords.longitude]
  );
  
  // 현재 위치가 변경되면 지도 중심 업데이트
  useEffect(() => {
    if (currentPosition && isTracking) {
      setMapCenter([currentPosition.coords.latitude, currentPosition.coords.longitude]);
    }
  }, [currentPosition, isTracking]);
  
  // 초기 맵 중심점 설정
  useEffect(() => {
    if (!mapCenter && currentPosition) {
      setMapCenter([currentPosition.coords.latitude, currentPosition.coords.longitude]);
    }
  }, [currentPosition, mapCenter]);
  
  if (!mapCenter) {
    return (
      <div className="bg-card/30 backdrop-blur-sm rounded-lg h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <svg className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>위치 정보를 가져오는 중...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-lg h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => { mapRef.current = map }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 경로 표시 */}
        {pathPositions.length > 1 && (
          <Polyline 
            positions={pathPositions} 
            color={isTracking ? "#3b82f6" : "#94a3b8"} 
            weight={3}
            dashArray={isTracking ? undefined : "5, 5"}
          />
        )}
        
        {/* 현재 위치 마커 */}
        {currentPosition && (
          <Marker 
            position={[currentPosition.coords.latitude, currentPosition.coords.longitude]}
            icon={carIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium">현재 위치</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(currentPosition.timestamp).toLocaleTimeString()}
                </p>
                <div className="grid grid-cols-2 gap-x-2 mt-2 text-xs">
                  <span className="text-muted-foreground">위도:</span>
                  <span>{currentPosition.coords.latitude.toFixed(6)}</span>
                  <span className="text-muted-foreground">경도:</span>
                  <span>{currentPosition.coords.longitude.toFixed(6)}</span>
                  <span className="text-muted-foreground">속도:</span>
                  <span>{currentPosition.coords.speed ? `${currentPosition.coords.speed.toFixed(1)} m/s` : 'N/A'}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* 맵 뷰 자동 업데이트 */}
        <MapCenterUpdater position={mapCenter} />
      </MapContainer>
    </div>
  );
}

export default GpsMap;