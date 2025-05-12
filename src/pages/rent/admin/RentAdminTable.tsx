// import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RentDetailTypes } from "@/constants/types/types";
import rentApiService from "@/libs/apis/rentsApi";
import { useState } from "react";
import RentDetailModal from "../RentDetailModal";
import { formatDateTime } from "@/libs/utils/utils";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";
import RentUpdateModal from "../RentUpdateModal";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import StatusBadge from "@/components/custom/StatusBadge";

type RentTableProps = {
  rentList: RentDetailTypes[];
  setRentList: (rentList: RentDetailTypes[]) => void;
  isLoading?: boolean;
  reload: () => void;
};

function RentAdminTable({ rentList, setRentList, isLoading = false }: RentTableProps) {
  const [selectedRentData, setSelectedRentData] = useState<RentDetailTypes | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();

  const handleCellClick = async (rentUuid: string) => {
    const rentData = await searchRentDataByUuid(rentUuid);
    console.log("rentData :", rentData);
  };

  const handleCloseModal = () => {
    setIsDetail(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedRentData(null);
    setIsUpdate(false);
    navigate("/car/rent");
  };

  // 실제 api req,res
  async function searchRentDataByUuid(rentUuid: string) {
    const res = await rentApiService.searchByRentUuidDetail(rentUuid);
    console.log("searchByUuid :", res.data);
    setSelectedRentData(res.data);
  }

  async function deleteRentData(rentUuid: string) {
    const res = await rentApiService.deleteRent(rentUuid);
    if (res.status === 200) {
      rentList = rentList.filter((rent) => rent.rent_uuid != rentUuid);
      setRentList(rentList);
    }
    alert("삭제되었습니다.");
  }

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* PC 화면용 테이블 */}
      <div className="hidden md:block overflow-auto shadow-sm bg-white">
        <div className="relative">
          <div className="sticky top-0 z-10 bg-white">
            <Table className="w-full" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                  <TableHead style={{ width: '80px' }} className="text-center text-gray-600 font-medium">예약 상태</TableHead>
                  <TableHead style={{ width: '100px' }} className="text-gray-600 font-medium">예약 번호</TableHead>
                  <TableHead style={{ width: '100px' }} className="text-gray-600 font-medium">업체명</TableHead>
                  <TableHead style={{ width: '120px' }} className="text-gray-600 font-medium">차량 관리번호</TableHead>
                  <TableHead style={{ width: '160px' }} className="text-gray-600 font-medium">대여 시작 날짜</TableHead>
                  <TableHead style={{ width: '160px' }} className="text-gray-600 font-medium">대여 종료 날짜</TableHead>
                  <TableHead style={{ width: '120px' }} className="text-right text-gray-600 font-medium">관리</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
            <Table style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {rentList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      예약 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {rentList.map((rent) => (
                  <TableRow 
                    key={rent.rent_uuid} 
                    onClick={() => {
                      setIsDetail(true);
                      handleCellClick(rent.rent_uuid);
                    }}
                    className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
                  >
                    <TableCell style={{ width: '80px' }} className="text-center">
                      <div className="flex items-center justify-center">
                        <span onClick={(e) => e.stopPropagation()}>
                          <StatusBadge status={rent.rentStatus} type="rent" />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell style={{ width: '100px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{rent.rent_uuid}</span>
                    </TableCell>
                    <TableCell style={{ width: '100px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{rent.bizName}</span>
                    </TableCell>
                    <TableCell style={{ width: '120px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{rent.mdn}</span>
                    </TableCell>
                    <TableCell style={{ width: '160px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>
                        {formatDateTime(rent.rentStime)}
                      </span>
                    </TableCell>
                    <TableCell style={{ width: '160px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>
                        {formatDateTime(rent.rentEtime)}
                      </span>
                    </TableCell>
                    <TableCell style={{ width: '120px' }} className="text-right">
                      <div className="flex gap-2 justify-end">
                        <CustomButton
                          variant="edit"
                          size="sm"
                          className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                          icon={<Edit className="h-4 w-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsUpdate(true);
                            setSelectedRentData(rent);
                          }}
                        >
                          수정
                        </CustomButton>
                        {rent.rentStatus.toLowerCase() !== "deleted" && (
                          <CustomButton
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                            icon={<Trash className="h-4 w-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDelete(true);
                              setSelectedRentData(rent);
                            }}
                          >
                            삭제
                          </CustomButton>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 모바일 화면용 카드 */}
      <div className="md:hidden space-y-4">
        {rentList.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            예약 정보가 없습니다.
          </div>
        )}
        {rentList.map((rent) => (
          <Card 
            key={rent.rent_uuid} 
            className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between space-x-2">
                    <h3
                      className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                      onClick={() => {
                        setIsDetail(true);
                        handleCellClick(rent.rent_uuid);
                      }}
                    >
                      {rent.rent_uuid}
                    </h3>
                    <StatusBadge status={rent.rentStatus} type="rent" />
                  </div>
                  <p className="text-gray-600 text-sm">차량: {rent.mdn}</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">대여 기간</span>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-700 text-xs">{formatDateTime(rent.rentStime)}</span>
                    <span className="text-gray-700 text-xs">{formatDateTime(rent.rentEtime)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <CustomButton
                  variant="edit"
                  size="sm"
                  className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => {
                    setIsUpdate(true);
                    setSelectedRentData(rent);
                  }}
                >
                  수정
                </CustomButton>
                {rent.rentStatus.toLowerCase() !== "deleted" && (
                  <CustomButton
                    variant="destructive"
                    size="sm"
                  className="flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                  icon={<Trash className="h-4 w-4" />}
                  onClick={() => {
                    setIsDelete(true);
                    setSelectedRentData(rent);
                  }}
                >
                  삭제
                </CustomButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination - 모바일/PC 공통 */}
      {/* <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-4 sm:mb-0 w-[80px]">총 {rentList.length}건</div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <CustomButton variant="outline" size="sm">
                1
              </CustomButton>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div> */}

      {/* 대여 상세 모달 */}
      {isDetail && selectedRentData && (
        <RentDetailModal isOpen={isDetail} onClose={handleCloseModal} rentData={selectedRentData} />
      )}

      {/* 대여 수정 모달 */}
      {isUpdate && selectedRentData && (
        <RentUpdateModal
          isOpen={true}
          closeModal={handleCloseUpdateModal}
          initialData={selectedRentData}
        />
      )}

      {selectedRentData && isDelete && (
        <Modal
          open={isDelete}
          onClose={() => setIsDelete(false)}
          title="삭제"
          description="대여 정보를 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            deleteRentData(selectedRentData.rent_uuid!);
            setIsDelete(false);
          }}
        />
      )}
    </div>
  );
}

export default RentAdminTable;
