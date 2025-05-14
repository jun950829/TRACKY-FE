import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useCarListStore } from '@/stores/useCarListStore';
import { cn } from '@/libs/utils/utils';
import { useAuthStore } from '@/stores/useAuthStore';

function HistorySearch() {
  const {
    isLoading,
    setCurrentPage,
    fetchCars,
    searchText,     
    searchBizText,
    setSearchText: setStoreSearchText,
    setSearchBizText: setStoreSearchBizText
  } = useCarListStore();

  const [searchBizValue, setSearchBizValue] = useState(searchBizText !== "" ? searchBizText : '');
  const [searchValue, setSearchValue] = useState(searchText !== "" ? searchText : '');
  const [searchType, setSearchType] = React.useState<'biz' | 'car'>('car');
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchCars(searchText !== "" ? searchText : '', '', 0);
  }, []);

  const handleSearch = async () => {
    if (searchType === 'biz') {
      setStoreSearchBizText(searchBizValue);
      setStoreSearchText(searchValue);

      setCurrentPage(0); // 첫 페이지로 초기화
      await fetchCars(searchBizValue, searchValue, 0);
    } else {
      setStoreSearchText(searchValue);
      setCurrentPage(0); // 첫 페이지로 초기화
      await fetchCars(searchBizValue, searchValue, 0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleBizInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBizValue(e.target.value);
  };

  const handleTypeChange = (type: 'biz' | 'car') => {
    setSearchValue('');
    setSearchBizValue('');
    setSearchType(type);
    setCurrentPage(0);
    fetchCars('', '', 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Search Type Toggle */}
      <div className="flex space-x-2">
        {isAdmin ?
        (
          <Input
            placeholder={'업체 ID로 검색'}
            value={searchBizValue}
            onChange={handleBizInputChange}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
        ) : 
        <Button
          variant={searchType === 'car' ? 'default' : 'outline'}
          size="sm"
          className={cn(
            "flex-1 transition-all duration-200",
            searchType === 'car' 
              ? 'bg-primary text-white hover:bg-primary' 
              : 'border-gray-200 text-gray-500 hover:border-white hover:text-white'
          )}
          onClick={() => handleTypeChange('car')}
          disabled={!isAdmin}
        >
          차량 별
        </Button>
        }
      </div> 
      
      {/* Search Input */}
      <div className="relative mt-1">
        <Input
          placeholder={`차량 관리번호로 검색`}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
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
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-md mt-1">
        {searchType === 'biz' 
          ? '업체 명으로 검색하여 해당 업체의 차량 목록을 확인할 수 있습니다' 
          : '차량 관리번호로 검색하여 해당 차량 목록을 확인할 수 있습니다'
        }
      </div>
    </>
  );
};

export default HistorySearch; 