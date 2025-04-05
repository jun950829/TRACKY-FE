import React, { useState, useEffect } from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import HistorySearch from './HistorySearch';
import HistoryList from './HistoryList';
import HistoryDetail from './HistoryDetail';
import { mockRentRecords, mockTripRecords } from '@/constants/mocks/historyMockData';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const HistoryMain = () => {
  const { 
    setRentResults, 
    setTripResults, 
    setSelectedRent
  } = useHistoryStore();

  // 검색 시트의 열림/닫힘 상태만 관리합니다
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    // if (import.meta.env.DEV && !isDataInitialized) {
      if (true && !isDataInitialized) {
      // mock 데이터 로드
      setRentResults(mockRentRecords);
      setTripResults(mockTripRecords);
      
      // 첫 번째 렌트와 트립 선택 (UI 미리보기) - 최초 1회만 실행
      if (mockRentRecords.length > 0) {
        setSelectedRent(mockRentRecords[0]);
      }
      
      setIsDataInitialized(true);
    }
  }, [setRentResults, setTripResults, setSelectedRent, isDataInitialized]);

  // 검색 시트 토글 핸들러
  const toggleSearchSheet = () => {
    if (isSearchSheetOpen) {
      // 이미 열려있으면 닫기
      setIsSearchSheetOpen(false);
    } else {
      // 닫혀있으면 열기
      setIsSearchSheetOpen(true);
    }
  };

  // 항목 선택 핸들러
  const handleItemSelected = () => {
    // 모바일에서 항목 선택시 검색 시트만 닫기
    setIsSearchSheetOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">차량 운행 기록</h1>
        
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
      <Sheet open={isSearchSheetOpen} onOpenChange={setIsSearchSheetOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[80vh] p-0"
          style={{ 
            zIndex: 100, 
            marginBottom: 'env(safe-area-inset-bottom, 16px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)'
          }}
        >
          <SheetHeader 
            className="px-4 py-3 border-b cursor-pointer" 
            onClick={toggleSearchSheet}
          >
            <SheetTitle className="text-left text-lg">검색 및 목록</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-full">
            <HistorySearch />
            <HistoryList onItemClick={handleItemSelected} />
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-120px)]">
        {/* 데스크탑 검색/목록 영역 (모바일에서는 숨김) */}
        <div className="hidden md:block w-[350px] lg:w-[400px] md:mr-4 bg-white rounded-lg shadow-md overflow-hidden">
          <HistorySearch />
          <HistoryList />
        </div>
        
        {/* 상세 정보 영역 - 모바일과 데스크탑 모두 표시 */}
        <div className="flex-1 mt-4 md:mt-0 bg-white rounded-lg shadow-md overflow-hidden" style={{ zIndex: 1 }}>
          <HistoryDetail />
        </div>
      </div>
    </div>
  );
};

export default HistoryMain;
