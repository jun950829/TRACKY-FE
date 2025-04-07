// src/components/KoreaMap.tsx

import { MapContainer, TileLayer, GeoJSON, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function KoreaMap() {
  const [geoData, setGeoData] = useState<any>(null);

  // GeoJSON 불러오기
  useEffect(() => {
    fetch("/geojson/korea-provinces.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  // 도 경계 스타일
  const regionStyle = {
    fillColor: "#69b3a2",
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.5,
  };

  // Hover 시 스타일 변경
  const highlightFeature = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      weight: 3,
      color: "#666",
      fillOpacity: 0.7,
    });
    layer.bringToFront();
  };

  const resetHighlight = (e: any) => {
    const layer = e.target;
    layer.setStyle(regionStyle);
  };

  const onEachFeature = (feature: any, layer: any) => {
    const name =
      feature.properties.CTP_KOR_NM ||
      feature.properties.CTP_ENG_NM ||
      feature.properties.ADZONE_NM;

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });

    layer.bindPopup(name || "이름 없음");
  };

  // 중심 좌표 계산
  const getCenter = (feature: any): [number, number] => {
    const coordinates = feature.geometry.coordinates;
    let lat = 0,
      lng = 0,
      count = 0;

    const flattenCoords = (coords: any[]): any[] =>
      coords.flatMap((c: any) =>
        Array.isArray(c[0]) ? flattenCoords(c) : [c]
      );

    const flat = flattenCoords(coordinates);
    flat.forEach((coord: any) => {
      lng += coord[0];
      lat += coord[1];
      count++;
    });

    return [lat / count, lng / count];
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

      {geoData && (
        <>
          <GeoJSON
            data={geoData}
            style={regionStyle}
            onEachFeature={onEachFeature}
          />

          {geoData.features.map((feature: any, idx: number) => {
            const center = getCenter(feature);
            const name =
              feature.properties.CTP_KOR_NM ||
              feature.properties.CTP_ENG_NM ||
              feature.properties.ADZONE_NM;

            return (
              <Marker
                key={idx}
                position={center as [number, number]}
                icon={L.divIcon({
                  className: "label-text",
                  html: `<div>${name}</div>`,
                  iconSize: [100, 20],
                })}
              />
            );
          })}
        </>
      )}
    </MapContainer>
  );
}