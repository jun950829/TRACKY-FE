import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapViewProps {
  bounds: L.LatLngBounds;
}

const MapView: React.FC<MapViewProps> = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    // 경로가 모두 보이도록 bounds에 맞춤
    map.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 16 // 최대 줌 레벨 제한
    });
  }, [map, bounds]);
  
  return null;
};

export default MapView; 