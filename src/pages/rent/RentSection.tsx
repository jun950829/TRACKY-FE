import { rentApiService } from "@/libs/apis/rentsApi";
import { useEffect, useState } from "react";
import RentTable from "./RentTable";
import RentSearchLayer from "./RentSearchLayer";
import { RentDetailTypes } from "@/constants/types/types";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";
import Pagination from "@/components/custom/Pagination";

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }

function RentSection() {
    const [rentList, setRentList] = useState<RentDetailTypes[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);

    const [searchParams, setSearchParams] = useState({
        search: "",
        status: undefined as string | undefined,
        date: undefined as string | undefined,
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
      const loadRentData = async (params: typeof searchParams) => {
        setIsLoading(true);
        setError(null);
    
        try {
          const response = await rentApiService.searchRents(
            params.search,
            params.status,
            params.date,
            params.size,
            params.page
          );
    
          const responseBody = response.data;
    
          if (responseBody.status === 200) {
            const rentData = responseBody.data || [];
            const pageData = responseBody.pageResponse || {};
    
            setRentList(rentData);
            setPagination({
              currentPage: pageData.number || 0,
              totalPages: pageData.totalPages || 1,
              totalElements: pageData.totalElements || rentData.length,
            });
          } else {
            console.error("API 오류 응답:", responseBody);
            setRentList([]);
            setPagination({
              currentPage: 0,
              totalPages: 0,
              totalElements: 0,
            });
          }
        } catch (error) {
          console.error("예약 데이터 로드 실패:", error);
          setError(createApiError(error));
          setRentList([]);
          setPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
          });
        } finally {
          setIsLoading(false);
        }
      };
    
      // 검색 및 필터 변경 핸들러
      const handleSearch = (
        isReload: boolean,
        search: string = "",
        status?: string,
        date?: string,
        size: number = 10
      ) => {
        const newParams = isReload
          ? { ...searchParams }
          : {
              search,
              status,
              date,
              size,
              page: 0, // 검색 옵션 변경 시 첫 페이지로 초기화
            };
    
        setSearchParams(newParams);
        loadRentData(newParams);
      };
    
      // 페이지 변경 핸들러
      const handlePageChange = (page: number) => {
        const newParams = { ...searchParams, page };
        setSearchParams(newParams);
        loadRentData(newParams);
      };

    useEffect(() => {
        loadRentData(searchParams);
    }, []);

    return (
        <div className="w-full max-w-[1920px] mx-auto px-6">
          {error && <ErrorToast error={error} />}
          <div className="flex flex-col gap-4">
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">예약 관리</h1> */}
            <p className="text-gray-500 text-sm sm:text-base">차량 예약 정보를 관리하고 조회할 수 있습니다.</p>
    
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <RentSearchLayer onSearch={handleSearch} defaultPageSize={searchParams.size} />
              <div className="p-4 sm:p-6">
                <RentTable
                  rentList={rentList}
                  setRentList={setRentList}
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
    
    export default RentSection;