import { useEffect, useState } from "react";

import NoticeTable from "./NoticeTable";
import adminApiService from "@/libs/apis/noticeApi";
import { NoticeDetailTypes } from "@/constants/types/noticeTypes";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";
import Pagination from "@/components/custom/Pagination";
import NoticeSearchLayer from "./NoticeSearchLayer";


// 페이지네이션 응답을 위한 타입 정의
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

function NoticeSection() {
  const [noticeList, setNoticeList] = useState<NoticeDetailTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  // 검색 및 필터 상태
  const [searchParams, setSearchParams] = useState({
    search: "",
    isImportant: undefined as string | undefined,
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
  const loadNoticeData = async (params: typeof searchParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminApiService.getNotices(
        params.search,
        params.isImportant,
        params.size,
        params.page
      );

      const responseBody = response.data || response;

      if (responseBody.status === 200 || response.status === 200) {
        // 성공 응답 처리
        const noticeData = responseBody.data || response.data || [];
        const pageData = responseBody.pageResponse || {};
        console.log("페이지네이션 데이터 ", pageData);

        setNoticeList(noticeData);
        setPagination({
          currentPage: pageData.number || 0,
          totalPages: pageData.totalPages || 1,
          totalElements: pageData.totalElements || noticeData.length,
        });
      } else {
        // 실패 응답 처리
        console.error("API 오류 응답:", responseBody);
        setNoticeList([]);
        setPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
        });
      }
    } catch (error) {
      console.error("공지사항 데이터 로드 실패:", error);
      setError(createApiError(error));
      setNoticeList([]);
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
    isImportant?: string,
    size: number = 10
  ) => {
    const newParams = isReload
      ? { ...searchParams }
      : {
          search,
          isImportant,
          size,
          page: 0, // 검색 조건 변경 시 첫 페이지로 리셋
        };

    setSearchParams(newParams);
    loadNoticeData(newParams);
  };

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    loadNoticeData(newParams);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadNoticeData(searchParams);
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {error && <ErrorToast error={error} />}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          공지사항을 관리하고 조회할 수 있습니다.
        </p>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <NoticeSearchLayer onSearch={handleSearch} defaultPageSize={searchParams.size} />
          <div className="p-4 sm:p-6">
            <NoticeTable
              noticeList={noticeList}
              setNoticeList={setNoticeList}
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

export default NoticeSection;