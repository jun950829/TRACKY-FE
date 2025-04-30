import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { NoticeDetailTypes, NoticeTypes } from "@/constants/types/noticeTypes";
import { Card, CardContent } from "@/components/ui/card";
import NoticeDetailModal from "./modal/NoticeDetailModal";

type NoticeTableProps = {
  noticeList: NoticeDetailTypes[];
  setNoticeList: (noticeList: NoticeDetailTypes[]) => void;
  isLoading?: boolean;
  reload: (isReload: boolean) => void;
};

function NoticeTable({ noticeList, setNoticeList, isLoading = false, reload }: NoticeTableProps) {
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetailTypes | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleView = (notice: NoticeDetailTypes) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">공지사항 목록</h2>
      </div>
    
      <div className="w-full">
        {/* PC 화면용 테이블 */}
        <div className="hidden md:block overflow-auto shadow-sm bg-white">
          <div className="relative">
            <div className="sticky top-0 z-10 bg-white">
              <Table className="w-full">
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                    <TableHead className="w-24 text-gray-600 font-medium">중요도</TableHead>
                    <TableHead className="text-gray-600 font-medium">제목</TableHead>
                    <TableHead className="w-36 text-gray-600 font-medium">작성일</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
              <Table className="w-full">
                <TableBody>
                {noticeList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      등록된 공지사항이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
                {noticeList.map((notice) => (
                  <TableRow
                    key={notice.id}
                    onClick={() => handleView(notice)}
                    className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100 cursor-pointer"
                  >
                    <TableCell className="w-24 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        notice.isImportant 
                          ? "text-red-600 bg-red-50" 
                          : "text-gray-600 bg-gray-50"
                      }`}>
                        {notice.isImportant ? "중요" : "일반"}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700 truncate">{notice.title}</TableCell>
                    <TableCell className="w-36 whitespace-nowrap text-gray-700">
                      {notice.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* 모바일 화면용 카드 */}
        <div className="md:hidden space-y-4">
          {noticeList.length === 0 && (
            <div className="text-center py-8 text-gray-500">등록된 공지사항이 없습니다.</div>
          )}
          {noticeList.map((notice) => (
            <Card
              key={notice.id}
              className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent
                onClick={() => handleView(notice)}
                className="p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        notice.isImportant 
                          ? "text-red-600 bg-red-50" 
                          : "text-gray-600 bg-gray-50"
                      }`}>
                        {notice.isImportant ? "중요" : "일반"}
                      </span>
                      <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{new Date(notice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      {selectedNotice && isDetailModalOpen && (
        <NoticeDetailModal
          open={true}
          onClose={handleCloseDetailModal}
          notice={selectedNotice}
        />
      )}
    </div>
  );
}

export default NoticeTable;
