import PageHeader from "@/components/custom/PageHeader";
import HistorySection from "./HistorySection";

function HistoryMain() {
  return (
    <section className="w-full h-full max-h-screen p-10 overflow-y-auto">
      <PageHeader title={"차량 운행 기록"} size="2xl"/>
      <HistorySection />
    </section>
  );
};

export default HistoryMain;