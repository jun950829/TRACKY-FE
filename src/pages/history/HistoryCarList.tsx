import { useCarListStore } from "@/stores/useCarListStore";
import { useDriveListStore } from "@/stores/useDriveListStore";
import driveService from "@/libs/apis/driveApi";
import { Loader2 } from "lucide-react";
import { cn } from "@/libs/utils/utils";
import { getStatusBadgeClass, getStatusLabel } from "@/libs/utils/getClassUtils";
import { CarRecord } from "@/constants/types/historyTypes";

export default function HistoryCarList() {
  const { 
    carResults, 
    isLoading,
  } = useCarListStore();

  const { setSelectedCar, setDriveResults } = useDriveListStore();

  const handleCarClick = async (car: CarRecord) => {
    const response = await driveService.getDriveBySearchFilter(car.carPlate);
    setDriveResults(response.data);
    setSelectedCar({
      carPlate: car.carPlate,
      carType: car.carType,
      status: car.status
    });
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
    <div className="flex flex-col h-full max-h-[50vh]">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-100">
          {carResults.map((car, index) => (
            <div
              key={index} 
              className={cn(
                "p-4 cursor-pointer transition-all duration-200",
                "hover:bg-gray-50 active:bg-gray-100"
              )}
              onClick={() => handleCarClick(car)}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={`/png/cars/${car.carType?.toLowerCase() || 'sedan'}.png`}
                    alt={car.carType || '차량'}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-full flex flex-row items-center gap-2">
                    <div className="font-sm text-gray-900 truncate">
                      {car.carPlate}
                    </div>
                    <div className={getStatusBadgeClass(car.status, 'car')}>
                      {getStatusLabel('car', car.status)}
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
