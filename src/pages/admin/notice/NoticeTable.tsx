import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoticeDetailTypes, NoticeTypes } from "@/constants/types/noticeTypes";
import adminApiService from "@/libs/apis/noticeApi";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import NoticeDetailModal from "./modal/NoticeDetailModal";

import { CustomButton } from "@/components/custom/CustomButton";
import Modal from "@/components/custom/Modal";
import { Card, CardContent } from "@/components/ui/card";
import NoticePatchModal from "./modal/NoticePatchModal";
import { ImportanceLevel } from "@/constants/enums/noticeEnums";

type NoticeTableProps = {
  noticeList: NoticeDetailTypes[];
  setNoticeList: (noticeList: NoticeDetailTypes[]) => void;
  isLoading?: boolean;
  reload: (isReload: boolean) => void;
};

function NoticeTable({ noticeList, setNoticeList, isLoading = false, reload }: NoticeTableProps) {
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetailTypes | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleView = (notice: NoticeDetailTypes) => {
    setSelectedNotice(notice);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedNotice(null);
    setIsUpdateModalOpen(false);
    reload(true);
  };

  const handleEdit = (notice: NoticeDetailTypes) => {
    setSelectedNotice(notice);
    setIsUpdateModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSave = async (noticeData: NoticeTypes) => {
    try {
      // 새 공지사항 API 호출 결과는 NoticeModal 내부에서 처리됨
      reload(true);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("공지사항 저장 중 오류 발생:", error);
    }
  };

  const deleteNotice = async (id: number) => {
    try {
      const response = await adminApiService.deleteNotice(id);
      
      if (response.status === 200 || (response.data && response.data.status === 200)) {
        // UI에서 해당 공지사항 제거
        const updatedList = noticeList.filter(notice => notice.id !== id);
        setNoticeList(updatedList);
      } else {
        alert("공지사항 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("공지사항 삭제 중 오류 발생:", error);
      alert("공지사항 삭제에 실패했습니다.");
    }
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
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 공지사항
        </Button>
      </div>
    
      <div className="w-full">
        {/* PC 화면용 테이블 */}
        <div className="hidden md:block overflow-auto shadow-sm bg-white">
          <div className="relative">
            {/* 헤더 테이블 - 고정 위치 */}
            <div className="sticky top-0 z-10 bg-white">
              <Table className="w-full" style={{ tableLayout: 'fixed' }}>
                <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                    <TableHead className="text-gray-600 font-medium" style={{ width: '120px' }}>중요도</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: 'auto' }}>제목</TableHead>
                    <TableHead className="text-gray-600 font-medium" style={{ width: '160px' }}>작성일</TableHead>
                    <TableHead className="text-right text-gray-600 font-medium" style={{ width: '180px' }}>관리</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            
            {/* 본문 테이블 - 스크롤 가능 */}
            <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
              <Table className="w-full" style={{ tableLayout: 'fixed' }}>
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
                  <TableCell style={{ width: '120px' }} className="whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      notice.type === ImportanceLevel.IMPORTANT
                        ? "text-red-600 bg-red-50" 
                        : "text-gray-600 bg-gray-50"
                    }`}>
                      {notice.type === ImportanceLevel.IMPORTANT ? "중요" : "일반"}
                    </span>
                  </TableCell>
                  <TableCell style={{ width: 'auto' }} className="text-gray-700 truncate">{notice.title}</TableCell>
                  <TableCell style={{ width: '160px' }} className="whitespace-nowrap text-gray-700">
                    {notice.createdAt}
                  </TableCell>
                  <TableCell style={{ width: '180px' }} className="text-right">
                    <div className="flex gap-2 justify-end">
                      <CustomButton
                        variant="edit"
                        size="sm"
                        className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                        icon={<Edit className="h-4 w-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(notice);
                        }}
                      >
                        수정
                      </CustomButton>
                      <CustomButton
                        variant="destructive"
                        size="sm"
                        className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                        icon={<Trash className="h-4 w-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteModalOpen(true);
                          setSelectedNotice(notice);
                        }}
                      >
                        삭제
                      </CustomButton>
                    </div>
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
                        notice.type === ImportanceLevel.IMPORTANT
                          ? "text-red-600 bg-red-50" 
                          : "text-gray-600 bg-gray-50"
                      }`}>
                        {notice.type === ImportanceLevel.IMPORTANT? "중요" : "일반"}
                      </span>
                      <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{new Date(notice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <CustomButton
                    variant="edit"
                    size="sm"
                    className="flex-1 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors duration-200"
                    icon={<Edit className="h-4 w-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(notice);
                    }}
                  >
                    수정
                  </CustomButton>
                  <CustomButton
                    variant="destructive"
                    size="sm"
                    className="flex-1 h-9 bg-red-50 hover:bg-red-100 text-red-600 transition-colors duration-200"
                    icon={<Trash className="h-4 w-4" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteModalOpen(true);
                      setSelectedNotice(notice);
                    }}
                  >
                    삭제
                  </CustomButton>
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

      {/* 공지사항 수정 모달 */}
      {selectedNotice && isUpdateModalOpen && (
        <NoticePatchModal
          open={true}
          onClose={handleCloseUpdateModal}
          notice={selectedNotice}
          type={"update"}   
          reload={reload}   
          />
      )}

      {/* 공지사항 작성 모달 */}
      {isCreateModalOpen && (
        <NoticePatchModal
          open={true}
          onClose={() => setIsCreateModalOpen(false)}
          type={"create"}
          reload={reload}
        />
      )}

      {/* 삭제 확인 모달 */}
      {selectedNotice && isDeleteModalOpen && (
        <Modal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="공지사항 삭제"
          description="이 공지사항을 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            deleteNotice(selectedNotice.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default NoticeTable;
