import RealTimeMap from "./RealTimeMap";
import { useState } from 'react';
import RealTimeSearchPanel from "./RealTimeSearchPanel";
import RealTimeDetailPanel from "./RealTimeDetailPanel";
import { Search, Monitor } from "lucide-react";
import RealTimeClock from './RealTimeClock';

function RealTimeMain() {
  const [isMainOpen, setIsMainOpen] = useState(true);
  const [currentPanel, setCurrentPanel] = useState<'search' | 'detail'>('search');
  const [selectedDriveId, setSelectedDriveId] = useState<number | null>(null);

  // 목 데이터 (지도용 차량 정보)
  const vehicles = [
    { id: 1, name: '차량 1', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '차량 2', lat: 37.5666, lng: 126.9781 },
  ];

  return (
    <div className="w-full h-full relative">
      {/* Mobile Only Message */}
      <div className="md:hidden flex flex-col items-center justify-center h-screen p-4 text-center">
        <Monitor className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">PC 전용 페이지</h2>
        <p className="text-gray-600">
          실시간 모니터링 페이지는 PC 환경에서만 이용 가능합니다.
          <br />
          PC로 접속해 주시기 바랍니다.
        </p>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block w-full h-full">
        {/* 지도 */}
        <RealTimeMap vehicles={vehicles} />

        {/* 돋보기 버튼 (검색창이 닫혀있을 때만 보임) */}
        {!isMainOpen && (
          <button
            onClick={() => setIsMainOpen(true)}
            className="z-[1000] absolute top-3 md:left-[6rem] xl:left-3  w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 flex items-center justify-center"
          >
            <Search className="h-4 w-4 text-gray-600" />
          </button>
        )}

        {/* 검색 또는 상세 패널 */}
        <div className={`z-[1000] absolute top-3 md:left-[6rem] xl:left-3 bg-white rounded-lg shadow-lg transition-all duration-300 origin-top-left ${
            isMainOpen
              ? 'opacity-100 visible scale-100'
              : 'opacity-0 invisible scale-95'
          }`}>
          <div className="relative w-[400px] p-3">
            {currentPanel === 'detail' && selectedDriveId ? (
                <RealTimeDetailPanel
                  driveId={selectedDriveId}
                  goSearch={() => setCurrentPanel('search')} // 뒤로가기 시 검색창으로
                />
            ) : (
              <RealTimeSearchPanel
                onToggle={() => setIsMainOpen(false)}
                setSelectedDriveId={setSelectedDriveId}
                goDetail={() => setCurrentPanel('detail')}
              />
            )}
          </div>
        </div>

        {/* 현재 시간 */}
        <RealTimeClock />
      </div>
    </div>
  );
}

export default RealTimeMain;