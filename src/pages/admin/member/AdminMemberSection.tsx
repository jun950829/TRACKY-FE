import PageHeader from "@/components/custom/PageHeader";
import ApprovalTable from "./ApprovalTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberSection from "./MemberSection";

function AdminMemberSection() {
  return <section className="w-full h-full p-10">
    <PageHeader title="등록된 업체 관리" />
    <Tabs defaultValue="member" className="space-y-4">
        <TabsList>
          <TabsTrigger value="member">업체 관리</TabsTrigger>
          <TabsTrigger value="approval">승인 대기</TabsTrigger>
        </TabsList>

        <TabsContent value="member"> 
          <MemberSection />
        </TabsContent>

        <TabsContent value="approval">
          <ApprovalTable />
        </TabsContent>
    </Tabs>
  </section>;
}

export default AdminMemberSection;
