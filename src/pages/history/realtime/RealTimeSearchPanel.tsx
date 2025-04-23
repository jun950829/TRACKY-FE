import { Search, ChevronLeft, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import realtimeApi from '@/libs/apis/realtimeApi';

interface RealTimeSearchPanelProps {
  onToggle: () => void;
  onSelectCarNumber: (carNumber: string) => void;
}

type SortField = 'status' | 'carNumber' | 'driver' | 'distance' | 'time';
type SortOrder = 'asc' | 'desc';

interface Vehicle {
  id: number;
  status: '운행중' | '정차중';
  carNumber: string;
  driver: string;
  distance: number;
  time: number;
}

interface RunningCar  {
  mdn: string;
  carPlate: string;
  renterName: string;
  distance: number;
  drivingTime: string;
  status: string;
}

function RealTimeSearchPanel({ onToggle, onSelectCarNumber }: RealTimeSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('distance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 예시 데이터
  // const [runningCarList] = useState<Vehicle[]>([
  //   { id: 1, status: '운행중', carNumber: '15가 1234', driver: '박부장', distance: 48.36, time: 73 },
  //   { id: 2, status: '운행중', carNumber: '59나 5959', driver: '데모', distance: 65.11, time: 73 },
  // ]);
  const [runningCarList, setRunningCarList] = useState<RunningCar[]>([]);

  useEffect(() => {
    fetchRealtimeData();
  }, []);

  const fetchRealtimeData = async () => {
    const response = await realtimeApi.getRealtimeData("");
    setRunningCarList(response.data);
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

  // const sortedRunningCarList = [...runningCarList].sort((a, b) => {
  //   const modifier = sortOrder === 'asc' ? 1 : -1;
  //   const aValue = a[sortField];
  //   const bValue = b[sortField];
    
  //   if (typeof aValue === 'string' && typeof bValue === 'string') {
  //     return aValue.localeCompare(bValue) * modifier;
  //   }
  //   return ((aValue as number) - (bValue as number)) * modifier;
  // });
  const sortedRunningCarList = runningCarList;

  return (
    <div className="flex items-start">
      <div className="w-[320px] flex flex-col gap-2">
        {/* 그룹 선택 */}
        <Select>
          <SelectTrigger className="w-full bg-white h-8 text-sm">
            <SelectValue placeholder="그룹 선택 안함" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">그룹 선택 안함</SelectItem>
            <SelectItem value="group1">그룹 1</SelectItem>
            <SelectItem value="group2">그룹 2</SelectItem>
          </SelectContent>
        </Select>

        {/* 검색 입력 */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <Input
            className="pl-8 pr-3 py-1 w-full h-8 text-sm"
            placeholder="차량번호, 차량명"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 상태 요약 */}
        <div className="flex gap-2 text-xs text-gray-600 px-0.5">
          <span className="font-medium">총 {runningCarList.length}대</span>
          <span className="text-gray-400">|</span>
          {/* <span className="text-red-500">운행중 {runningCarList.filter(v => v.status === '운행중').length}대</span> */}
        </div>

        {/* 테이블 */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                    onClick={() => handleSort('status')}
                  >
                    상태 {getSortIcon('status')}
                  </Button>
                </th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                    onClick={() => handleSort('carNumber')}
                  >
                    차량번호 {getSortIcon('carNumber')}
                  </Button>
                </th>
                <th className="px-2 py-1.5 text-right font-medium text-gray-600">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 font-medium text-xs"
                    onClick={() => handleSort('distance')}
                  >
                    거리 {getSortIcon('distance')}
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {sortedRunningCarList.map((runningCar, index) => (
                <tr 
                  key={index}
                  onClick={() => onSelectCarNumber(runningCar.carPlate)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-2 py-1.5">
                    <span className="text-red-500 text-xs font-medium">
                      {runningCar.status}
                    </span>
                  </td>
                  <td className="px-2 py-1.5">
                    <div>
                      <div className="font-medium text-sm">{runningCar.carPlate}</div>
                      <div className="text-xs text-gray-600">{runningCar.renterName}</div>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <div className="text-sm font-medium">{runningCar.distance}km</div>
                    <div className="text-xs text-gray-500">{runningCar.drivingTime}분 운행</div>
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
