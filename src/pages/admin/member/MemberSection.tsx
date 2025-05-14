import React, { useState, useEffect } from 'react';
import MemberTable from "./MemberTable";
import signupApiService from '@/libs/apis/signupApi';
import { Member } from '@/constants/types/types';
import Pagination from '@/components/custom/Pagination';

export default function MemberSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  const [searchParams, setSearchParams] = useState({
    search: searchTerm,
    page: 0,
    size: pageSize,
  });

  // 초기 데이터 로드
  useEffect(() => {
    searchMembers(searchParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.page]);

  const searchMembers = async (params: typeof searchParams) => {
    setIsLoading(true);
    try {
      const response = await signupApiService.searchMembers(
        params.search,
        params.page,
        params.size
      );
      setMembers(response.data);
      setPagination({
        currentPage: response.pageResponse.page || 0,
        totalPages: response.pageResponse.totalPages || 1,
        totalElements: response.pageResponse.total || response.data.length,
      });
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setIsLoading(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams(prev => ({ ...prev, page: 0, search: term }));
    searchMembers({ ...searchParams, page: 0, search: term });
  };

  const handleMemberUpdate = async () => {
    await searchMembers(searchParams);
  };

  return (
    <section className="w-full h-full">
      <MemberTable
        members={members}
        isLoading={isLoading}
        searchTerm={searchTerm}
        pagination={pagination}
        onSearch={handleSearch}
        setSearchTerm={setSearchTerm}
        onPageChange={handlePageChange}
        onMemberUpdate={handleMemberUpdate}
      />
      {pagination.totalElements > 0 && (
        <div className="w-full flex flex-col justify-between items-center gap-4 mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, pagination.totalPages)}
            pageSize={pageSize}
            totalElements={pagination.totalElements}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}