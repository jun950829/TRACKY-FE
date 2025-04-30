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
import driveService from "@/libs/apis/driveApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import * as XLSX from 'xlsx';

function HistoryTable() {
  const navigate = useNavigate();
  const { driveResults, isLoading, setSearchText, searchDate, selectedCar, setSearchDate, setCurrentPage, setSelectedDriveId, setDriveDetail } = useDriveListStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(searchDate.sDate);
  const [endDate, setEndDate] = useState<Date>(new Date(searchDate.eDate));
  
  // 다운로드 모달 상태 관리
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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

  // 다운로드 모달 열기
  const openDownloadModal = () => {
    setShowDownloadModal(true);
  };

  // 전체 데이터 다운로드 (서버 API 활용)
  const downloadAllData = async () => {
    try {
      setIsDownloading(true);
      // 현재 검색 조건에 맞는 모든 데이터를 서버에서 다운로드
      
      // const mdn = useDriveListStore.getState().selectedCar?.carMdn || '';
      const mdn = selectedCar?.carMdn || '';
      console.log("요청 차량 mdn: ", mdn)
      const response = await driveService.extractDriveExcel(mdn);
      
      // 파일명 추출
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'drive_history.xlsx';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      // Blob 생성 및 다운로드
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
  };

  // 현재 페이지 데이터만 다운로드 (클라이언트 처리)
  const downloadCurrentPageData = () => {
    try {
      setIsDownloading(true);
      
      // 현재 표시되는 데이터만 사용
      if (!driveResults || driveResults.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }
      
      // CSV 형식으로 데이터 변환
      const headers = [
        'ID', '일자', '목적', '차량번호', '사용자', '운행거리(km)', '운행시간'
      ];

      // 엑셀 데이터 준비
      const excelData = [
        headers, // 첫 번째 행은 헤더
        ...driveResults.map(drive => [
          drive.id,
          format(new Date(drive.driveOnTime), 'yyyy-MM-dd', { locale: ko }),
          drive.purpose || '기타업무',
          drive.carPlate,
          drive.renterName,
          (drive.driveDistance || 0).toFixed(1),
          calculateDriveDuration(drive.driveOnTime, drive.driveOffTime)
        ])
      ];

      // 워크시트 생성
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // 열 너비 설정
      const colWidths = [
        { wch: 10 },  // ID
        { wch: 12 },  // 일자
        { wch: 15 },  // 목적
        { wch: 15 },  // 차량번호
        { wch: 15 },  // 사용자
        { wch: 15 },  // 운행거리
        { wch: 15 }   // 운행시간
      ];
      worksheet['!cols'] = colWidths;
      
      // 워크북 생성 및 워크시트 추가
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '운행기록');
      
      // 파일명 설정
      const today = format(new Date(), 'yyyy-MM-dd');
      const fileName = `차량운행기록_${today}.xlsx`;
      
      // 엑셀 파일 다운로드
      XLSX.writeFile(workbook, fileName);
      
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
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

  if (driveResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        운행 기록이 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* 다운로드 모달 - 커스텀 구현 */}
      <Dialog open={showDownloadModal} onOpenChange={setShowDownloadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>엑셀 다운로드</DialogTitle>
            <DialogDescription>
              어떤 데이터를 다운로드하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={downloadCurrentPageData}
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              현재 페이지만
            </Button>
            <Button 
              onClick={downloadAllData}
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              전체 데이터
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setSearchText(searchTerm)}>
              검색
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openDownloadModal}
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full">
        <div className="hidden md:block overflow-auto shadow-sm bg-white">
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