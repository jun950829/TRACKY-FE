import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface RealTimeDrivePanelProps {
  carNumber: string;
  onToggle: () => void;
}

interface Cardetail {
  carNumber: string;
  date: string;
  location: string;
  driver: string;
  time: number;
  startTime: string;
  distance: number;
}

function RealTimeDrivePanel({ carNumber, onToggle }: RealTimeDrivePanelProps) {
  const [cardetails] = useState<Cardetail[]>([
    {
      carNumber: '15가 1234',
      date: '25.04.21(월)',
      location: '경기도 여주시 북내면',
      driver: '박부장 (부장/서비스지원부)',
      time: 78,
      startTime: '14시 32분',
      distance: 43.204,
    },
    {
      carNumber: '59나 5959',
      date: '25.04.20(일)',
      location: '서울특별시 강남구',
      driver: '구지투',
      time: 22,
      startTime: '13시 10분',
      distance: 10.254,
    },
  ]);

  const matched = cardetails.find((c) => c.carNumber === carNumber);

  if (!matched) {
    return <div className="p-4 text-gray-500">운행 정보가 없습니다.</div>;
  }

  return (
    <div className="flex items-start">
      <div className="w-[360px] bg-white border rounded-lg shadow-sm text-sm">
        <table className="w-full">
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행일자</td>
              <td className="px-4 py-2 text-gray-900">{matched.date}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">출발지</td>
              <td className="px-4 py-2 text-gray-900">{matched.location}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운전자</td>
              <td className="px-4 py-2 text-gray-900">
                {matched.driver}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행시간</td>
              <td className="px-4 py-2 text-gray-900">
                {matched.time}분
                <span className="ml-2 text-sm text-gray-500">({matched.startTime} 시작)</span>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">운행거리</td>
              <td className="px-4 py-2 text-gray-900">{matched.distance.toFixed(3)}km</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

export default RealTimeDrivePanel;
