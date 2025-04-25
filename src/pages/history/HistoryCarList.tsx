import { useHistoryStore } from "@/stores/useHistoryStore";
import driveService from "@/libs/apis/driveApi";
import { Loader2 } from "lucide-react";
import { cn } from "@/libs/utils/utils";
import { getStatusBadgeClass, getStatusLabel } from "@/libs/utils/getClassUtils";
import { CarRecord } from "@/constants/types/historyTypes";

function HistoryCarList() {
  const { carResults, searchType, setSelectedCar, setDriveResults, isLoading } = useHistoryStore();

  const handleCarClick = async (car: CarRecord) => {
    const response = await driveService.getDriveBySearchFilter(car.carPlate);
    setDriveResults(response.data);
    setSelectedCar({
      carPlate: car.carPlate,
      carType: car.carType,
      status: car.status
    });
  };

  if (searchType === "car" && carResults.length === 0) {
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
    <div className="h-full max-h-[50vh] overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {carResults.map((car, index) => (
          <div 
            key={index} 
            className={cn(
              "cursor-pointer transition-all duration-200",
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
                  <div className={getStatusBadgeClass( car.status,'car')}>
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
  );
}

export default HistoryCarList;
