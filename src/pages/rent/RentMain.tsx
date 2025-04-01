import PageHeader from "@/components/custom/PageHeader";
import RentSection from "./RentSection";

function RentMain() {
    return(
        <section className="w-full h-full p-10">
            <PageHeader title={"렌트 등록 시스템"} size="2xl"/>
            <RentSection />
        </section>
    
    );
}
export default RentMain;