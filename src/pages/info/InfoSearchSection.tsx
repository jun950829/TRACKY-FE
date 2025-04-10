import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useInfoStore } from "@/stores/useInfoStore";
import infoApiService from "@/libs/apis/infoApi";
import { reverseGeocodeOSM } from "@/libs/utils/reverseGeocode";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";

function InfoSearchSection() {
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const { setInfo } = useInfoStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setInfo({ error: "예약 ID를 입력해주세요.", rent: null, car: null, trips: [] });
      return;
    }

    setInfo({ isLoading: true, error: null });
    setError(null);

    try {
      // 1. 예약 정보 + 차량 정보 조회
      const rentResponse = await infoApiService.getReservationWithCar(searchText);
      const reservation = rentResponse?.data?.reservation;
      const car = rentResponse?.data?.car;

      if (!reservation || !car) {
        setInfo({
          error: "해당 예약 정보를 찾을 수 없습니다.",
          rent: null,
          car: null,
          trips: [],
          isLoading: false,
        });
        return;
      }

      const parsedRent = {
        rent_uuid: reservation.rentUuid,
        mdn: car.mdn,
        renterName: reservation.renterName,
        renterPhone: reservation.renterPhone,
        purpose: reservation.purpose ?? "-",
        rentStime: reservation.rentStime,
        rentEtime: reservation.rentEtime,
        rentLoc: reservation.rentLoc ?? "-",
        returnLoc: reservation.returnLoc ?? "-",
        rentStatus: "SCHEDULED", // 필요하면 추후 실제 상태값 적용
        createdAt: reservation.createdAt,
      };

      // 2. 운행 정보 조회
      const drivingsResponse = await infoApiService.getDrivings(searchText);
      const parsedTrips = await Promise.all(
        (drivingsResponse?.data || []).map(async (driving: {
          driveStartLat: number;
          driveStartLon: number;
          driveEndLat: number;
          driveEndLon: number;
          driveOnTime: string;
          driveOffTim: string;
          driveDistance: number;
        }) => {
          const startLat = driving.driveStartLat / 1_000_000;
          const startLon = driving.driveStartLon / 1_000_000;
          const endLat = driving.driveEndLat / 1_000_000;
          const endLon = driving.driveEndLon / 1_000_000;

          // 시작 위치 주소 변환
          const startAddress = await reverseGeocodeOSM(startLat, startLon);

          // 종료 위치가 유효하면 주소 변환, 아니면 "운행중"
          const hasValidEndCoords = driving.driveEndLat !== 0 && driving.driveEndLon !== 0;
          const endAddress = hasValidEndCoords ? await reverseGeocodeOSM(endLat, endLon) : "운행중";

          return {
            oTime: driving.driveOnTime,
            offTime: driving.driveOffTim,
            distance: driving.driveDistance,
            startAddress,
            endAddress,
          };
        })
      );

      // 3. 상태 업데이트
      setInfo({
        rent: parsedRent,
        car,
        trips: parsedTrips,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("검색 오류:", error);
      setError(createApiError(error));
      setInfo({
        error: "정보를 불러오는 중 오류가 발생했습니다.",
        rent: null,
        car: null,
        trips: [],
        isLoading: false,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { isLoading, error: infoError } = useInfoStore();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      {error && <ErrorToast error={error} />}
      <div className="md:flex md:justify-between md:items-start">
        <div className="md:max-w-md mb-4 md:mb-0 md:mr-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">예약 ID로 조회하기</h2>
          <p className="text-sm text-gray-600">
            예약 시 제공받은 예약 ID를 입력하여 예약 정보를 확인할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:w-2/5 gap-2">
          <Input
            placeholder="예약 ID를 입력하세요"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white h-10 mt-2 sm:mt-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <SearchIcon className="h-4 w-4 mr-2" />
            )}
            <span className="text-sm">조회하기</span>
          </Button>
        </div>
      </div>

      {infoError && <p className="text-sm text-red-500 mt-2">{infoError}</p>}
    </div>
  );
}

console.log("✅ InfoSearchSection 렌더링됨");

export default InfoSearchSection;
