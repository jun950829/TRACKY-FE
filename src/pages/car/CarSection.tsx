import { useEffect, useState } from "react";
import CarSearchLayer from "./CarSearchLayer";
import CarTable from "./CarTable";
import carApiService from "@/libs/apis/carApi";
import { CarDetailTypes } from "@/constants/types/types";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";
import Pagination from "@/components/custom/Pagination";

// 페이지네이션 응답을 위한 타입 정의
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function CarSection() {
  const [carList, setCarList] = useState<CarDetailTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  // 검색 및 필터 상태
  const [searchParams, setSearchParams] = useState({
    search: "",
    status: undefined as string | undefined,
    carType: undefined as string | undefined,
    size: 10,
    page: 0,
  });

  // 페이지네이션 상태
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  // 데이터 로드 함수
  const loadCarData = async (params: typeof searchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await carApiService.searchByFilters(
        params.search,
        params.status,
        params.carType,
        params.size,
        params.page
      );

      const responseBody = response.data;

      if (responseBody.status === 200) {
        // 성공 응답 처리
        const carData = responseBody.data || [];
        const pageData = responseBody.pageResponse || {};

        setCarList(carData);
        setPagination({
          currentPage: pageData.number || 0,
          totalPages: pageData.totalPages || 1,
          totalElements: pageData.totalElements || carData.length,
        });
      } else {
        // 실패 응답 처리
        console.error("API 오류 응답:", responseBody);
        setCarList([]);
        setPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
        });
      }
    } catch (error) {
      console.error("차량 데이터 로드 실패:", error);
      setError(createApiError(error));
      setCarList([]);
      setPagination({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 필터 변경 함수
  const handleSearch = (
    isReload: boolean,
    search: string = "",
    status?: string,
    carType?: string,
    size: number = 10
  ) => {
    const newParams = isReload
      ? { ...searchParams }
      : {
          search,
          status,
          carType,
          size,
          page: 0, // 검색 조건 변경 시 첫 페이지로 리셋
        };

    setSearchParams(newParams);
    loadCarData(newParams);
  };

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    loadCarData(newParams);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadCarData(searchParams);
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {error && <ErrorToast error={error} />}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">차량 관리</h1>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          차량 정보를 관리하고 조회할 수 있습니다.
        </p>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CarSearchLayer onSearch={handleSearch} defaultPageSize={searchParams.size} />
          <div className="p-4 sm:p-6">
            <CarTable
              carList={carList}
              setCarList={setCarList}
              isLoading={isLoading}
              reload={() => handleSearch(true)}
            />

            {/* 페이지네이션 컴포넌트 */}
            {pagination.totalElements > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={Math.max(1, pagination.totalPages)}
                pageSize={searchParams.size}
                totalElements={pagination.totalElements}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarSection;
