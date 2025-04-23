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
    setBizResults, 
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
      if( searchType === 'biz' ) {
        const response = await drivehistoryService.driveHistorybyBizId(searchText);
        // setBizResults(response.data);
      } else if( searchType === 'car' ) {
        const response = await drivehistoryService.getDriveDetailbyCar(searchText);
        setDriveResults(response.data);
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
  const handleTypeChange = (type: 'biz' | 'car') => {
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
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          <Button
            variant={searchType === 'car' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 transition-all duration-200 ${
              searchType === 'car' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md' 
                : 'border-gray-200 hover:border-blue-500 hover:text-blue-600'
            }`}
            onClick={() => handleTypeChange('car')}
          >
            차량 별
          </Button>
          <Button
            variant={searchType === 'biz' ? 'default' : 'outline'}
            size="sm"
            className={`flex-1 transition-all duration-200 ${
              searchType === 'biz' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md' 
                : 'border-gray-200 hover:border-blue-500 hover:text-blue-600'
            }`}
            onClick={() => handleTypeChange('biz')}
          >
            업체 별
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder={`${searchType === 'biz' ? '업체 ID' : '차량 관리번호'}로 검색`}
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SearchIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md">
        {searchType === 'biz' 
          ? '업체 ID로 검색하여 해당 업체의 모든 운행 기록을 확인할 수 있습니다' 
          : '차량 관리번호로 검색하여 해당 차량의 모든 운행 기록을 확인할 수 있습니다'
        }
      </div>
    </div>
  );
};

export default HistorySearch; 