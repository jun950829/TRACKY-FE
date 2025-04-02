import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RentDetailTypes } from "@/constants/types";
import rentApiService from "@/libs/apis/rentsApi";
import { useState } from "react";
import RentDetailModal from "./RentDetailModal";
import { formatDateTime } from "@/libs/utils/utils";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";

type RentTableProps = {
    rentList: RentDetailTypes[];
    setRentList: (rentList: RentDetailTypes[]) => void;
}

function RentTable({ rentList, setRentList }: RentTableProps) {
    const [selectedRentData, setSelectedRentData] = useState<RentDetailTypes | null>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isDetail, setIsDetail] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const navigate = useNavigate();

    const handleCellClick = async (rentUuid: string) => {
        const rentData = await searchRentDataByUuid(rentUuid);
        console.log('rentData :', rentData);
      };
    
      const handleCloseModal = () => {
        setIsDetail(false);
      };

      // const handleCloseModal = () => {
      //   setSelectedRentData(null);
      // };

      const handleCloseUpdateModal = () => {
        setSelectedRentData(null);
        setIsUpdate(false);
        navigate("/rent");
      };

      // 실제 api req,res
      async function searchRentDataByUuid(rentUuid: string) {
        const res = await rentApiService.searchOneByRentUuid(rentUuid);
        console.log('searchByUuid :', res.data);
        setSelectedRentData(res.data);
      }

      async function deleteRentData(rentUuid: string) {
        const res = await rentApiService.deleteRent(rentUuid);
        console.log('deleterentData : ', res.data);
        if(res.status === 200) {
          rentList = rentList.filter((rent) => rent.rent_uuid != rentUuid);
          setRentList(rentList);
        }
        alert('삭제되었습니다.');
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
                <TableRow key={rent.rent_uuid}>
                  <TableCell
                    onClick={() => {
                      setIsDetail(true);
                      handleCellClick(rent.rent_uuid)}
                    }
                    className="cursor-pointer hover:text-blue-600 hover:underline"
                  >{rent.rent_uuid}</TableCell>
                  <TableCell>{rent.mdn}</TableCell>
                  <TableCell>{formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}</TableCell>
                  <TableCell>{rent.rentStatus}</TableCell>
                  <TableCell className="text-right space-x-2">
                  <Button variant="link" className="text-blue-600 px-0" onClick={() => {
                  setIsUpdate(true);
                  setSelectedRentData(rent);
                }}>수정</Button>
                <Button variant="link" className="text-red-600 px-0" onClick={() => {
                  setIsDelete(true);
                  setSelectedRentData(rent);
                }}>삭제</Button>
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
          {isDetail && selectedRentData && (
            <RentDetailModal
              isOpen={isDetail}
              onClose={handleCloseModal}
              rentData={selectedRentData}
            />
          )}

      {selectedRentData && isDelete && (
        <Modal open={isDelete} onClose={() => setIsDelete(false)} title="삭제" description="대여를 삭제하시겠습니까?" confirmText="삭제" onConfirm={() => {
          deleteRentData(selectedRentData.rent_uuid!);
          setIsDelete(false);
        }} />  
      )}
    </div>
  );
}
    
    export default RentTable;