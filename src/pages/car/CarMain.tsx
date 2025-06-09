import PageHeader from "../../components/custom/PageHeader";
import CarSection from "./CarSection";
import { PageLayout } from "@/components/Layout";

function CarMain() {
  return (
    <PageLayout>
      <PageHeader title={"차량 등록 시스템"} size="2xl"/>
      <CarSection />
    </PageLayout>
  ); 
}

export default CarMain;