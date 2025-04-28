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
import { Calendar, ChevronLeft, ChevronRight, Download, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import driveService from "@/libs/apis/driveApi";
import { calculateDriveDuration } from "@/libs/utils/historyUtils";

function HistoryTable() {
  const navigate = useNavigate();
  const { driveResults, isLoading, setDriveResults, selectedCar } = useDriveListStore();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 3));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await driveService.getDriveBySearchFilter(
        searchTerm,
        selectedCar?.carMdn || "",
        {
          sDate: startDate,
          eDate: endDate
        },
        currentPage - 1,
        itemsPerPage
      );
      setDriveResults(response.data);
    } catch (error) {
      console.error('데이터 조회 오류:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, startDate, endDate, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setStartDate(subMonths(new Date(), 3));
    setEndDate(new Date());
    setSearchTerm("");
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

  return (
    <div className="h-full flex flex-col">
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
        <div className="relative">
          <div className="sticky top-0 z-10 bg-white">
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
            </Table>
          </div>
        </div>
        <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
          <Table>
            <TableBody>
              {driveResults?.map((drive) => (
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
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <div className="text-sm text-gray-500">
          총 {driveResults?.length || 0}건 중 {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, driveResults?.length || 0)}건 표시
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
            {currentPage} / {Math.ceil((driveResults?.length || 0) / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil((driveResults?.length || 0) / itemsPerPage), prev + 1))}
            disabled={currentPage === Math.ceil((driveResults?.length || 0) / itemsPerPage)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HistoryTable; 