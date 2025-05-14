import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Search as SearchIcon, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RentStatus } from "@/constants/datas/status";
import { PageSizeOptions } from "@/constants/datas/options";

type RentSearchLayerProps = {
  onSearch: (isReload:boolean, searchBizText?: string, searchText?: string, status?: string, date?: string, size?: number ) => void;
  defaultPageSize?: number;
}

function RentSearchLayer({ onSearch, defaultPageSize = 10 }: RentSearchLayerProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<string | undefined>("all");
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const navigate = useNavigate();
  const searchBizText = "";

  function search() {
    const searchText = searchValue;
    const statusFilter = status === 'all' ? undefined : status;
    const dateFilter = date ? format(date, "yyyy-MM-dd") : undefined;

    onSearch(false, searchBizText, searchText, statusFilter, dateFilter, pageSize);
  }

  // 필터 초기화
  function resetFilters() {
    setSearchValue('');
    setStatus(undefined);
    setDate(undefined);
    
    onSearch(false, undefined, undefined, undefined, undefined, defaultPageSize);
  }

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 페이지 사이즈 변경 핸들러
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
  };

  return (
    <div className="bg-white border-b">
      {/* PC 뷰 */}
      <div className="hidden md:flex items-center justify-between p-4">
        <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
          <Input
            placeholder="예약 ID 검색"
            className="w-36"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="예약 상태" />
            </SelectTrigger>
            <SelectContent>
              {RentStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handlePageSizeChange} defaultValue={String(defaultPageSize)}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="표시 개수" />
            </SelectTrigger>
            <SelectContent>
              {PageSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
                defaultMonth={date || undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2">
            <Button className="bg-black text-white hover:bg-gray-800" onClick={() => search()}>
              <SearchIcon className="h-4 w-4" />
              검색
            </Button>
            
            {(status || date || searchValue) && (
              <Button variant="outline" onClick={resetFilters} size="icon" className="h-9 w-9">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => navigate('/car/rent/register')}>
          <Plus className="w-4 h-4" />
          신규 예약 등록
        </Button>
      </div>

      {/* 모바일 뷰 */}
      <div className="md:hidden p-4">
        <div className="flex mb-4">
          <Input
            placeholder="예약 정보 검색"
            className="rounded-r-none"
            value={searchValue}
            onChange={handleInputChange}
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
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="예약 상태" />
            </SelectTrigger>
            <SelectContent>
              {RentStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handlePageSizeChange} defaultValue={String(defaultPageSize)}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="표시 개수" />
            </SelectTrigger>
            <SelectContent>
              {PageSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
        
        <div className="flex gap-2 mb-4 min-h-[40px]">
          <Button 
            className="bg-black text-white hover:bg-gray-800 flex-1" 
            onClick={() => search()}
          >
            <SearchIcon className="h-4 w-4 mr-2" />
            검색
          </Button>
          
          {(status || date || searchValue) && (
            <Button variant="outline" onClick={resetFilters} size="icon" className="h-10 w-10">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          className="bg-black text-white hover:bg-gray-800 w-full" 
          onClick={() => navigate('/car/rent/register')}
        >
          <Plus className="w-4 h-4 mr-2" />
          신규 예약 등록
        </Button>
      </div>
    </div>
  );
}

export default RentSearchLayer;
