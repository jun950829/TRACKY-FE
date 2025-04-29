import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { format, subMonths } from "date-fns";
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
import { Calendar, Download, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";
import driveService from "@/libs/apis/driveApi";

function HistoryTable() {
  const navigate = useNavigate();
  const { driveResults, isLoading, setSearchText,  searchDate, setSearchDate,  setCurrentPage, setSelectedDriveId, setDriveDetail } = useDriveListStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(searchDate.sDate);
  const [endDate, setEndDate] = useState<Date>(new Date(searchDate.eDate));

  useEffect(() => {
    setSearchDate({
      sDate: startDate,
      eDate: endDate
    })
    setCurrentPage(0);
  }, [startDate, endDate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchText(searchTerm);
    }
  };

  const resetFilters = () => {
    setStartDate(subMonths(new Date(), 3));
    setEndDate(new Date());
    setSearchTerm("");
  };

  const clickDrive = async (driveId: number) => {
    setSelectedDriveId(driveId);

    try {
      navigate(`/history/${driveId}`);
    } catch (error) {
      console.error("Error fetching drive details:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Filters */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {startDate ? format(startDate, "yyyy.MM.dd", { locale: ko }) : "시작일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => date > endDate}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-gray-500">~</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}>
                    <Calendar className="h-4 w-4 mr-2" />
                    {endDate ? format(endDate, "yyyy.MM.dd", { locale: ko }) : "종료일"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date < startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="사용자 입력"
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                className="pl-9 w-[120px]"
              />
            </div>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setSearchText(searchTerm)}>
              검색
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="hidden md:block overflow-auto rounded-xl shadow-sm bg-white">
          <div className="relative">
            <div className="sticky top-0 z-10 bg-white">
              <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[70px] text-center">운행 ID</TableHead>
                      <TableHead className="w-[100px] text-center">일자</TableHead>
                      <TableHead className="w-[120px] text-center">목적</TableHead>
                      <TableHead className="w-[160px] text-center">차량번호</TableHead>
                      <TableHead className="w-[140px] text-center">사용자</TableHead>
                      <TableHead className="w-[140px] text-center">운행거리(km)</TableHead>
                      <TableHead className="w-[140px] text-center">운행시간</TableHead>
                      <TableHead className="w-[140px] text-center">도착지</TableHead>
                    </TableRow>
                  </TableHeader>
              </Table>
            </div>
          </div>
          <div className="h-[calc(100vh-21rem)] overflow-y-auto">
            <Table>
              <TableBody>
              {driveResults && driveResults.length === 0 ?
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  조회된 데이터가 없습니다.
                </TableCell>
              </TableRow>
              : driveResults?.map((drive) => (
                <TableRow 
                  key={drive.id} 
                  className="hover:bg-gray-50 cursor-pointer text-center"
                  onClick={() => clickDrive(drive.id)}
                >
                  <TableCell className="w-[70px] font-medium">{drive.id}</TableCell>
                  <TableCell className="w-[100px]">
                    {format(new Date(drive.driveOnTime), 'yy.MM.dd(E)', { locale: ko })}
                  </TableCell>
                  <TableCell className="w-[120px]">{drive.purpose || '기타업무'}</TableCell>
                  <TableCell className="w-[160px]">
                    <p>{drive.carPlate}</p>
                    <p className="text-gray-500 text-sm">{drive.mdn}</p>
                  </TableCell>
                  <TableCell className="w-[140px]">{drive.renterName}</TableCell>
                  <TableCell className="w-[140px]">{(drive.driveDistance || 0).toFixed(1)}</TableCell>
                  <TableCell className="w-[140px]">
                    {calculateDriveDuration(drive.driveOnTime, drive.driveOffTime)}
                  </TableCell>
                  <TableCell className="w-[140px] truncate">
                    <span className="text-gray-400">-</span>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable; 