import React, { useState, useEffect } from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import HistorySearch from './HistorySearch';
import HistoryList from './HistoryList';
import HistoryDetail from './HistoryDetail';
import HistoryDrawer from './HistoryDrawer';
import { mockRentRecords, mockTripRecords } from '@/constants/mocks/historyMockData';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawerState {
  [key: string]: boolean;
}

const HistoryMain = () => {
  const { 
    setRentResults, 
    setTripResults, 
    isLoading
  } = useHistoryStore();

  // 각 drawer의 열림/닫힘 상태를 개별적으로 관리
  const [drawerStates, setDrawerStates] = useState<DrawerState>({
    search: false,
    // 다른 drawer가 있다면 여기에 추가
  });
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isDataInitialized) {
      // mock 데이터 로드
      setRentResults(mockRentRecords);
      setTripResults(mockTripRecords);
      setIsDataInitialized(true);
    }
  }, [setRentResults, setTripResults, isDataInitialized]);

  // 검색 완료 시 검색 drawer 닫기
  useEffect(() => {
    if (!isLoading && drawerStates.search) {
      setDrawerStates(prev => ({ ...prev, search: false }));
    }
  }, [isLoading, drawerStates.search]);

  // drawer 상태 변경 핸들러
  const handleDrawerOpenChange = (id: string, isOpen: boolean) => {
    setDrawerStates(prev => ({ ...prev, [id]: isOpen }));
  };

  // 검색 시트 토글 핸들러
  const toggleSearchSheet = () => {
    setDrawerStates(prev => ({ ...prev, search: !prev.search }));
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-full h-[100vh] flex flex-col">
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-center md:text-left">차량 운행 기록</h1>
        
        {/* 모바일에서 검색 버튼 */}
        <div className="md:hidden">
          <Button 
            onClick={toggleSearchSheet}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Search className="h-4 w-4 mr-1" />
            검색
          </Button>
        </div>
      </div>
      
      {/* 모바일 검색 시트 */}
      <HistoryDrawer
        id="search"
        isOpen={drawerStates.search}
        onOpenChange={handleDrawerOpenChange}
        onItemSelected={() => setDrawerStates(prev => ({ ...prev, search: false }))}
        title="검색 및 목록"
      />
      
      <div className="flex flex-col md:flex-row flex-grow h-[calc(100vh-80px)] overflow-hidden">
        {/* 데스크탑 검색/목록 영역 (모바일에서는 숨김) */}
        <div className="hidden md:block w-[350px] lg:w-[400px] md:mr-4 bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0">
              <HistorySearch />
            </div>
            <div className="flex-grow overflow-y-auto">
              <HistoryList />
            </div>
          </div>
        </div>
        
        {/* 상세 정보 영역 - 모바일과 데스크탑 모두 표시 */}
        <div className="flex-1 mt-2 md:mt-0 bg-white rounded-lg shadow-md overflow-hidden h-full" style={{ zIndex: 1 }}>
          <div className="h-full overflow-y-auto">
            <HistoryDetail />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryMain;
