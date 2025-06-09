import PageHeader from "@/components/custom/PageHeader";
import RentSection from "./RentSection";
import { PageLayout } from "@/components/Layout";

function RentMain() {
    return (
        <PageLayout>
            <PageHeader title={"렌트 등록 시스템"} size="2xl"/>
            <RentSection />
        </PageLayout>
    );
}
export default RentMain;