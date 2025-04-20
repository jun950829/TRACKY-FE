import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHistoryStore } from "@/stores/useHistoryStore";
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
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { addDays, subDays } from "date-fns";
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

function HistoryTable() {
  const navigate = useNavigate();
  
  const { driveResults, setSelectedDriveId } = useHistoryStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 90),
    to: new Date(),
  });
  const [filterType, setFilterType] = useState<string>("all");
  const itemsPerPage = 10;

  // 필터링된 데이터 계산
  const filteredData = React.useMemo(() => {
    if (!driveResults) return [];
    
    let filtered = [...driveResults];

    // // 날짜 필터링
    // if (date?.from && date?.to) {
    //   filtered = filtered.filter((drive) => {
    //     const driveDate = new Date(drive.driveOnTime);
    //     return driveDate >= date.from && driveDate <= addDays(date.to, 1);
    //   });
    // }

    // 검색어 필터링
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((drive) => 
        drive.id.toString().toLowerCase().includes(term) ||
        (drive.renterName && drive.renterName.toLowerCase().includes(term))
      );
    }


    return filtered;
  }, [driveResults, date, searchTerm, filterType]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 검색 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 필터 초기화
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
    console.log("driveId: ", driveId);
    navigate(`/history/${driveId}`);
    setSelectedDriveId(driveId);
  };

  if (!driveResults) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-6">
        <p className="text-gray-500">좌측 목록에서 차량을 선택하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상단 필터/검색 영역 */}
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

      {/* 테이블 */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[30px]">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>운행 ID</TableHead>
              <TableHead>운행일자</TableHead>
              <TableHead>운행목적</TableHead>
              <TableHead>차량번호(MDN)</TableHead>
              <TableHead>사용자</TableHead>
              <TableHead>운행거리(km)</TableHead>
              <TableHead>운행시간</TableHead>
              <TableHead>도착지</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((drive, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="cursor-pointer" onClick={() => clickDrive(drive.id)}>{drive.id}</TableCell>
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
                  <p>{drive.driveEndLat}</p>
                  <p>{drive.driveEndLon}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center">
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
          <select
            className="border rounded-md text-sm px-2 py-1"
            value={itemsPerPage}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setCurrentPage(1);
              // TODO: 페이지 사이즈 변경 처리
            }}
          >
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
            <option value={50}>50개씩 보기</option>
          </select>
          <Button variant="outline" size="sm">
            리스트 설정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable; 