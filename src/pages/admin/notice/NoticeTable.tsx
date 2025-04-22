import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Plus, Search } from "lucide-react";
import { useState } from "react";
import NoticeModal from "./NoticeModal";
import { Notice, mockNotices } from "@/constants/mocks/noticeMockData";

export default function NoticeTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // 삭제 로직 구현
    console.log("Delete notice:", id);
  };

  const handleAdd = () => {
    setSelectedNotice(null);
    setIsModalOpen(true);
  };

  const handleSave = (noticeData: Omit<Notice, "id">) => {
    if (selectedNotice) {
      // 수정 로직 구현
      console.log("Update notice:", { ...selectedNotice, ...noticeData });
    } else {
      // 추가 로직 구현
      console.log("Add notice:", noticeData);
    }
  };

  const filteredNotices = mockNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">공지사항 관리</h2>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 공지사항 등록
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="제목, 내용, 작성자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
              <TableHead className="text-gray-600 font-medium">제목</TableHead>
              <TableHead className="text-gray-600 font-medium">작성자</TableHead>
              <TableHead className="text-gray-600 font-medium">작성일</TableHead>
              <TableHead className="text-gray-600 font-medium">중요</TableHead>
              <TableHead className="w-24 text-right text-gray-600 font-medium">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotices.map((notice) => (
              <TableRow 
                key={notice.id}
                className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
              >
                <TableCell className="text-gray-700">{notice.title}</TableCell>
                <TableCell className="text-gray-600">{notice.author}</TableCell>
                <TableCell className="text-gray-600">{notice.createdAt}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    notice.isImportant 
                      ? "text-red-600 bg-red-50" 
                      : "text-gray-600 bg-gray-50"
                  }`}>
                    {notice.isImportant ? "중요" : "일반"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleEdit(notice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors duration-200"
                      onClick={() => handleDelete(notice.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NoticeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notice={selectedNotice || undefined}
        onSave={handleSave}
      />
    </div>
  );
} 