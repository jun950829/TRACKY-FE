import Pagination from "@/components/custom/Pagination";
import HistoryCarList from "./HistoryCarList";

function HistoryCarLayer() {
  return <>
    <HistoryCarList />
    <Pagination currentPage={0} totalPages={0} pageSize={0} totalElements={0} onPageChange={function (page: number): void {
      throw new Error('Function not implemented.');
    } }            />

  </>;
}

export default HistoryCarLayer;
