import PageHeader from "@/components/custom/PageHeader";
import RentSection from "./RentSection";

function RentMain() {
    return(
        <section className="w-full h-full p-2 max-h-screen md:px-[80px] xl:p-6 overflow-y-auto">
            <PageHeader title={"렌트 등록 시스템"} size="2xl"/>
            <RentSection />
        </section>
    
    );
}
export default RentMain;