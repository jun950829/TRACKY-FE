import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Search as SearchIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RentSearchLayerProps = {
  onSearch: (searchText: string) => void;
}

function RentSearchLayer({ onSearch }: RentSearchLayerProps) {
  const [date, setDate] = useState<Date | undefined>();
  // eslint-disable-next-line
  const [status, setStatus] = useState<string | undefined>();
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function search() {
    onSearch(searchRef.current?.value || '');
  }

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="bg-white border-b">
      {/* PC 뷰 */}
      <div className="hidden md:flex items-center justify-between p-4 lg:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="렌트 정보 검색"
            className="w-64"
            ref={searchRef}
            onKeyDown={handleKeyDown}
          />

          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="렌트 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="예약">예약</SelectItem>
              <SelectItem value="진행중">진행중</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
              <SelectItem value="취소">취소</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "날짜 선택"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ko}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button className="bg-black text-white hover:bg-gray-800" onClick={() => search()}>
            <SearchIcon className="h-4 w-4 mr-2" />
            검색
          </Button>
        </div>

        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => navigate('/rents/register')}>
          <Plus className="w-4 h-4 mr-2" />
          신규 렌트 등록
        </Button>
      </div>

      {/* 모바일 뷰 */}
      <div className="md:hidden p-4">
        <div className="flex mb-4">
          <Input
            placeholder="렌트 정보 검색"
            className="rounded-r-none"
            ref={searchRef}
            onKeyDown={handleKeyDown}
          />
          <Button 
            className="bg-black text-white hover:bg-gray-800 rounded-l-none px-3"
            onClick={() => search()}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Select onValueChange={setStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="렌트 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="예약">예약</SelectItem>
              <SelectItem value="진행중">진행중</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
              <SelectItem value="취소">취소</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy-MM-dd") : "날짜"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ko}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <Button 
          className="bg-black text-white hover:bg-gray-800 w-full" 
          onClick={() => navigate('/rents/register')}
        >
          <Plus className="w-4 h-4 mr-2" />
          신규 렌트 등록
        </Button>
      </div>
    </div>
  );
}

export default RentSearchLayer;
