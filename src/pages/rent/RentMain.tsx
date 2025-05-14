import PageHeader from "@/components/custom/PageHeader";
import RentSection from "./RentSection";

function RentMain() {
    return(
        <section className="w-full h-full md:px-[80px] xl:p-6">
            <PageHeader title={"렌트 등록 시스템"} size="2xl"/>
            <RentSection />
        </section>
    
    );
}
export default RentMain;