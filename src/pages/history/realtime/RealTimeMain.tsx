import RealTimeMap, { RealTimeMapRef } from "./RealTimeMap";
import { useState, useEffect, useRef } from 'react';
import RealTimeSearchPanel from "./RealTimeSearchPanel";
import RealTimeDetailPanel from "./RealTimeDetailPanel";
import { Search, Monitor } from "lucide-react";
import RealTimeClock from './RealTimeClock';
import { useDriveSse } from "@/hooks/useDriveSse";
import { useSseStore } from "@/stores/useSseStore";
import { useNavigate, useLocation } from 'react-router-dom';

function RealTimeMain() {
  const [isMainOpen, setIsMainOpen] = useState(true);
  const [currentPanel, setCurrentPanel] = useState<'search' | 'detail'>('search');
  const [selectedDriveId, setSelectedDriveId] = useState<number | null>(null);
  const [isRefresh, setIsRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<RealTimeMapRef>(null);

  // SSE 연결 관리
  useDriveSse({ driveId: selectedDriveId || 0 });

  // 패널이 변경될 때 SSE 스토어 초기화
  useEffect(() => {
    if (currentPanel === 'search') {
      useSseStore.getState().clearGpsList();
    }
  }, [currentPanel]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // 페이지 이동 감지 및 정리
  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // location 변경 감지 및 정리
  useEffect(() => {
    if (location.pathname !== '/history/realtime') {
      cleanup();
    }
  }, [location]);

  // 정리 함수
  const cleanup = () => {
    // 지도 컴포넌트의 cleanup 호출
    if (mapRef.current?.cleanup) {
      mapRef.current.cleanup();
    }

    // SSE 연결 해제 및 스토어 초기화
    useSseStore.getState().resetSse();
    useSseStore.getState().clearGpsList();
    
    // 선택된 드라이브 ID 초기화
    setSelectedDriveId(null);
    
    // 패널 상태 초기화
    setCurrentPanel('search');
    setIsMainOpen(true);
  };

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
        <RealTimeMap 
          ref={mapRef}
          selectedDriveId={selectedDriveId} 
          isRefresh={isRefresh} 
          setIsRefresh={setIsRefresh}
        />

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
                goSearch={() => {
                  useSseStore.getState().resetSse();
                  setCurrentPanel('search');
                }}
                setIsRefresh={setIsRefresh}   
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