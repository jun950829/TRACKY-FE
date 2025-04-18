import PageHeader from "@/components/custom/PageHeader";
import BizTable from "./BizTable";

function AdminBizSection() {
  return <section className="w-full h-full p-10">
    <PageHeader title="등록된 업체 관리" />
    <BizTable />
  </section>;
}

export default AdminBizSection;
