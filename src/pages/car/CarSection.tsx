import { useEffect, useState } from "react";
import CarSearchLayer from "./CarSearchLayer";
import CarTable from "./CarTable";
import carApiService from "@/libs/apis/carApi";
import { CarDetailTypes } from "@/constants/types/types";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";

function CarSection() {
  const [carList, setCarList] = useState<CarDetailTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [searchObj, setSearchObj] = useState<{searchText: string, status?: string, purpose?: string}>({searchText: ''});

  async function searchCars(isReload: boolean, searchText: string = "", status?: string, purpose?: string) {
    setIsLoading(true);
    setError(null);

    // 새로 고침 일땐 마지막에 검색한 옵션 유지
    if(!isReload) {
      setSearchObj({searchText: searchText, status: status, purpose: purpose});
      
      try {
        const res = await carApiService.searchByFilters(searchText, status, purpose);
        setCarList(res.data);
      } catch (error) {
        console.error('차량 검색 실패:', error);
        setError(createApiError(error));
      } finally {
        setIsLoading(false);
      }
    } else {
      // isReload가 true인 경우 이전 검색 옵션 사용
      try {
        const res = await carApiService.searchByFilters(searchObj.searchText, searchObj.status, searchObj.purpose);
        setCarList(res.data);
      } catch (error) {
        console.error('차량 검색 실패:', error);
        setError(createApiError(error));
      } finally {
        setIsLoading(false);
      }
    }
  } 

  useEffect(() => {
    searchCars(false);
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {error && <ErrorToast error={error} />}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">차량 관리</h1>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">차량 정보를 관리하고 조회할 수 있습니다.</p>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CarSearchLayer onSearch={searchCars} />
          <div className="p-4 sm:p-6">
            <CarTable 
              carList={carList} 
              setCarList={setCarList} 
              isLoading={isLoading}
              reload={searchCars}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarSection;