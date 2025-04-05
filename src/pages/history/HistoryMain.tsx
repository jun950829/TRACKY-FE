import React, { useEffect } from 'react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import HistorySearch from './HistorySearch';
import HistoryList from './HistoryList';
import HistoryDetail from './HistoryDetail';
import { mockRentRecords, mockTripRecords } from '@/constants/mocks/historyMockData';

const HistoryMain = () => {
  const { 
    setRentResults, 
    setTripResults, 
    setSelectedRent,
    isDrawerOpen,
    setDrawerOpen
  } = useHistoryStore();

  // 초기 데이터 로드
  useEffect(() => {
    if (import.meta.env.DEV) {
      // mock 데이터 로드
      setRentResults(mockRentRecords);
      setTripResults(mockTripRecords);
      
      // 첫 번째 렌트와 트립 선택 (UI 미리보기)
      if (mockRentRecords.length > 0) {
        setSelectedRent(mockRentRecords[0]);
      }
    }
  }, [setRentResults, setTripResults, setSelectedRent]);

  // 모바일에서 드로어 닫기 핸들러
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // 모바일에서 드로어 열기 핸들러
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-full h-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">차량 운행 기록</h1>
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-120px)]">
        {/* 모바일 뷰에서 필터 토글 버튼 */}
        <div className="md:hidden mb-2">
          <button 
            onClick={() => setDrawerOpen(!isDrawerOpen)}
            className="flex items-center justify-center w-full py-2 bg-gray-100 rounded-md"
          >
            {isDrawerOpen ? '검색 닫기' : '검색 열기'} 
            <span className="ml-2">
              {isDrawerOpen ? '▲' : '▼'}
            </span>
          </button>
        </div>
        
        {/* 좌측 검색/목록 영역 */}
        <div className={`
          ${isDrawerOpen ? 'block' : 'hidden'} 
          md:block
          w-full md:w-[350px] lg:w-[400px] 
          md:mr-4 bg-white rounded-lg shadow-md 
          overflow-hidden transition-all duration-300
        `}>
          <HistorySearch />
          <HistoryList onItemClick={handleDrawerClose} />
        </div>
        
        {/* 우측 상세 정보 영역 */}
        <div className="flex-1 mt-4 md:mt-0">
          <HistoryDetail onBackClick={handleDrawerOpen} />
        </div>
      </div>
    </div>
  );
};

export default HistoryMain;