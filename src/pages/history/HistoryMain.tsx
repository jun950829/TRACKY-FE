import PageHeader from "@/components/custom/PageHeader";
import HistorySection from "./HistorySection";
import { PageLayout } from "@/components/Layout";

function HistoryMain() {
  return (
    <PageLayout>
      <PageHeader title={"차량 운행 기록"} size="2xl"/>
      <HistorySection />
    </PageLayout>
  );
}

export default HistoryMain;