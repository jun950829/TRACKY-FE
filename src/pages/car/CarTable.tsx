import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CarDetailTypes } from "@/constants/types/types";
import { useState } from "react";
import CarDetailModal from "./CarDetailModal";
import carApiService from "@/libs/apis/carApi";
import CarUpdateModal from "./CarUpdateModal";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import StatusBadge from "@/components/custom/StatusBadge";
import { getCarTypeLabel } from "@/libs/utils/getClassUtils";

type CarTableProps = {
  carList: CarDetailTypes[];
  setCarList: (carList: CarDetailTypes[]) => void;
  isLoading?: boolean;
  reload: (isReload: boolean) => void;
};

function CarTable({ carList, setCarList, isLoading = false, reload }: CarTableProps) {
  const [selectedCarData, setSelectedCarData] = useState<CarDetailTypes | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();

  const handleCellClick = async (mdn: string) => {
    const carData = await searchCarDataByMdn(mdn);
    console.log("carData :", carData);
  };

  const handleCloseModal = () => {
    setIsDetail(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedCarData(null);
    setIsUpdate(false);
    navigate("/car");
  };

  async function searchCarDataByMdn(mdn: string) {
    const res = await carApiService.searchOneByMdnDetail(mdn);
    console.log("searchOneByMdn :", res.data);
    setSelectedCarData(res.data);
  }

  async function deleteCarData(mdn: string) {
    const res = await carApiService.deleteCar({ mdn });

    if (res.status === 200) {
      carList = carList.filter((car) => car.mdn !== mdn);
      setCarList(carList);
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
    <div className="w-full h-full">
      {/* PC 화면용 테이블 */}
      <div className="hidden md:block overflow-auto shadow-sm bg-white">
        <div className="relative">
          {/* 테이블 전체에 table-layout: fixed 적용 */}
          <div className="sticky top-0 z-10 bg-white">
            <div className="w-full" style={{ tableLayout: 'fixed' }}>
              <Table className="w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                    <TableHead className="text-gray-600 font-medium" style={{ width: '40px' }}>상태</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: '64px' }}>차량 번호</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: '48px' }}>종류</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: '64px' }}>차량 관리번호</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: '64px' }}>연식</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium" style={{ width: '160px' }}>관리</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
          </div>
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
            <Table className="w-full" style={{ tableLayout: 'fixed' }}>
              <TableBody>
                {carList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      차량 정보가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {carList.map((car, idx) => (
                  <TableRow
                    key={idx}
                    onClick={() => {
                      setIsDetail(true);
                      handleCellClick(car.mdn);
                    }}
                    className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
                  >
                    <TableCell style={{ width: '40px' }}>
                      <span onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={car.status} type="car" />
                      </span>
                    </TableCell>
                    <TableCell style={{ width: '64px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{car.carPlate}</span>
                    </TableCell>
                    <TableCell style={{ width: '48px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{getCarTypeLabel(car.carType)}</span>
                    </TableCell>
                    <TableCell style={{ width: '64px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{car.mdn}</span>
                    </TableCell>
                    <TableCell style={{ width: '64px' }} className="text-gray-700">
                      <span onClick={(e) => e.stopPropagation()}>{car.carYear}</span>
                    </TableCell>
                    <TableCell className="text-right" style={{ width: '160px' }}>
                      <div className="flex gap-2 justify-end">
                        <CustomButton
                          variant="edit"
                          size="sm"
                          className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                          icon={<Edit className="h-4 w-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsUpdate(true);
                            setSelectedCarData(car);
                          }}
                        >
                          수정
                        </CustomButton>
                        {car.status.toLowerCase() !== "deleted" && (
                          <CustomButton
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDelete(true);
                              setSelectedCarData(car);
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
        {carList.length === 0 && (
          <div className="text-center py-8 text-gray-500">차량 정보가 없습니다.</div>
        )}
        {carList.map((car) => (
          <Card
            key={car.mdn}
            className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent
              onClick={() => {
                setIsDetail(true);
                handleCellClick(car.mdn);
              }}
              className="p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={car.status} type="car" />
                    <h3 className="font-semibold text-gray-800">{car.mdn}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{getCarTypeLabel(car.carType)}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-md">
                  <p className="text-sm text-gray-700">{car.purpose}</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">번호판</span>
                  <span className="text-gray-700">{car.carPlate}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <CustomButton
                  variant="edit"
                  size="sm"
                  className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUpdate(true);
                    setSelectedCarData(car);
                  }}
                >
                  수정
                </CustomButton>
                {car.status.toLowerCase() !== "deleted" && (
                  <CustomButton
                    variant="destructive"
                    size="sm"
                    className="flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                    icon={<Trash className="h-4 w-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDelete(true);
                      setSelectedCarData(car);
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

      {/* 차량 상세 모달 */}
      {selectedCarData && isDetail && (
        <CarDetailModal isOpen={true} onClose={handleCloseModal} carData={selectedCarData} />
      )}

      {/* 차량 수정 모달 */}
      {selectedCarData && isUpdate && (
        <CarUpdateModal
          isOpen={true}
          closeModal={handleCloseUpdateModal}
          initialData={selectedCarData}
          reload={reload}
        />
      )}

      {selectedCarData && isDelete && (
        <Modal
          open={isDelete}
          onClose={() => setIsDelete(false)}
          title="삭제"
          description="차량을 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            deleteCarData(selectedCarData.mdn!);
            setIsDelete(false);
          }}
        />
      )}
    </div>
  );
}

export default CarTable;
