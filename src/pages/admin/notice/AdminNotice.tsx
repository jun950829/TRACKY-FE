import PageHeader from "@/components/custom/PageHeader";
import NoticeTable from "./NoticeTable";


export function AdminNotice() {
  return (
    <section className="w-full h-full p-10">
      <PageHeader title="시스템 공지사항" />
      <NoticeTable />
    </section>
  );
}

export default AdminNotice;
