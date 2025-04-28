import realtimeApi from '@/libs/apis/realtimeApi';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RealTimeDetailPanelProps {
  driveId: number;
  goSearch: () => void;
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

function RealTimeDetailPanel({ driveId, goSearch }: RealTimeDetailPanelProps) {
  const [driveDetail, setDriveDetail] = useState<DriveDetail | null >(null);



	useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await realtimeApi.getRealtimeDetailData(driveId);
        setDriveDetail(result.data);
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
        onClick={goSearch}
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
        onClick={goSearch}
        className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

export default RealTimeDetailPanel;
