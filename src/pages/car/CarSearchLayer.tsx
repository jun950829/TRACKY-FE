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

type CarSearchLayer = {
  onSearch: (isReload: boolean, searchText?: string, status?: string, purpose?: string) => void;
};

function CarSearchLayer({ onSearch }: CarSearchLayer) {
  const [status, setStatus] = useState<string | undefined>();
  const [purpose] = useState<string | undefined>();
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  function search() {
    // searchRef.current가 아닌 state 값 사용
    const searchText = searchValue;

    // "all" 옵션이 선택되면 해당 필터는 undefined로 처리
    const statusFilter = status === "all" ? undefined : status;
    const purposeFilter = purpose === "all" ? undefined : purpose;

    console.log("검색 요청:", {
      searchText: searchText,
      status: statusFilter,
      purpose: purposeFilter,
    });

    onSearch(false, searchText, statusFilter, purposeFilter);
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

  return (
    <div className="bg-white border-b">
      {/* PC 뷰 */}
      <div className="hidden md:flex items-center justify-between p-4 lg:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="차량 관리번호 검색"
            className="w-64"
            value={searchValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="차량 상태" />
            </SelectTrigger>
            <SelectContent>
              {CarStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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

        <div className="flex items-center gap-2 mb-4">
          <Select onValueChange={setStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="차량 상태" />
            </SelectTrigger>
            <SelectContent>
              {CarStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
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
