import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 차량 아이콘 커스텀 - 깔끔한 자동차 모양으로 변경
const carIcon = L.divIcon({
  html: `
    <div style="position: relative">
      <div style="position: absolute; top: -12px; left: -12px; transform-origin: center; transform: ${window.innerWidth < 768 ? 'scale(0.8)' : 'scale(1)'};">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.25));">
          <g>
            <path d="M23.917 9.333H4.083L2.333 14H25.667L23.917 9.333Z" fill="#1E1E1E" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 19.833C7 20.5704 6.40367 21.167 5.66667 21.167C4.92967 21.167 4.33333 20.5704 4.33333 19.833C4.33333 19.0957 4.92967 18.5 5.66667 18.5C6.40367 18.5 7 19.0957 7 19.833Z" fill="#1E1E1E" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23.6667 19.833C23.6667 20.5704 23.0704 21.167 22.3334 21.167C21.5964 21.167 21 20.5704 21 19.833C21 19.0957 21.5964 18.5 22.3334 18.5C23.0704 18.5 23.6667 19.0957 23.6667 19.833Z" fill="#1E1E1E" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25.6667 14V19.8333C25.6667 20.5703 25.0704 21.1667 24.3334 21.1667H22.3334" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66669 21.1667H3.66669C2.92969 21.1667 2.33335 20.5703 2.33335 19.8333V14" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 14H21V19.8333H7V14Z" fill="#000000" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.08334 9.33333L6.41667 4.66667H21.5833L23.9167 9.33333" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 9.33333V7H10.5V9.33333" stroke="#1E1E1E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
        <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: #000000; border-radius: 50%; opacity: 0.2; filter: blur(2px);"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// 움직이는 차량 아이콘 - 추적 중일 때 사용
const movingCarIcon = L.divIcon({
  html: `
    <div style="position: relative">
      <div style="position: absolute; top: -12px; left: -12px; transform-origin: center; transform: ${window.innerWidth < 768 ? 'scale(0.8)' : 'scale(1)'}; animation: pulse 1.5s infinite;">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.35));">
          <g>
            <path d="M23.917 9.333H4.083L2.333 14H25.667L23.917 9.333Z" fill="#0F172A" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 19.833C7 20.5704 6.40367 21.167 5.66667 21.167C4.92967 21.167 4.33333 20.5704 4.33333 19.833C4.33333 19.0957 4.92967 18.5 5.66667 18.5C6.40367 18.5 7 19.0957 7 19.833Z" fill="#0F172A" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23.6667 19.833C23.6667 20.5704 23.0704 21.167 22.3334 21.167C21.5964 21.167 21 20.5704 21 19.833C21 19.0957 21.5964 18.5 22.3334 18.5C23.0704 18.5 23.6667 19.0957 23.6667 19.833Z" fill="#0F172A" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M25.6667 14V19.8333C25.6667 20.5703 25.0704 21.1667 24.3334 21.1667H22.3334" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.66669 21.1667H3.66669C2.92969 21.1667 2.33335 20.5703 2.33335 19.8333V14" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 14H21V19.8333H7V14Z" fill="#000000" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4.08334 9.33333L6.41667 4.66667H21.5833L23.9167 9.33333" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17.5 9.33333V7H10.5V9.33333" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
        <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 16px; height: 6px; background: #000000; border-radius: 50%; opacity: 0.25; filter: blur(3px); animation: shadow-pulse 1.5s infinite alternate;"></div>
      </div>
    </div>
  `,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// 직전 포인트 아이콘 - 경로에서 이전 포인트 표시용
const historyPointIcon = L.divIcon({
  html: `
    <div style="width: 6px; height: 6px; background-color: #0F172A; border-radius: 50%; border: 1.5px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
  `,
  className: '',
  iconSize: [6, 6],
  iconAnchor: [3, 3],
});

// 맵 뷰를 현재 위치로 자동 이동시키는 컴포넌트
function MapCenterUpdater({ position, autoCenter }: { position: [number, number] | null, autoCenter: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (position && autoCenter) {
      map.setView(position, map.getZoom());
    }
  }, [position, map, autoCenter]);
  
  return null;
}

interface GpsMapProps {
  currentPosition: GeolocationPosition | null;
  positionHistory: GeolocationPosition[];
  isTracking: boolean;
  autoCenter?: boolean;
}

function GpsMap({ currentPosition, positionHistory, isTracking, autoCenter = true }: GpsMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  
  // CSS를 추가하여 애니메이션 정의
  useEffect(() => {
    // 이미 스타일이 있는지 확인
    if (!document.getElementById('map-marker-animations')) {
      const style = document.createElement('style');
      style.id = 'map-marker-animations';
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: ${window.innerWidth < 768 ? 'scale(0.8)' : 'scale(1)'}; }
          50% { transform: ${window.innerWidth < 768 ? 'scale(0.88)' : 'scale(1.08)'}; }
          100% { transform: ${window.innerWidth < 768 ? 'scale(0.8)' : 'scale(1)'}; }
        }
        @keyframes shadow-pulse {
          0% { opacity: 0.2; width: 16px; }
          100% { opacity: 0.4; width: 20px; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  // 경로 좌표 배열 생성
  const pathPositions: [number, number][] = positionHistory.map(pos => 
    [pos.coords.latitude, pos.coords.longitude]
  );
  
  // 현재 위치가 변경되면 지도 중심 업데이트
  useEffect(() => {
    if (currentPosition && isTracking && autoCenter) {
      setMapCenter([currentPosition.coords.latitude, currentPosition.coords.longitude]);
    }
  }, [currentPosition, isTracking, autoCenter]);
  
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
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
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* 경로 표시 */}
        {pathPositions.length > 1 && (
          <Polyline 
            pathOptions={{ 
              color: isTracking ? "#3b82f6" : "#94a3b8",
              weight: 3,
              dashArray: isTracking ? undefined : "5, 5"
            }} 
            positions={pathPositions} 
          />
        )}
        
        {/* 경로 중간 포인트 표시 (최근 5개 중 첫 4개만) */}
        {pathPositions.length > 2 && pathPositions.slice(-5, -1).map((position, index) => (
          <Marker
            key={`history-${index}`}
            position={position}
            icon={historyPointIcon}
            zIndexOffset={100 + index}
          />
        ))}
        
        {/* 현재 위치 마커 */}
        {currentPosition && (
          <Marker 
            position={[currentPosition.coords.latitude, currentPosition.coords.longitude]}
            icon={isTracking ? movingCarIcon : carIcon}
            zIndexOffset={1000}
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
        <MapCenterUpdater position={mapCenter} autoCenter={autoCenter} />
      </MapContainer>
    </div>
  );
}

export default GpsMap; 