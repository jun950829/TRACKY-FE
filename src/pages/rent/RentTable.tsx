// import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RentDetailTypes } from "@/constants/types";
import rentApiService from "@/libs/apis/rentsApi";
import { useState } from "react";
import RentDetailModal from "./RentDetailModal";
import { formatDateTime } from "@/libs/utils/utils";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";
import RentUpdateModal from "./RentUpdateModal";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CustomButton } from "@/components/custom/CustomButton";

type RentTableProps = {
    rentList: RentDetailTypes[];
    setRentList: (rentList: RentDetailTypes[]) => void;
    isLoading?: boolean;
}

function RentTable({ rentList, setRentList, isLoading = false }: RentTableProps) {
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

      const handleCloseUpdateModal = () => {
        setSelectedRentData(null);
        setIsUpdate(false);
        navigate("/rents");
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

      // 로딩 상태 표시
      if (isLoading) {
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
          </div>
        );
      }

      // 데이터 없음 표시
      if (rentList.length === 0) {
        return (
          <div className="text-center py-10">
            <p className="text-gray-500">렌트 정보가 없습니다.</p>
          </div>
        );
      }
    
      return (
        <div className="w-full">
          {/* PC 화면용 테이블 */}
          <div className="hidden md:block overflow-auto">
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
                  <TableRow key={rent.rent_uuid} className="hover:bg-gray-50">
                    <TableCell
                      onClick={() => {
                        setIsDetail(true);
                        handleCellClick(rent.rent_uuid)}
                      }
                      className="cursor-pointer hover:text-blue-600 hover:underline font-medium"
                    >{rent.rent_uuid}</TableCell>
                    <TableCell>{rent.mdn}</TableCell>
                    <TableCell>{formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rent.rentStatus === '예약' ? 'bg-blue-100 text-blue-700' : 
                        rent.rentStatus === '완료' ? 'bg-green-100 text-green-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rent.rentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <CustomButton 
                          variant="edit" 
                          size="sm" 
                          className="h-8"
                          icon={<Edit className="h-4 w-4" />}
                          onClick={() => {
                            setIsUpdate(true);
                            setSelectedRentData(rent);
                          }}
                        >
                          수정
                        </CustomButton>
                        <CustomButton 
                          variant="destructive" 
                          size="sm" 
                          className="h-8"
                          icon={<Trash className="h-4 w-4" />}
                          onClick={() => {
                            setIsDelete(true);
                            setSelectedRentData(rent);
                          }}
                        >
                          삭제
                        </CustomButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 화면용 카드 */}
          <div className="md:hidden space-y-4">
            {rentList.map((rent) => (
              <Card key={rent.rent_uuid} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 
                          className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            setIsDetail(true);
                            handleCellClick(rent.rent_uuid);
                          }}
                        >
                          {rent.rent_uuid.substring(0, 8)}...
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rent.rentStatus === '예약' ? 'bg-blue-100 text-blue-700' : 
                          rent.rentStatus === '완료' ? 'bg-green-100 text-green-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {rent.rentStatus}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">차량: {rent.mdn}</p>
                    </div>
                    <div className="relative">
                      <CustomButton 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setIsDetail(true);
                          handleCellClick(rent.rent_uuid);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </CustomButton>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-500">대여 기간</span>
                      <span className="text-xs">{formatDateTime(rent.rentStime)} ~ {formatDateTime(rent.rentEtime)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <CustomButton 
                      variant="edit" 
                      size="sm" 
                      className="flex-1 h-8"
                      icon={<Edit className="h-4 w-4" />}
                      onClick={() => {
                        setIsUpdate(true);
                        setSelectedRentData(rent);
                      }}
                    >
                      수정
                    </CustomButton>
                    <CustomButton 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1 h-8"
                      icon={<Trash className="h-4 w-4" />}
                      onClick={() => {
                        setIsDelete(true);
                        setSelectedRentData(rent);
                      }}
                    >
                      삭제
                    </CustomButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination - 모바일/PC 공통 */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <div className="mb-4 sm:mb-0 w-[80px]">총 {rentList.length}건</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <CustomButton variant="outline" size="sm">1</CustomButton>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
    
          {/* 대여 상세 모달 */}
          {isDetail && selectedRentData && (
            <RentDetailModal
              isOpen={isDetail}
              onClose={handleCloseModal}
              rentData={selectedRentData}
            />
          )}

          {/* 대여 수정 모달 */}
          {isUpdate && selectedRentData && (
            <RentUpdateModal
                isOpen={true}
                closeModal={handleCloseUpdateModal}
                initialData={selectedRentData} 
            />) 
            }

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