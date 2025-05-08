import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { useSseStore } from '@/stores/useSseStore';
import { useMemo } from 'react';

// Fix for default marker icons in Leaflet
delete (Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealTimeMapProps {
  //vehicles: { id: number, name: string, lat: number, lng: number }[];
  selectedDriveId: number | null;
}

function RealTimeMap({ selectedDriveId }: RealTimeMapProps) {

  const gpsList = useSseStore((state) => state.gpsList);

  const polyline: LatLngExpression[] = useMemo(
    () => gpsList.map((p) => [p.lat, p.lon] as LatLngExpression),
    [gpsList]
  );

  const latestPosition = polyline[polyline.length - 1];

  // const customStyles = `
  //   .leaflet-container {
  //     z-index: 1;
  //   }
    
  // `;

  return (
    <div className="relative w-full h-full">
      <style>{`.leaflet-container { z-index: 1; }`}</style>
      {/* Main Map */}
      <MapContainer
        center={latestPosition || [37.5665, 126.9780]}
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
        {/* 경로 그리기 */}
        {polyline.length > 1 && <Polyline positions={polyline} color="blue" weight={4} />}

        {/* 마커: 가장 최근 위치 */}
        {latestPosition && <Marker position={latestPosition} />}
      </MapContainer>
    </div>
  );
}

export default RealTimeMap;