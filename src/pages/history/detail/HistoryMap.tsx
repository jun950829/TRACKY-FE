import React, { useEffect, useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import MapView from '../components/MapView';
import {
  GpsData,
  calculateBounds,
  createMapBounds,
  createPathSegments,
  PathSegment,
} from '@/libs/utils/historyUtils';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

if (typeof window !== 'undefined') {
  L.Marker.prototype.options.icon = DefaultIcon;
}

interface HistoryMapProps {
  gpsDataList: GpsData[];
  height?: string;
  driveId?: string;
  startPoint: {
    lat: number;
    lon: number;
    spd: number;
    o_time: string;
  };
  endPoint: {
    lat: number;
    lon: number;
    spd: number;
    o_time: string;
  };
}

export const downsample = (data: GpsData[], step: number = 10): GpsData[] => {
  return data.filter((_, index) => index % step === 0);
};

const HistoryMap: React.FC<HistoryMapProps> = ({
  gpsDataList,
  startPoint,
  endPoint,
  height = '400px',
  driveId = '',
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isPathRendering, setIsPathRendering] = useState(true);

  useEffect(() => {
    setMapLoaded(typeof window !== 'undefined');
  }, []);

  const sampledData = useMemo(() => downsample(gpsDataList, 5), [gpsDataList]);

  const firstPoint = sampledData[0] || startPoint;
  const lastPoint = sampledData[sampledData.length - 1] || endPoint;

  const center: [number, number] = [
    (firstPoint.lat + lastPoint.lat) / 2 / 1_000_000,
    (firstPoint.lon + lastPoint.lon) / 2 / 1_000_000,
  ];

  const bounds = useMemo(() => calculateBounds(sampledData.length > 0 ? sampledData : [startPoint, endPoint]), [sampledData]);
  const mapBounds = useMemo(() => createMapBounds(bounds), [bounds]);
  const pathSegments = useMemo(() => createPathSegments(sampledData), [sampledData]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatSpeed = (speed: number) => {
    return `${(speed / 1000).toFixed(1)} km/h`;
  };

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

  return (
    <>
      {mapLoaded ? (
        <div style={{ height: "300px", width: '100%', position: 'relative' }}>
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
            zoom={7}
            minZoom={6}
            maxZoom={18}
            maxBounds={[[33.0, 124.0], [39.5, 132.0]]}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
            whenReady={() => {
              setTimeout(() => {
                setIsPathRendering(false);
              }, 100);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker position={[firstPoint.lat / 1_000_000, firstPoint.lon / 1_000_000]}>
              <Popup>출발: {new Date(firstPoint.o_time).toLocaleString()}</Popup>
            </Marker>

            <Marker position={[lastPoint.lat / 1_000_000, lastPoint.lon / 1_000_000]}>
              <Popup>도착: {new Date(lastPoint.o_time).toLocaleString()}</Popup>
            </Marker>

            {pathSegments.map((segment: PathSegment, i: number) => (
              <Polyline key={i} positions={segment.positions} color={segment.color} weight={4}>
                {segment.points.map((point: GpsData, j: number) => {
                  if (j % 10 !== 0) return null; // 🧠 샘플링 렌더링
                  return (
                    <Tooltip
                      key={`${i}-${j}`}
                      position={[point.lat / 1_000_000, point.lon / 1_000_000]}
                      direction="top"
                      offset={[0, -10]}
                      permanent={false}
                      className="custom-tooltip"
                    >
                      <div className="text-xs">
                        <div>시간: {formatTime(point.o_time)}</div>
                        <div>속도: {formatSpeed(point.spd)}</div>
                      </div>
                    </Tooltip>
                  );
                })}
              </Polyline>
            ))}

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
