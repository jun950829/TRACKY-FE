import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { searchRentRecords, searchTripRecords } from '@/constants/mocks/historyMockData';

const HistorySearch = () => {
  const { 
    searchText, 
    setSearchText, 
    searchType, 
    setSearchType, 
    setRentResults, 
    setTripResults, 
    setLoading, 
    setError,
    isLoading 
  } = useHistoryStore();

  // 검색 핸들러
  const handleSearch = () => {
    setLoading(true);
    setError(null);

    try {
      if (import.meta.env.DEV) {
        // mock 데이터 검색 시뮬레이션
        setTimeout(() => {
          if (searchType === 'rent') {
            const results = searchRentRecords(searchText);
            setRentResults(results);
          } else {
            const results = searchTripRecords(searchText);
            setTripResults(results);
          }
          setLoading(false);
        }, 500);
      } else {
        // 실제 API 호출 로직이 여기에 들어갈 것입니다
        // ...
        setLoading(false);
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('검색 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  // 입력 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 검색 타입 변경 핸들러
  const handleTypeChange = (type: 'rent' | 'trip') => {
    setSearchType(type);
  };

  // 엔터 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 border-b">
      <div className="mb-3">
        <div className="flex space-x-2 mb-2">
          <Button
            variant={searchType === 'rent' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 ${searchType === 'rent' ? 'bg-black text-white' : ''}`}
            onClick={() => handleTypeChange('rent')}
          >
            예약 ID
          </Button>
          <Button
            variant={searchType === 'trip' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 ${searchType === 'trip' ? 'bg-black text-white' : ''}`}
            onClick={() => handleTypeChange('trip')}
          >
            운행 ID
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder={`${searchType === 'rent' ? '예약 ID' : '운행 ID'}로 검색`}
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {searchType === 'rent' 
          ? '예약 ID, 차량 ID, 또는 예약자 이름으로 검색' 
          : '운행 ID, 예약 ID, 또는 차량 ID로 검색'
        }
        {import.meta.env.DEV && (
          <p className="mt-1 text-blue-500">
            개발 모드: RENT-001, RENT-002 등으로 검색 가능
          </p>
        )}
      </div>
    </div>
  );
};

export default HistorySearch; 