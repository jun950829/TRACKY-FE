import { Search, ChevronLeft, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import realtimeApi from '@/libs/apis/realtimeApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDrivingTimeSmart } from '@/libs/utils/utils';
import { CarStatusLabels } from '@/constants/types/types';

interface RealTimeSearchPanelProps {
  onToggle: () => void;
  setSelectedDriveId: (driveId : number) => void;
  goDetail: () => void;
}

type SortField = 'status' | 'carPlate' | 'drivingTime';
type SortOrder = 'asc' | 'desc';

interface RunningCar  {
  id: number;
  mdn: string;
  carPlate: string;
  renterName: string;
  distance: number;
  drivingTime: number;
  status: string;
  bizName: string;
}

function RealTimeSearchPanel({ onToggle, setSelectedDriveId, goDetail }: RealTimeSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBizQuery, setSearchBizQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('drivingTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [runningCarList, setRunningCarList] = useState<RunningCar[]>([]);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  useEffect(() => {
    fetchRealtimeData("");
  }, []);

  const fetchRealtimeData = async (search : string) => {
    let response;
    try {
      if(isAdmin) { 
        response = await realtimeApi.getRealtimeAdminData(searchBizQuery, search);
      } else {
        response = await realtimeApi.getRealtimeData(search);
      }
      //setRunningCarList(response.data);
      setRunningCarList(response.data.filter((car: RunningCar) => car.drivingTime >= 60));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-3 w-3 text-blue-600" /> : 
      <ChevronDown className="h-3 w-3 text-blue-600" />;
  };

  const sortedRunningCarList = [...runningCarList].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    return ((aValue as unknown as number) - (bValue as unknown as number)) * modifier;
  });

  const handleSearch = () => {
    if(searchBizQuery != "") {
      fetchRealtimeData(searchQuery);
    } else {
      fetchRealtimeData(searchQuery);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="flex items-start">
      <div className="w-[360px] flex flex-col gap-2">
        {isAdmin && (
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <Input
            className="pl-8 pr-3 py-1 w-full h-8 text-sm"
            placeholder="업체명으로 검색"
            value={searchBizQuery}
            onChange={(e) => setSearchBizQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          </div>
        )}

        {/* 검색 입력 */}
        <div className="relative flex flex-row gap-2">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <Input
            className="pl-8 pr-3 py-1 w-3/4 h-8 text-sm"
            placeholder="차량번호, 관리번호로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button variant="outline" size="sm" className="w-1/4 h-8 bg-primary text-white text-sm" onClick={handleSearch}>검색</Button>
        </div>

        {/* 상태 요약 */}
        <div className="flex gap-2 text-xs text-gray-600 px-0.5">
          <span className="font-medium">총 {runningCarList.length}대 운행중 | 약 1~3분의 지연이 있는 준 실시간 서비스 </span>
        </div>

        {/* 테이블 */}
        <div className="border rounded-lg overflow-hidden max-h-[50vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-3 py-1.5 text-left font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                  >
                    상태
                  </Button>
                </th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                    onClick={() => handleSort('carPlate')}
                  >
                    차량번호 {getSortIcon('carPlate')}
                  </Button>
                </th>
                <th className="px-2 py-1.5 text-right font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                    onClick={() => handleSort('drivingTime')}
                  >
                    운행시간 {getSortIcon('drivingTime')}
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="max-h-[300px] overflow-y-auto divide-y text-sm">
              {sortedRunningCarList.map((runningCar, index) => (
                <tr 
                  key={index}
                  onClick={() => {
                    setSelectedDriveId(runningCar.id) 
                    goDetail()
                  }}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-3 py-1.5">
                    <span className="text-red-500 text-xs font-medium">
                      {CarStatusLabels[runningCar.status as keyof typeof CarStatusLabels]}
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <div>
                      <div className="font-medium text-sm">{runningCar.carPlate}</div>
                      <div className="text-xs text-gray-600">{runningCar.renterName} | {isAdmin ? runningCar.bizName : runningCar.mdn}</div>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <div className="text-xs font-medium">{formatDrivingTimeSmart(runningCar.drivingTime)}</div>
                    {/* <div className="text-xs text-gray-500">{runningCar.distance}km 운행</div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        <ChevronLeft className="h-3 w-3 text-gray-600" />
      </button>
    </div>
  );
}

export default RealTimeSearchPanel;
