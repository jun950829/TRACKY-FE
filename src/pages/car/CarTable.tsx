import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CarDetailTypes,  } from "@/constants/types";
import { useState } from "react";
import CarDetailModal from "./CarDetailModal";
import carApiService from "@/libs/apis/carApi";

// const statusColor = {
//   '운행중': 'bg-green-100 text-green-800',
//   '정비중': 'bg-yellow-100 text-yellow-800',
// };

type CarTableProps = {
  carList: CarDetailTypes[];
}


function CarTable({ carList }: CarTableProps) {
  const [selectedCarData, setSelectedCarData] = useState<CarDetailTypes | null>(null);

  const handleCellClick = async (id: number) => {
    const carData = await searchCarDataById(id);
    console.log('carData :', carData);
  };

  const handleCloseModal = () => {
    setSelectedCarData(null);
  };

  async function searchCarDataById(id: number) {
    const res = await carApiService.searchById(id);
    console.log('searchById :', res);
    setSelectedCarData(res);
  }

  return (
    <div className="w-full h-full bg-white shadow-sm p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>차량 번호</TableHead>
            <TableHead>차량 모델</TableHead>
            <TableHead>차량 번호판</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carList.map((car) => (
            <TableRow key={car.id}>
              <TableCell
                onClick={() => handleCellClick(car.id)}
                className="cursor-pointer hover:text-blue-600 hover:underline"
              >{car.mdn}</TableCell>
              <TableCell>{car.carType}</TableCell>
              <TableCell>{car.carPlate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="link" className="text-blue-600 px-0">수정</Button>
                <Button variant="link" className="text-red-600 px-0">삭제</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>총 20건 중 1 - 10 표시</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <Button variant="outline" size="sm">1</Button>
            </PaginationItem>
            <PaginationItem>
              <Button variant="ghost" size="sm">2</Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* 차량 상세 모달 */}
      {selectedCarData && (
        <CarDetailModal
          isOpen={true}
          onClose={handleCloseModal}
          carData={selectedCarData}
        />
      )}
    </div>


  );
}

export default CarTable;