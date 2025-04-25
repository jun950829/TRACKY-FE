import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { cn } from "@/libs/utils/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";
import { getStatusBadgeClass, getStatusLabel } from "@/libs/utils/getClassUtils";

function HistoryTable() {
  const navigate = useNavigate();
  const { driveResults, isLoading } = useDriveListStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const [filterType, setFilterType] = useState<string>("all");
  const itemsPerPage = 10;

  const filteredData = React.useMemo(() => {
    if (!driveResults) return [];
    
    let filtered = [...driveResults];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((drive) => 
        drive.id.toString().toLowerCase().includes(term) ||
        (drive.renterName && drive.renterName.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [driveResults, date, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDate({
      from: subDays(new Date(), 90),
      to: new Date(),
    });
    setSearchTerm("");
    setFilterType("all");
    setCurrentPage(1);
  };

  const clickDrive = (driveId: number) => {
    navigate(`/history/${driveId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (driveResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        운행 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "yyyy.MM.dd", { locale: ko })} -{" "}
                        {format(date.to, "yyyy.MM.dd", { locale: ko })}
                      </>
                    ) : (
                      format(date.from, "yyyy.MM.dd", { locale: ko })
                    )
                  ) : (
                    <span>날짜 선택</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="business">업무</SelectItem>
                <SelectItem value="personal">개인</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="사용자/차량번호 검색"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9 w-[200px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px]">운행 ID</TableHead>
              <TableHead className="w-[120px]">운행일자</TableHead>
              <TableHead className="w-[120px]">운행목적</TableHead>
              <TableHead className="w-[150px]">차량번호(MDN)</TableHead>
              <TableHead className="w-[120px]">사용자</TableHead>
              <TableHead className="w-[120px]">운행거리(km)</TableHead>
              <TableHead className="w-[120px]">운행시간</TableHead>
              <TableHead>도착지</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((drive) => (
              <TableRow 
                key={drive.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => clickDrive(drive.id)}
              >
                <TableCell className="font-medium">{drive.id}</TableCell>
                <TableCell>
                  {format(new Date(drive.driveOnTime), 'yy.MM.dd(E)', { locale: ko })}
                </TableCell>
                <TableCell>{drive.purpose || '기타업무'}</TableCell>
                <TableCell>{drive.carPlate}({drive.mdn})</TableCell>
                <TableCell>{drive.renterName}</TableCell>
                <TableCell>{(drive.driveDistance || 0).toFixed(1)}</TableCell>
                <TableCell>
                  {calculateDriveDuration(drive.driveOnTime, drive.driveOffTime)}
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {drive.driveEndLat && drive.driveEndLon ? (
                    <span className="text-gray-600">
                      {drive.driveEndLat}, {drive.driveEndLon}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          총 {filteredData.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredData.length)}건 표시
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable; 