import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RentDetailTypes } from "@/constants/types";
import rentApiService from "@/libs/apis/rentsApi";
import { useState } from "react";
import RentDetailModal from "./RentDetailModal";
import { formatDateTime } from "@/libs/utils/utils";

type RentTableProps = {
    rentList: RentDetailTypes[];
}

function RentTable({ rentList}: RentTableProps) {
    const [selectedRentData, setSelectedRentData] = useState<RentDetailTypes | null>(null);


    const handleCellClick = async (rentUuid: string) => {
        // const rentData = await searchRentDataByUuid(rentUuid);
        // console.log('rentData :', rentData);
      };
    
      const handleCloseModal = () => {
        setSelectedRentData(null);
      };
    
      async function searchRentDataByUuid(rentUuid: string) {
        const res = await rentApiService.searchByUuid(rentUuid);
        console.log('searchByUuid :', res.data);
        setSelectedRentData(res.data);
      }
    
      return (
        <div className="w-full h-full bg-white shadow-sm p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>예약 번호</TableHead>
                <TableHead>차량 번호</TableHead>
                <TableHead>대여 기간</TableHead>
                <TableHead>예약 상태</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentList.map((rent) => (
                <TableRow key={rent.id}>
                  <TableCell
                    onClick={() => handleCellClick(rent.rent_uuid)}
                    className="cursor-pointer hover:text-blue-600 hover:underline"
                  >{rent.rent_uuid}</TableCell>
                  <TableCell>{rent.mdn}</TableCell>
                  <TableCell>{formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}</TableCell>
                  <TableCell>{rent.rentStatus}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* <Button variant="link" className="text-blue-600 px-0">수정</Button>
                    <Button variant="link" className="text-red-600 px-0">삭제</Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
    
          {/* Pagination
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
          </div> */}
    
          {/* 대여 상세 모달 */}
          {selectedRentData && (
            <RentDetailModal
              isOpen={true}
              onClose={handleCloseModal}
              rentData={selectedRentData}
            />
          )}
        </div>
    
      );
    }
    
    export default RentTable;