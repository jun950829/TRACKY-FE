import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CarDetailTypes,  } from "@/constants/types";
import { useState } from "react";
import CarDetailModal from "./CarDetailModal";
import carApiService from "@/libs/apis/carApi";
import CarUpdateModal from "./CarUpdateModal";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/custom/Modal";

// const statusColor = {
//   '운행중': 'bg-green-100 text-green-800',
//   '정비중': 'bg-yellow-100 text-yellow-800',
// };

type CarTableProps = {
  carList: CarDetailTypes[];
  setCarList: (carList: CarDetailTypes[]) => void;
}


function CarTable({ carList, setCarList }: CarTableProps) {
  const [selectedCarData, setSelectedCarData] = useState<CarDetailTypes | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const navigate = useNavigate();


  const handleCellClick = async (id: number) => {
    const carData = await searchCarDataById(id);
    console.log('carData :', carData);
  };

  const handleCloseModal = () => {
    setIsDetail(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedCarData(null);
    setIsUpdate(false);
    navigate("/car");
  };

  async function searchCarDataById(id: number) {
    const res = await carApiService.searchByIdDetail(id);
    console.log('searchByIdDetail :', res.data);
    setSelectedCarData(res.data);
  }

  async function deleteCarData(id: number) {
    const res = await carApiService.deleteCar(id);
    console.log('deleteCarData :', res.data);
    if(res.status === 200) {
      carList = carList.filter((car) => car.id !== id);
      setCarList(carList);
    }

    alert('삭제되었습니다.');
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
                onClick={() => {
                  setIsDetail(true);
                  handleCellClick(car.id)
                }}
                className="cursor-pointer hover:text-blue-600 hover:underline"
              >{car.mdn}</TableCell>
              <TableCell>{car.carType}</TableCell>
              <TableCell>{car.carPlate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="link" className="text-blue-600 px-0" onClick={() => {
                  setIsUpdate(true);
                  setSelectedCarData(car);
                }}>수정</Button>
                <Button variant="link" className="text-red-600 px-0" onClick={() => {
                  setIsDelete(true);
                  setSelectedCarData(car);
                }}>삭제</Button>
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
          deleteCarData(selectedCarData.id!);
          setIsDelete(false);
        }} />  
      )}
    </div>
  );
}

export default CarTable;