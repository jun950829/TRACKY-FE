import { useHistoryStore } from "@/stores/useHistoryStore";
import driveService from "@/libs/apis/driveApi";

function HistoryCarList() {
  const { carResults, searchType, setSelectedCar, setDriveResults} = useHistoryStore();

  // 주행 항목 클릭 핸들러
  const handleCarClick = async (carPlate: string) => {

    const response = await driveService.getDriveBySearchFilter(carPlate);

    setDriveResults(response.data);
    setSelectedCar({ carPlate: carPlate });
  };

  // 결과가 없을 때 표시할 메시지
  if (searchType === "car" && carResults.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-2">
      <div className="divide-y divide-gray-100">
        {carResults.map((car) => (
          <div key={car.carPlate} className="text-sm">
            <div className="p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50" onClick={() => handleCarClick(car.carPlate)}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  차량 번호: {car.carPlate}
                </div>
                <div className="text-xs text-gray-600 truncate mt-1">
                  차종: {car.carType}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryCarList;
