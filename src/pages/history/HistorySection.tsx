import React, { useState, useEffect } from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import HistorySearch from './HistorySearch';
import HistoryBizList from './HistoryBizList';
import HistorySheet from './HistorySheet';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { driveService } from '@/libs/apis/driveApi';
import { ErrorToast } from '@/components/custom/ErrorToast';
import { ApiError, createApiError } from '@/types/error';
import HistoryTable from './HistoryTable';
import Pagination from '@/components/custom/Pagination';
import HistoryCarLayer from './HistoryCarLayer';

interface DrawerState {
  [key: string]: boolean;
}

function HistorySection() {
  const { 
    searchType,
    setBizResults,
    setCarResults,
    isLoading
  } = useHistoryStore();

  const [sheetStates, setDrawerStates] = useState<DrawerState>({
    search: false,
  });
  const [error, setError] = useState<ApiError | null>(null);

  async function getDataList() {
    setError(null);
    try {
      let driveList;
      if( searchType === 'car' ) {
        const response = await driveService.getCars("");
        driveList = response;
        setCarResults(driveList.data);
      }
    } catch (error) {
      console.error('운행 기록 조회 실패:', error);
      setError(createApiError(error));
    }
  }

  useEffect(() => {
    getDataList();
  }, []);

  const handleDrawerOpenChange = (id: string, isOpen: boolean) => {
    setDrawerStates(prev => ({ ...prev, [id]: isOpen }));
  };

  const toggleSearchSheet = () => {
    setDrawerStates(prev => ({ ...prev, search: true }));
  };

  return (
    <div className="h-full flex flex-col">
      {error && <ErrorToast error={error} />}
      
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-sm">
        <div className="md:hidden">
          <Button 
            onClick={toggleSearchSheet}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            검색
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Sheet */}
      <HistorySheet
        id="search"
        isOpen={sheetStates.search}
        onOpenChange={handleDrawerOpenChange}
        onItemSelected={() => {
          sheetStates.search = false;
        }}
        title="검색 및 목록"
      />
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 h-[calc(100vh-120px)]">
        {/* Desktop Search/List Area */}
        <div className="hidden md:block w-[280px] bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <HistorySearch />
            </div>
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : searchType === 'biz' ? (
                <HistoryBizList />
              ) : (
                <HistoryCarLayer />
              )}
            </div>

            <Pagination currentPage={0} totalPages={0} pageSize={0} totalElements={0} onPageChange={function (page: number): void {
              throw new Error('Function not implemented.');
            } }            />

          </div>
        </div>
        
        {/* Table Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-full overflow-y-auto">
            <HistoryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorySection;
