import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useInfoStore } from '@/stores/useInfoStore';
import rentApiService from '@/libs/apis/rentsApi';
import carApiService from '@/libs/apis/carApi';
import { mockRentDetails, mockCarDetail, mockTrips } from '@/constants/mocks/infoMockData';

function InfoSearchSection() {
  const [searchText, setSearchText] = useState('');
  const { setInfo } = useInfoStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setInfo({ error: '예약 ID를 입력해주세요.', rent: null, car: null, trips: [] });
      return;
    }

    setInfo({ isLoading: true, error: null });

    // 개발 환경에서는 mock 데이터 사용
    if (import.meta.env.DEV) {
      // 검색 시뮬레이션을 위한 타임아웃 설정
      setTimeout(() => {
        // 입력된 검색어와 일치하는 예약 찾기
        const foundRent = mockRentDetails.find(rent => 
          rent.rent_uuid.toLowerCase().includes(searchText.toLowerCase())
        );

        if (foundRent) {
          setInfo({
            rent: foundRent,
            car: mockCarDetail,
            trips: mockTrips,
            isLoading: false,
            error: null
          });
        } else {
          setInfo({
            error: '해당 예약 정보를 찾을 수 없습니다.',
            rent: null,
            car: null,
            trips: [],
            isLoading: false
          });
        }
      }, 800); // 검색 지연 시뮬레이션
    } else {
      // 실제 API 호출 로직
      try {
        // 예약 정보 조회
        const rentData = await rentApiService.searchByRentUuidDetail(searchText);
        
        if (!rentData || !rentData.rent) {
          setInfo({ 
            error: '해당 예약 정보를 찾을 수 없습니다.', 
            rent: null, 
            car: null, 
            trips: [],
            isLoading: false 
          });
          return;
        }

        // 차량 정보 조회
        const carData = await carApiService.searchOneByMdnDetail(rentData.rent.mdn);
        
        // 상태 업데이트
        setInfo({
          rent: rentData.rent,
          car: carData.car,
          trips: rentData.trips || [],
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('검색 오류:', error);
        setInfo({ 
          error: '정보를 불러오는 중 오류가 발생했습니다.', 
          rent: null, 
          car: null, 
          trips: [],
          isLoading: false 
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const { isLoading, error } = useInfoStore();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      <div className="md:flex md:justify-between md:items-start">
        <div className="md:max-w-md mb-4 md:mb-0 md:mr-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">예약 ID로 조회하기</h2>
          <p className="text-sm text-gray-600">
            예약 시 제공받은 예약 ID를 입력하여 예약 정보를 확인할 수 있습니다.
            {import.meta.env.DEV && (
              <span className="block mt-1 text-blue-600 text-xs">
                (개발 모드: 사용 가능한 예약 ID: RT123456, RT789012, RT345678, RT901234)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row md:w-2/5 gap-2">
          <Input
            placeholder="예약 ID를 입력하세요"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-black hover:bg-gray-800 text-white h-10 mt-2 sm:mt-0"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <SearchIcon className="h-4 w-4 mr-2" />
            )}
            <span className="text-sm">조회하기</span>
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

export default InfoSearchSection; 