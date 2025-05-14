import React, { useState } from 'react';
import HistorySearch from './HistorySearch';
import { Search, Loader2, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorToast } from '@/components/custom/ErrorToast';
import { ApiError } from '@/types/error';
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
      
      {/* Mobile Only Message */}
      <div className="md:hidden flex flex-col items-center justify-center h-screen p-4 text-center">
        <Monitor className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">PC 전용 페이지</h2>
        <p className="text-gray-600">
          운행기록 페이지는 PC 환경에서만 이용 가능합니다.
          <br />
          PC로 접속해 주시기 바랍니다.
        </p>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:flex flex-col h-full">
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
    </div>
  );
}

export default HistorySection;
