import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icons in Leaflet
delete (Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealTimeMapProps {
  vehicles: { id: number, name: string, lat: number, lng: number }[];
}

function RealTimeMap({ vehicles }: RealTimeMapProps) {

  const customStyles = `
    .leaflet-container {
      z-index: 1;
    }
    
  `;

  return (
    <div className="relative w-full h-full">
      <style>{customStyles}</style>
      {/* Main Map */}
      <MapContainer
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
        {vehicles.map((vehicle) => (
          <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
            <Popup>{vehicle.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default RealTimeMap;