import RealTimeMap from "./RealTimeMap";
import { useState } from 'react';
import RealTimeMapSearch from "./RealTimeMapSearch";
import { Search } from "lucide-react";
import RealTimeClock from './RealTimeClock';

function HistoryRealTime() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Mock data for vehicles
  const vehicles = [
    { id: 1, name: '차량 1', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '차량 2', lat: 37.5666, lng: 126.9781 },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <RealTimeMap vehicles={vehicles} />

      {/* Search UI */}
      <div className="z-[1000] absolute top-3 left-3">
        {/* 돋보기 버튼 */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={`flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 ${
            isSearchOpen ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}
        >
          <Search className="h-4 w-4 text-gray-600" />
        </button>

        {/* 검색 패널 */}
        <div
          className={`absolute top-0 left-0 bg-white rounded-lg shadow-lg transition-all duration-300 origin-top-left ${
            isSearchOpen
              ? 'opacity-100 visible scale-100'
              : 'opacity-0 invisible scale-95'
          }`}
        >
          <div className="p-3">
            <RealTimeMapSearch onToggle={() => setIsSearchOpen(false)} />
          </div>
        </div>
      </div>

      {/* 현재 시간 정보 */}
      <RealTimeClock />
    </div>
  );
}

export default HistoryRealTime;
