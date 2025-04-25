import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface NoticeSearchLayerProps {
  onSearch: (isReload: boolean, search?: string, isImportant?: string, size?: number) => void;
  defaultPageSize?: number;
}

function NoticeSearchLayer({ onSearch, defaultPageSize = 10 }: NoticeSearchLayerProps) {
  const [search, setSearch] = useState("");
  const [isImportant, setIsImportant] = useState<string | undefined>(undefined);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleSearch = () => {
    // 현재 컴포넌트의 onSearch 프롭은 부모 컴포넌트(NoticeSection)의 handleSearch를 호출
    onSearch(false, search, isImportant, pageSize);
  };

  const handleReset = () => {
    setSearch("");
    setIsImportant(undefined);
    onSearch(false, "", undefined, pageSize);
  };

  return (
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="제목, 내용 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <Select
            value={isImportant}
            onValueChange={setIsImportant}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="중요도" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="true">중요</SelectItem>
              <SelectItem value="false">일반</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="표시 개수" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5개씩 보기</SelectItem>
              <SelectItem value="10">10개씩 보기</SelectItem>
              <SelectItem value="15">15개씩 보기</SelectItem>
              <SelectItem value="20">20개씩 보기</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 sm:justify-end">
          <Button
            onClick={handleSearch}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 sm:flex-none border-gray-200 hover:border-blue-500 hover:text-blue-600"
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoticeSearchLayer;