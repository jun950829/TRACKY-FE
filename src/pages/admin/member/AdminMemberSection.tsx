import PageHeader from "@/components/custom/PageHeader";
import BizTable from "./MemberTable";
import ApprovalTable from "./ApprovalTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function AdminMemberSection() {
  return <section className="w-full h-full p-10">
    <PageHeader title="등록된 업체 관리" />
    <Tabs defaultValue="biz" className="space-y-4">
        <TabsList>
          <TabsTrigger value="biz">업체 관리</TabsTrigger>
          <TabsTrigger value="approval">승인 대기</TabsTrigger>
        </TabsList>

        <TabsContent value="biz"> 
          <BizTable />
        </TabsContent>

        <TabsContent value="approval">
          <ApprovalTable />
        </TabsContent>
    </Tabs>
  </section>;
}

export default AdminMemberSection;
