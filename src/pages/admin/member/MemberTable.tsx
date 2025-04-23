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
import { useState, useEffect } from "react";
import MemberModal from "./MemberModal";
import { Member } from "../../../constants/mocks/memberMockData";
import signupApiService from "@/libs/apis/signupApi";

export default function MemberTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    searchMembers();
  }, []);

  const searchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await signupApiService.searchMembers(searchTerm);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setIsLoading(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchMembers();
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center h-10">
        <h2 className="text-2xl font-semibold text-gray-800">회원 관리</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="회원명, 담당자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pl-4 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={searchMembers}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  검색 중...
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow 
                  key={member.memberId}
                  className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
                >
                  <TableCell className="text-gray-700">{member.bizName}</TableCell>
                  {/* <TableCell className="text-gray-600">{member.businessNumber}</TableCell> */}
                  <TableCell className="text-gray-600">{member.bizAdmin}</TableCell>
                  <TableCell className="text-gray-600">{member.bizPhoneNumber}</TableCell>
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
                        onClick={() => handleDelete(member.memberId)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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