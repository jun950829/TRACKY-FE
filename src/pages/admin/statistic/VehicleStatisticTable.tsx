import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VehicleStatistic } from "@/constants/mocks/adminStaticsMockData";

interface VehicleStatisticTableProps {
  data: VehicleStatistic[];
}

export default function VehicleStatisticTable({ data }: VehicleStatisticTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter((item) =>
    item.carNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="차량 번호 검색"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">차량 번호</th>
              <th className="p-4 text-left font-medium">차종</th>
              <th className="p-4 text-left font-medium">운행 시간</th>
              <th className="p-4 text-left font-medium">운행 거리</th>
              <th className="p-4 text-left font-medium">평균 속도</th>
              <th className="p-4 text-left font-medium">최고 속도</th>
              <th className="p-4 text-left font-medium">상세</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.carNumber} className="border-b">
                <td className="p-4">{item.carNumber}</td>
                <td className="p-4">{item.carType}</td>
                <td className="p-4">{item.operationTime}</td>
                <td className="p-4">{item.operationDistance}km</td>
                <td className="p-4">{item.averageSpeed}km/h</td>
                <td className="p-4">{item.maxSpeed}km/h</td>
                <td className="p-4">
                  <Button variant="outline" size="sm">
                    보기
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} 차량
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