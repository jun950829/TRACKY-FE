import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useHistoryStore } from '@/stores/useHistoryStore';
import driveService from '@/libs/apis/driveApi';
import { cn } from '@/libs/utils/utils';

const HistorySearch = () => {
  const { 
    searchText, 
    setSearchText, 
    searchType, 
    setSearchType, 
    setCarResults, 
    setLoading, 
    setError,
    isLoading 
  } = useHistoryStore();

  const handleSearch = async() => {
    if (!searchText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      if (searchType === 'car') {
        const response = await driveService.getCars(searchText);
        setCarResults(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('검색 오류:', error);
      setError('검색 중 오류가 발생했습니다');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleTypeChange = (type: 'biz' | 'car') => {
    setSearchText('');
    setSearchType(type);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Type Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={searchType === 'car' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "flex-1 transition-all duration-200",
            searchType === 'car' 
              ? 'bg-primary text-white hover:bg-primary/80' 
              : 'border-gray-200 hover:border-primary hover:text-primary'
          )}
          onClick={() => handleTypeChange('car')}
        >
          차량 별
        </Button>
        <Button
          variant={searchType === 'biz' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "flex-1 transition-all duration-200",
            searchType === 'biz' 
              ? 'bg-primary text-white hover:bg-primary/80' 
              : 'border-gray-200 hover:border-primary hover:text-primary'
          )}
          onClick={() => handleTypeChange('biz')}
        >
          업체 별
        </Button>
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <Input
          placeholder={`${searchType === 'biz' ? '업체 ID' : '차량 관리번호'}로 검색`}
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading || !searchText.trim()}
          size="icon"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Search Hint */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        {searchType === 'biz' 
          ? '업체 ID로 검색하여 해당 업체의 모든 운행 기록을 확인할 수 있습니다' 
          : '차량 관리번호로 검색하여 해당 차량의 모든 운행 기록을 확인할 수 있습니다'
        }
      </div>
    </div>
  );
};

export default HistorySearch; 