import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type RentSearchLayer = {
  onSearch: (searchText: string) => void;
}

function RentSearchLayer({ onSearch }: RentSearchLayer) {
  const [date, setDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  console.log(date, status);

  function search() {
    console.log('search');
    onSearch(searchRef.current?.value || '');
  }


  return (
    <div className="w-full h-[70px] bg-white flex items-center justify-between px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {/* 검색어 */}
        <Input
          placeholder="UUID 검색"
          className="w-64"
          ref={searchRef}
        />

        {/* 대여 상태 */}
        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="대여 상태" />
          </SelectTrigger>

        </Select>

        {/* 날짜 선택 */}
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

        {/* 검색 버튼 */}
        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => search()}>
          검색
        </Button>
      </div>

      {/* 신규 등록 버튼 */}
      <Button className="bg-black text-white hover:bg-gray-800" onClick={() => navigate('/rents/register')}>
        <Plus className="w-4 h-4 mr-2" />
        신규 예약 등록
      </Button>
    </div>
  );
}

export default RentSearchLayer;
