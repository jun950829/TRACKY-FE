import React, { useState } from 'react';
import HistorySearch from './HistorySearch';
import HistoryBizList from './HistoryBizList';
import HistorySheet from './HistorySheet';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorToast } from '@/components/custom/ErrorToast';
import { ApiError, createApiError } from '@/types/error';
import HistoryTable from './HistoryTable';
import HistoryCarLayer from './HistoryCarLayer';
import { useCarListStore } from "@/stores/useCarListStore";
import { useDriveListStore } from "@/stores/useDriveListStore";
import Pagination from '@/components/custom/Pagination';

interface DrawerState {
  [key: string]: boolean;
}

function HistorySection() {
  const { isLoading } = useCarListStore();

  const { 
    currentPage, 
    totalPages, 
    totalElements, 
    pageSize,
    setCurrentPage 
  } = useDriveListStore();

  const [sheetStates, setDrawerStates] = useState<DrawerState>({
    search: false,
  });
  const [error, setError] = useState<ApiError | null>(null);

  const handleDrawerOpenChange = (id: string, isOpen: boolean) => {
    setDrawerStates(prev => ({ ...prev, [id]: isOpen }));
  };

  const toggleSearchSheet = () => {
    setDrawerStates(prev => ({ ...prev, search: true }));
  };

  return (
    <div className="h-full flex flex-col max-h-screen overflow-y-auto">
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
      {/* <HistorySheet
        id="search"
        isOpen={sheetStates.search}
        onOpenChange={handleDrawerOpenChange}
        onItemSelected={() => {
          sheetStates.search = false;
        }}
        title="검색 및 목록"
      /> */}
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow gap-4 h-[85vh]">
        {/* Desktop Search/List Area */}
        <div className="hidden md:block w-[20%] min-w-[270px] bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="p-2 border-b">
              <HistorySearch />
            </div>
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <HistoryCarLayer />
              )}
            </div>
          </div>
        </div>
        
        {/* Table Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-full overflow-y-auto">
            <HistoryTable />
            <div className="flex justify-center mt-4">
              <Pagination
                noText={false}
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistorySection;
