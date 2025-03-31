import PageHeader from "../../components/custom/PageHeader";
import CarSection from "./CarSection";

function CarMain() {
  return (
    <section className="w-full h-full p-10">
      <PageHeader title={"차량 등록 시스템"} size="2xl"/>
      <CarSection />
    </section>
  ); 
}

export default CarMain;