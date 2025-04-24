import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarStatus } from "@/constants/datas/status";

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

// 페이지 사이즈 옵션
const PageSizeOptions = [
  { value: "5", label: "5개씩" },
  { value: "10", label: "10개씩" },
  { value: "15", label: "15개씩" },
  { value: "20", label: "20개씩" },
];

type CarSearchLayer = {
  onSearch: (
    isReload: boolean,
    searchText?: string,
    status?: string,
    carType?: string,
    pageSize?: number
  ) => void;
  defaultPageSize?: number;
};

function CarSearchLayer({ onSearch, defaultPageSize = 10 }: CarSearchLayer) {
  const [status, setStatus] = useState<string | undefined>("all");
  const [carType, setCarType] = useState<string | undefined>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
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

        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => navigate("/car/register")}
        >
          <Plus className="w-4 h-4 mr-2" />
          신규 차량 등록
        </Button>
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
    </div>
  );
}

export default CarSearchLayer;
