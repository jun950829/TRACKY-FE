import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Search as SearchIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarStatus } from "@/constants/datas/status";
import { CustomButton } from "@/components/custom/CustomButton";
import { CarDetailTypes } from "@/constants/types/types";
import carApiService from "@/libs/apis/carApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import * as XLSX from 'xlsx';
import { PageSizeOptions } from "@/constants/datas/options";

// 차량 종류 상수 - DB enum 값과 사용자에게 표시될 레이블 매핑
const CarTypes = [
  { value: "all", label: "전체" },
  { value: "mini", label: "경차" },
  { value: "sedan", label: "세단" },
  { value: "van", label: "밴" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "트럭" },
  { value: "bus", label: "버스" },
  { value: "sports", label: "스포츠카" },
  { value: "etc", label: "기타" },
];

type CarSearchLayer = {
  carList: CarDetailTypes[];
  onSearch: (
    isReload: boolean,
    searchText?: string,
    status?: string,
    carType?: string,
    pageSize?: number
  ) => void;
  defaultPageSize?: number;
};

function CarSearchLayer({ carList, onSearch, defaultPageSize = 10 }: CarSearchLayer) {
  const [status, setStatus] = useState<string | undefined>("all");
  const [carType, setCarType] = useState<string | undefined>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const navigate = useNavigate();

  function search() {
    // searchRef.current가 아닌 state 값 사용
    const searchText = searchValue;

    // "all" 옵션이 선택되면 해당 필터는 undefined로 처리
    const statusFilter = status === "all" ? undefined : status;
    const carTypeFilter = carType === "all" ? undefined : carType;

    console.log("검색 요청:", {
      searchText: searchText,
      status: statusFilter,
      carType: carTypeFilter,
      pageSize: pageSize,
    });

    // status와 carType 모두 검색 요청에 포함
    onSearch(false, searchText, statusFilter, carTypeFilter, pageSize);
  }

  // 엑셀 다운로드 모달 열기
  function openDownloadModal() {
    setIsDownloadModalOpen(true);
  }

  // 전체 데이터 엑셀 다운로드 (기존 기능)
  async function downloadAllData() {
    try {
      setIsDownloading(true);
      await extractExcel();
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
      setIsDownloadModalOpen(false);
    }
  }

  // 현재 페이지 데이터만 CSV로 다운로드
  function downloadCurrentPageData() {
    try {
      setIsDownloading(true);
      
      // 현재 표시되는 데이터만 사용
      if (!carList || carList.length === 0) {
        alert('다운로드할 데이터가 없습니다.');
        return;
      }
      
      // 현재 날짜와 시간을 포함한 파일명 생성
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      // 날짜 형식 YYYY-MM-DD로 포맷팅
      const formattedDate = `${year}-${month}-${day}`;
      
      // 최종 파일명 생성
      const filename = `차량 리스트_현재페이지_${formattedDate}.xlsx`;
      
      // 헤더 행 생성
      const headers = ['관리번호', '차량번호', '차량명', '차종', '상태', '등록일'];
      
      // 데이터 행 생성
      const rows = carList.map(car => [
        car.mdn || '',
        car.carPlate || '',
        car.carName || '',
        car.carType || '',
        car.status || '',
        car.createdAt || ''
      ]);

      // 엑셀 데이터 준비 (헤더 + 데이터 행)
      const excelData = [headers, ...rows];
      
      // 워크시트 생성
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);
      
      // 열 너비 설정
      const colWidths = [
        { wch: 15 }, // 관리번호
        { wch: 15 }, // 차량번호
        { wch: 20 }, // 차량명
        { wch: 12 }, // 차종
        { wch: 12 }, // 상태
        { wch: 20 }  // 등록일
      ];
      worksheet['!cols'] = colWidths;
      
      // 워크북 생성 및 워크시트 추가
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '차량목록');
      
      // 엑셀 파일 다운로드
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
      setIsDownloadModalOpen(false);
    }
  }

  async function extractExcel() {

    const response = await carApiService.extractExcel();

    // 현재 날짜와 시간을 포함한 파일명 생성
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // 날짜 형식 YYYY-MM-DD로 포맷팅
    const formattedDate = `${year}-${month}-${day}`;
    
    // 최종 파일명 생성
    const filename = `차량 리스트_${formattedDate}.xlsx`;
    
    const excelData = response;

    const blob = new Blob([excelData], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    // 다운로드용 URL 생성
    const url = window.URL.createObjectURL(blob);
    
    // 다운로드 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 파일명 설정
    document.body.appendChild(link);
    link.click();
    
    // 메모리 정리
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  // Enter 키 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
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
      <div className="hidden md:flex items-center justify-between p-4 lg:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="번호판, 관리번호 검색"
            className="w-64"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <Select onValueChange={(value) => setStatus(value)} defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CarStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.value === "all" ? "상태 전체" : status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setCarType(value)} defaultValue="all">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CarTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.value === "all" ? "종류 전체" : type.label}
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

          <Button className="bg-black text-white hover:bg-gray-800" onClick={() => search()}>
            <SearchIcon className="h-4 w-4 mr-2" />
            검색
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <CustomButton
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-800"
            onClick={() => openDownloadModal()}
            >
            <Download className="h-4 w-4 mr-2" />
            다운로드
          </CustomButton>

          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => navigate("/car/register")}
          >
            <Plus className="w-4 h-4 mr-2" />
            신규 차량 등록
          </Button>
        </div>
      </div>

      {/* 모바일 뷰 */}
      <div className="md:hidden p-4">
        <div className="flex mb-4">
          <Input
            placeholder="차량 관리번호 검색"
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

        <div className="flex items-center gap-2 mb-3">
          <Select onValueChange={(value) => setStatus(value)} defaultValue="all">
            <SelectTrigger className="flex-1 border-blue-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CarStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.value === "all" ? "상태 전체" : status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setCarType(value)} defaultValue="all">
            <SelectTrigger className="flex-1 border-green-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CarTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.value === "all" ? "종류 전체" : type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center mb-4">
          <Select onValueChange={handlePageSizeChange} defaultValue={String(defaultPageSize)}>
            <SelectTrigger className="flex-1">
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
        </div>

        <Button
          className="bg-black text-white hover:bg-gray-800 w-full"
          onClick={() => navigate("/car/register")}
        >
          <Plus className="w-4 h-4 mr-2" />
          신규 차량 등록
        </Button>
      </div>

        
      {/* 다운로드 모달 */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
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
    </div>
  );
}

export default CarSearchLayer;
