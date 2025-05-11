import realtimeApi from '@/libs/apis/realtimeApi';
import { useSseStore } from '@/stores/useSseStore';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RealTimeDetailPanelProps {
  driveId: number;
  goSearch: () => void;
  setIsRefresh: (isRefresh: boolean) => void;
}

type GpsPoint = {
  lat: number;
  lon: number;
  spd: number;
  oTime: string;
}

interface DriveDetail {
  id: number;
	mdn: string;
  carPlate: string;
  carName: string;
  date: string;
  renterName: string;
  distance: number;
  drivingTime: string;
  status: string;
  driveOnTime: string;
} 

function RealTimeDetailPanel({ driveId, goSearch, setIsRefresh }: RealTimeDetailPanelProps) {
  const [driveDetail, setDriveDetail] = useState<DriveDetail | null >(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await realtimeApi.getRealtimeDetailData(driveId);
        setDriveDetail(result.data);

        // 초기 GPS 히스토리 데이터 로드
        const now = new Date();
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC + 9시간
        const nowTimeKST = koreaTime.toISOString().split('.')[0];
        const response = await realtimeApi.getRealtimeBeforePath(driveId, nowTimeKST);
        
        // 스토어 초기화 후 히스토리 데이터 설정
        const store = useSseStore.getState();
        store.clearGpsList();
        store.setGpsList(() => response.data);

      } catch (error) {
        console.error("차량 상세 조회 실패:", error);
      }
    };

    fetchDetail();
  }, [driveId]);

  if (!driveDetail) {
    return <div className="flex items-center justify-between h-full w-full">
      <div className="p-4 text-gray-500">운행 정보가 없습니다.</div>
      <button
        onClick={() => {
          goSearch();
          setIsRefresh(true);
          console.log("setIsRefresh(true)");
        }}
        className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div> 
  }

  return (
    <div className="flex items-start">
      <div className="w-[360px] bg-white border rounded-lg shadow-sm text-sm">
        <table className="w-full">
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">차량번호</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.carPlate}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">차량명</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.carName}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행일자</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.date}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운전자</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.renterName}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행시간</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.drivingTime}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행거리</td>
              <td className="px-4 py-2 text-gray-900">{driveDetail.distance.toFixed(1)}km</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={() => {
          useSseStore.getState().resetSse();
          setIsRefresh(true);
          goSearch();
          console.log("setIsRefresh(true)");
          
        }}
        className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

export default RealTimeDetailPanel;
