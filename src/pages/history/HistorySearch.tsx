import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { drivehistoryService } from '@/libs/apis/drivehistoryApi';

const HistorySearch = () => {
  const { 
    searchText, 
    setSearchText, 
    searchType, 
    setSearchType, 
    setRentResults, 
    setDriveResults, 
    setLoading, 
    setError,
    isLoading 
  } = useHistoryStore();

  // 검색 핸들러
  const handleSearch = async() => {
    setLoading(true);
    setError(null);
    try {
      if( searchType === 'rent' ) {
        const response = await drivehistoryService.driveHistorybyRentUuid(searchText);
        setRentResults( response.data );
      setLoading(false);
    } else if( searchType === 'car' ) {
      const response = await drivehistoryService.getDriveDetailbyCar(searchText);
        setDriveResults( response.data );
      }
      setLoading(false);
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
  const handleTypeChange = (type: 'rent' | 'car') => {
    setSearchText('');
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
            예약 별
          </Button>
          <Button
            variant={searchType === 'car' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 ${searchType === 'car' ? 'bg-black text-white' : ''}`}
            onClick={() => handleTypeChange('car')}
          >
            차량 별
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder={`${searchType === 'rent' ? '예약 ID' : '차량 ID'}로 검색`}
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
          ? '예약 ID으로 검색' 
          : '차량 ID로 검색하여 해당 차량의 모든 운행 기록을 확인할 수 있습니다'
        }
      </div>
    </div>
  );
};

export default HistorySearch; 