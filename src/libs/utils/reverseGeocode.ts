const geocodeCache = new Map<string, string>();

export async function reverseGeocodeOSM(lat: number, lon: number): Promise<string> {
  const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;

  // 캐시 확인
  if (geocodeCache.has(key)) {
    return geocodeCache.get(key)!;
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "Tracky/1.0 (7tracky7@gmail.com)", // 예의상 유저 에이전트는 포함
        },
      }
    );

    if (!res.ok) {
      throw new Error("역지오코딩 실패");
    }

    const data = await res.json();

    const address =
      data.display_name ||
      [data.address?.road, data.address?.city, data.address?.state, data.address?.country]
        .filter(Boolean)
        .join(" ") ||
      "주소 없음";

    geocodeCache.set(key, address);
    return address;
  } catch (err) {
    console.error("역지오코딩 에러:", err);
    return "주소 불러오기 실패";
  }
}
