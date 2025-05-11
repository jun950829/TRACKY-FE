import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BizList, BizStatistic } from "@/constants/mocks/adminStaticsMockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";
import { is, ko } from "date-fns/locale";

interface BizStatisticTableProps {
  data: BizList[];
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  selectedBiz: string;
  setSelectedBiz: (selectedBiz: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (selectedDate: Date | undefined) => void;
}

function BizStatisticTable({ data, searchTerm, setSearchTerm, selectedBiz, setSelectedBiz, selectedDate, setSelectedDate }: BizStatisticTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter((item) =>
    item.bizName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="업체명 검색"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜 선택"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={ko}
              defaultMonth={selectedDate || undefined}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">업체명</th>
              <th className="p-4 text-left font-medium">전체 차량</th>
              <th className="p-4 text-left font-medium">운행 중</th>
              <th className="p-4 text-left font-medium">오류</th>
              <th className="p-4 text-left font-medium">상세</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => {
              let isSelected = false;
              if(idx == 0 && selectedBiz == '') isSelected = true;
              else isSelected = selectedBiz === item.bizName;

              return (
                <tr
                  key={idx}
                  className={`
                    border-b
                    hover:cursor-pointer
                    hover:bg-gray-100
                    ${isSelected ? "bg-gray-100" : ""}
                  `}
                  onClick={() => {
                      if(idx === 0) setSelectedBiz('');
                      else setSelectedBiz(item.bizName);
                    }
                  }
                >
                  <td className="p-4">{item.bizName}</td>
                  <td className="p-4">{item.totalCarCount}</td>
                  <td className="p-4">{item.drivingCarCount}</td>
                  <td className="p-4">{item.skipCount}</td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBiz(item.bizName)}
                    >
                      보기
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} 업체
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BizStatisticTable;
