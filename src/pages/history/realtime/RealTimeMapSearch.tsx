import { Search, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RealTimeMapSearchProps {
  isOpen: boolean;
  onToggle: () => void;
}

function RealTimeMapSearch({ isOpen, onToggle }: RealTimeMapSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`flex items-start transition-all duration-300  ${isOpen ? '' : 'hidden'}`}>
      <div className="flex flex-col gap-2">
        {/* 그룹 선택 */}
        <Select>
          <SelectTrigger className="w-full bg-white">
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="pl-9 pr-4 py-2 w-full"
            placeholder="차량번호, 차량명"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 필터 탭 */}
        <div className="flex justify-between text-sm text-gray-600 border-b">
          <div className="flex gap-8">
            <button className="pb-2 border-b-2 border-transparent hover:border-gray-300">
              상태 -
            </button>
            <button className="pb-2 border-b-2 border-transparent hover:border-gray-300">
              차량 -
            </button>
            <button className="pb-2 border-b-2 border-transparent hover:border-gray-300">
              거리 -
            </button>
            <button className="pb-2 border-b-2 border-transparent hover:border-gray-300">
              시간 -
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">운행중</span>
                <span className="font-medium">15가 1234</span>
              </div>
              <div className="text-sm text-gray-600">박부장</div>
            </div>
            <div className="text-right">
              <div className="text-sm">48.36km</div>
              <div className="text-sm">73분 운행</div>
            </div>
          </div>

          <div className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-red-500 text-sm">운행중</span>
                <span className="font-medium">59나 5959</span>
              </div>
              <div className="text-sm text-gray-600">데모</div>
            </div>
            <div className="text-right">
              <div className="text-sm">65.11km</div>
              <div className="text-sm">73분 운행</div>
            </div>
          </div>
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-md ml-2 hover:bg-gray-50"
      >
        {isOpen && 
          <ChevronLeft className="h-4 w-4" />
        }
      </button>
    </div>
  );
}

export default RealTimeMapSearch;
