import { useCarListStore } from "@/stores/useCarListStore";
import { useDriveListStore } from "@/stores/useDriveListStore";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/libs/utils/utils";
import { getStatusBadgeClass, getStatusLabel } from "@/libs/utils/getClassUtils";
import { CarRecord } from "@/constants/types/historyTypes";

export default function HistoryCarList() {
  const { 
    carResults, 
    isLoading,
  } = useCarListStore();

  const {setSelectedCar, setCurrentPage, selectedCar } = useDriveListStore();

  const handleCarClick = async (car: CarRecord) => {
    setSelectedCar({
      carMdn: car.mdn,
      carPlate: car.carPlate,
      carType: car.carType,
      status: car.status
    });
    setCurrentPage(0); // 첫 페이지로 초기화
  };

  if (carResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        검색 결과가 없습니다
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-23rem)] overflow-y-auto">
      <div className="flex-1">
        <div className="divide-y divide-gray-100">
          {carResults.map((car, index) => (
            <div
              key={index} 
              className={cn(
                "cursor-pointer transition-all duration-200 relative",
                "hover:bg-gray-50 active:bg-gray-100",
                selectedCar?.carMdn === car.mdn && "bg-blue-50"
              )}
              onClick={() => handleCarClick(car)}
            >
              {selectedCar?.carMdn === car.mdn && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md" />
              )}
              <div className="flex items-center gap-4 pl-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={`/png/cars/${car.carType?.toLowerCase() || 'sedan'}.png`}
                    alt={car.carType || '차량'}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-full flex flex-row justify-start items-center gap-2">
                    <div className={`${getStatusBadgeClass(car.status, 'car')}`}>
                      {getStatusLabel('car', car.status)}
                    </div>
                    <div className="text-xs text-gray-900 truncate">
                      {car.carPlate}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {car.mdn} | {car.carName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
