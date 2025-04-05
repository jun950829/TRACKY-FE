import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CarDetailTypes,  } from "@/constants/types";
import { useState } from "react";
import CarDetailModal from "./CarDetailModal";
import carApiService from "@/libs/apis/carApi";
import CarUpdateModal from "./CarUpdateModal";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";

const statusColor = {
  '운행중': 'bg-green-100 text-green-800',
  '정비중': 'bg-yellow-100 text-yellow-800',
  '대기중': 'bg-blue-100 text-blue-800',
  // 기본값
  'default': 'bg-gray-100 text-gray-800'
};

type CarTableProps = {
  carList: CarDetailTypes[];
  setCarList: (carList: CarDetailTypes[]) => void;
  isLoading?: boolean;
}

function CarTable({ carList, setCarList, isLoading = false }: CarTableProps) {
  const [selectedCarData, setSelectedCarData] = useState<CarDetailTypes | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();

  const handleCellClick = async (mdn: string) => {
    const carData = await searchCarDataByMdn(mdn);
    console.log('carData :', carData);
  };

  const handleCloseModal = () => {
    setIsDetail(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedCarData(null);
    setIsUpdate(false);
    navigate("/cars");
  };

  async function searchCarDataByMdn(mdn: string) {
    const res = await carApiService.searchOneByMdnDetail(mdn);
    console.log('searchOneByMdn :', res.data);
    setSelectedCarData(res.data);
  }

  async function deleteCarData(mdn: string) {
    const res = await carApiService.deleteCar(mdn);
    console.log('deleteCarData :', res.data);
    if(res.status === 200) {
      carList = carList.filter((car) => car.mdn !== mdn);
      setCarList(carList);
    }

    alert('삭제되었습니다.');
  }

  // 상태에 따른 색상 클래스 반환
  const getStatusClass = (status: string) => {
    return statusColor[status as keyof typeof statusColor] || statusColor.default;
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  // 데이터 없음 표시
  if (carList.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">차량 정보가 없습니다.</p>
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
              <TableHead className="w-12">차량 상태</TableHead>
              <TableHead className="w-16">사용 목적</TableHead>
              <TableHead className="w-16">차량 번호</TableHead>
              <TableHead className="w-20">차량 모델</TableHead>
              <TableHead className="w-24">차량 번호판</TableHead>
              <TableHead className="text-right w-60">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carList.map((car, idx) => (
              <TableRow key={idx} className="hover:bg-gray-50">
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(car.status)}`}>
                    {car.status}
                  </span>
                </TableCell>
                <TableCell>{car.purpose}</TableCell>
                <TableCell
                  onClick={() => {
                    setIsDetail(true);
                    handleCellClick(car.mdn)
                  }}
                  className="cursor-pointer hover:text-blue-600 hover:underline font-medium"
                >{car.mdn}</TableCell>
                <TableCell>{car.carType}</TableCell>
                <TableCell>{car.carPlate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <CustomButton 
                      variant="edit" 
                      size="sm" 
                      className="h-8"
                      icon={<Edit className="h-4 w-4" />}
                      onClick={() => {
                        setIsUpdate(true);
                        setSelectedCarData(car);
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
                        setSelectedCarData(car);
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
        {carList.map((car, idx) => (
          <Card key={idx} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(car.status)}`}>
                      {car.status}
                    </span>
                    <h3 
                      className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                      onClick={() => {
                        setIsDetail(true);
                        handleCellClick(car.mdn);
                      }}
                    >
                      {car.mdn}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm">{car.carType}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-md">
                  <p className="text-sm text-gray-700">{car.purpose}</p>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-gray-500">번호판</span>
                  <span>{car.carPlate}</span>
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
                    setSelectedCarData(car);
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
                    setSelectedCarData(car);
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
        <div className="mb-4 sm:mb-0 w-[80px]">총 {carList.length}건</div>
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

      {/* 차량 상세 모달 */}
      {selectedCarData && isDetail && (
        <CarDetailModal
          isOpen={true}
          onClose={handleCloseModal}
          carData={selectedCarData}
        />
      )}

      {/* 차량 수정 모달 */}
      {selectedCarData && isUpdate && (
      <CarUpdateModal
          isOpen={true}
          closeModal={handleCloseUpdateModal}
          initialData={selectedCarData} 
      />) 
      }

      {selectedCarData && isDelete && (
        <Modal open={isDelete} onClose={() => setIsDelete(false)} title="삭제" description="차량을 삭제하시겠습니까?" confirmText="삭제" onConfirm={() => {
          deleteCarData(selectedCarData.mdn!);
          setIsDelete(false);
        }} />  
      )}
    </div>
  );
}

export default CarTable;