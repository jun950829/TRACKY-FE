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
import MemberModal from "./MemberModal";
import { Member, mockMembers } from "../../../constants/mocks/memberMockData";

export default function MemberTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // 삭제 로직 구현
    console.log("Delete member:", id);
  };

  const handleAdd = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleSave = (memberData: Omit<Member, "id">) => {
    if (selectedMember) {
      // 수정 로직 구현
      console.log("Update member:", { ...selectedMember, ...memberData });
    } else {
      // 추가 로직 구현
      console.log("Add member:", memberData);
    }
  };

  const filteredMembers = mockMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.businessNumber.includes(searchTerm) ||
    member.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center h-10">
        <h2 className="text-2xl font-semibold text-gray-800">회원 관리</h2>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 회원 등록
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="회원명, 담당자로 검색"
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
              <TableHead className="text-gray-600 font-medium">회원명</TableHead>
              {/* <TableHead className="text-gray-600 font-medium">사업자번호</TableHead> */}
              <TableHead className="text-gray-600 font-medium">담당자</TableHead>
              <TableHead className="text-gray-600 font-medium">연락처</TableHead>
              <TableHead className="text-gray-600 font-medium">이메일</TableHead>
              <TableHead className="text-gray-600 font-medium">상태</TableHead>
              <TableHead className="w-24 text-right text-gray-600 font-medium">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow 
                key={member.id}
                className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
              >
                <TableCell className="text-gray-700">{member.name}</TableCell>
                {/* <TableCell className="text-gray-600">{member.businessNumber}</TableCell> */}
                <TableCell className="text-gray-600">{member.manager}</TableCell>
                <TableCell className="text-gray-600">{member.phone}</TableCell>
                <TableCell className="text-gray-600">{member.email}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    member.status === "active" 
                      ? "text-green-600 bg-green-50" 
                      : "text-red-600 bg-red-50"
                  }`}>
                    {member.status === "active" ? "활성" : "비활성"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12 h-8 px-3 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-12 h-8 px-3 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors duration-200"
                      onClick={() => handleDelete(member.id)}
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

      <MemberModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember || undefined}
        onSave={handleSave}
      />
    </div>
  );
} 