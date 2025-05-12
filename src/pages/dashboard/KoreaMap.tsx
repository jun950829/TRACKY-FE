// src/components/KoreaMap.tsx

import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { dashboardApi } from "@/libs/apis/dashboardApi";
import { use } from "chai";

interface RegionData {
  [key: string]: number;
}

export default function KoreaMap() {
  const [geoData, setGeoData] = useState<any>(null);
  const [regionData, setRegionData] = useState<RegionData>({});

  // GeoJSON 불러오기
  useEffect(() => {
    fetch("/geojson/korea-provinces.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  useEffect(() => {
    dashboardApi.getGeo()
    .then((res) => {
      const regionMap: RegionData = {};
      const data = res.data || {};

      console.log("data : ", data);

      Object.entries(data).forEach(([province, count]) => {
        regionMap[province] = count as number;
      });

      setRegionData(regionMap);
    })
    .catch((err) => {
      console.log("지도 데이터 로드 실패: ", err);
    });
  }, []);

  // 도 경계 스타일
  const getRegionStyle = (feature: any) => {
    const name = feature.properties.CTP_KOR_NM;
    const count = regionData[name] || 0;
    
    return {
      fillColor: "#f8f9fa",
      weight: 1,
      opacity: 1,
      color: "#dee2e6",
      dashArray: "3",
      fillOpacity: 0.3,
    };
  };

  // Hover 시 스타일 변경
  const highlightFeature = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2,
      color: "#666",
      fillOpacity: 0.5,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e: any) => {
    const layer = e.target;
    const feature = layer.feature;
    layer.setStyle(getRegionStyle(feature));
  };

  const onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.CTP_KOR_NM;
    const count = regionData[name] || 0;

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    // layer.bindPopup(`${name}<br/>차량 수: ${count}대`);
  };

  // 폴리곤의 무게중심 계산 함수
  const calculateCentroid = (coordinates: number[][][]): [number, number] => {
    const polygon = coordinates[0];
    let area = 0;
    let centroidX = 0;
    let centroidY = 0;

    for (let i = 0; i < polygon.length - 1; i++) {
      const [x1, y1] = polygon[i];
      const [x2, y2] = polygon[i + 1];
      
      const cross = x1 * y2 - x2 * y1;
      area += cross;
      centroidX += (x1 + x2) * cross;
      centroidY += (y1 + y2) * cross;
    }

    area /= 2;
    centroidX /= (6 * area);
    centroidY /= (6 * area);

    return [centroidY, centroidX]; // [lat, lng] 형식으로 반환
  };

  // 멀티폴리곤의 무게중심 계산 함수
  const calculateMultiPolygonCentroid = (coordinates: number[][][][]): [number, number] => {
    let totalArea = 0;
    let weightedCentroidX = 0;
    let weightedCentroidY = 0;

    coordinates.forEach((polygon: number[][][]) => {
      const [centroidY, centroidX] = calculateCentroid(polygon);
      let area = 0;

      // 폴리곤 면적 계산
      const coords = polygon[0];
      for (let i = 0; i < coords.length - 1; i++) {
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[i + 1];
        area += x1 * y2 - x2 * y1;
      }
      area = Math.abs(area) / 2;

      totalArea += area;
      weightedCentroidX += centroidX * area;
      weightedCentroidY += centroidY * area;
    });

    return [
      weightedCentroidY / totalArea,
      weightedCentroidX / totalArea
    ];
  };

  // 중심 좌표 계산 함수
  const getCenter = (feature: any): [number, number] => {
    const coordinates = feature.geometry.coordinates;
    
    if (feature.geometry.type === 'Polygon') {
      return calculateCentroid(coordinates);
    }
    
    if (feature.geometry.type === 'MultiPolygon') {
      return calculateMultiPolygonCentroid(coordinates);
    }
    
    // 기본값 반환
    return [36.5, 127.5];
  };

  // 원형 마커 생성 함수
  const createCircleMarker = (count: number, name: string) => {
    // 차량 수에 따라 원의 크기 결정 (최소 20px, 최대 90px)
    const size = Math.min(50, Math.max(20, count * 3));
    
    // 차량 수에 따라 색상 결정
    let color = '#cccccc';
    if (count > 0) {
      if (count <= 2) color = '#ffd700'; // 노란색
      else if (count <= 4) color = '#ffa500'; // 주황색
      else color = '#ff4500'; // 빨간색
    }

    return L.divIcon({
      className: 'circle-marker',
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(16, size/3)}px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          border: 3px solid white;
          position: relative;
        ">
          ${count}
          <div style="
            position: absolute;
            bottom: 5px;
            font-size: 12px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          ">
            ${name}
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  };

  // 위치 조정 함수
  const adjustPosition = (center: [number, number], name: string): [number, number] => {
    // 지역별 위치 조정
    const positionAdjustments: { [key: string]: [number, number] } = {
      "서울특별시": [0.0, 0.0],
      "인천광역시": [-0.1, 0.1],
      "경기도": [-0.1, 0.15],
      "강원도": [0.2, 0.1],
      "충청북도": [0.0, -0.2],
      "충청남도": [0.0, 0],
      "대전광역시": [0.03, 0.0],
      "세종특별자치시": [-0.05, 0.0],
      "전라북도": [0.0, 0.0],
      "전라남도": [-0.1, 0.0],
      "광주광역시": [0.0, 0.0],
      "경상북도": [0.1, 0.0],
      "경상남도": [0, -0.05],
      "대구광역시": [-0.1, 0.0],
      "울산광역시": [0.0, 0.0],
      "부산광역시": [0.0, 0.05],
      "제주특별자치도": [0.0, 0.0]
    };

    const adjustment = positionAdjustments[name] || [0, 0];
    return [center[0] + adjustment[0], center[1] + adjustment[1]];
  };

  return (
    <MapContainer
      center={[36.5, 127.5]}
      zoom={7}
      minZoom={6}
      maxBounds={[
        [33, 124],
        [39, 132],
      ]}
      maxBoundsViscosity={1.0}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {regionData && geoData && (
        <>
          <GeoJSON
            data={geoData}
            style={getRegionStyle}
            onEachFeature={onEachFeature}
          />

          {geoData.features.map((feature: any, idx: number) => {
            const center = getCenter(feature);
            const name = feature.properties.CTP_KOR_NM;
            const count = regionData[name] || 0;
            const adjustedPosition = adjustPosition(center, name);

            return (
              <Marker
                key={idx}
                position={adjustedPosition as [number, number]}
                icon={createCircleMarker(count, name)}
              />
            );
          })}
        </>
      )}
    </MapContainer>
  );
}