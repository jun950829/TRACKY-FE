import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Car, Navigation } from "lucide-react";
import L from "leaflet";

// Make sure to import leaflet CSS in your main CSS file or include:
// import 'leaflet/dist/leaflet.css';

// Define vehicle interface
interface Vehicle {
  mdn: string;
  carNumber: string;
  status: "운행중" | "정비중" | "대기중";
  location?: {
    lat: number;
    lng: number;
  };
  lastUpdated?: Date;
  driver?: string;
  km?: number;
}

interface VehicleMapProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

// Auto centering map component
function MapCenterUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position, map.getZoom());
  return null;
}

export default function VehicleMap({ vehicles, isLoading }: VehicleMapProps) {
  const [center] = useState<[number, number]>([37.5665, 126.9780]); // Seoul
  const mapRef = useRef<L.Map | null>(null);

  // Create custom marker icons
  const activeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const idleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const maintenanceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const getIcon = (status: string) => {
    switch (status) {
      case "운행중":
        return activeIcon;
      case "대기중":
        return idleIcon;
      case "정비중":
        return maintenanceIcon;
      default:
        return idleIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "운행중":
        return "text-green-600";
      case "대기중":
        return "text-blue-600";
      case "정비중":
        return "text-red-600";
      default:
        return "text-zinc-600";
    }
  };

  // Map zoom to fit all markers
  const zoomToMarkers = () => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    
    // Get all vehicle locations
    const points = vehicles
      .filter(v => v.location)
      .map(v => [v.location!.lat, v.location!.lng]);
    
    if (points.length === 0) return;
    
    // Create bounds and fit map to all markers
    const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])));
    map.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-white border-b border-zinc-100 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <span>차량 위치 지도</span>
        </CardTitle>
        <button 
          onClick={zoomToMarkers}
          className="text-xs bg-zinc-100 hover:bg-zinc-200 transition-colors rounded px-2 py-1 flex items-center gap-1"
        >
          <Car className="h-3 w-3" /> 모든 차량 보기
        </button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[400px] sm:h-[450px] bg-zinc-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-zinc-500">지도를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] sm:h-[450px]">
            <div 
              className="h-full w-full"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <MapContainer
                center={center}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
                ref={(map) => {
                  if (map) {
                    mapRef.current = map;
                    setTimeout(zoomToMarkers, 100);
                  }
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                {vehicles
                  .filter(vehicle => vehicle.location)
                  .map((vehicle) => (
                    <Marker
                      key={vehicle.mdn}
                      position={[vehicle.location!.lat, vehicle.location!.lng]}
                      icon={getIcon(vehicle.status)}
                    >
                      <Popup>
                        <div className="px-1 py-2">
                          <div className="font-medium text-sm mb-1">{vehicle.carNumber}</div>
                          <div className={`text-xs font-medium ${getStatusColor(vehicle.status)} mb-2`}>
                            {vehicle.status}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                            <span className="text-zinc-500">운전자:</span>
                            <span>{vehicle.driver || "미지정"}</span>
                            
                            <span className="text-zinc-500">MDN:</span>
                            <span>{vehicle.mdn}</span>
                            
                            <span className="text-zinc-500">운행거리:</span>
                            <span>{vehicle.km} km</span>
                            
                            <span className="text-zinc-500">최근 업데이트:</span>
                            <span>
                              {vehicle.lastUpdated 
                                ? vehicle.lastUpdated.toLocaleTimeString() 
                                : "정보 없음"}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                
                <MapCenterUpdater position={center} />
              </MapContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 