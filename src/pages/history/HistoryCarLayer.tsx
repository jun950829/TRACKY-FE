import { useCarListStore } from "@/stores/useCarListStore";
import HistoryCarList from "./HistoryCarList";
import Pagination from "@/components/custom/Pagination";

export default function HistoryCarLayer() {
  const { 
    currentPage, 
    totalPages, 
    totalElements, 
    pageSize,
    setCurrentPage 
  } = useCarListStore();

  return (
    <div className="space-y-4">
      <HistoryCarList />
      <div className="flex justify-center mt-4">
        <Pagination
          noText={true}
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
