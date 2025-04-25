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
import { Edit, Trash, Search, Eye } from "lucide-react";
import { useState } from "react";
import MemberModal from "./MemberModal";
import MemberDetailModal from "./MemberDetailModal";
import signupApiService, { UpdateMemberRequestType } from "@/libs/apis/signupApi";
import Modal from "@/components/custom/Modal";
import { Member } from "@/constants/types/types";
import { getStatusStyle, getStatusText } from "@/libs/utils/getClassUtils";
import { convertMemberToUpdateRequest } from "./convert/memberConvert";

interface MemberTableProps {
  members: Member[];
  isLoading: boolean;
  searchTerm: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
  };
  onSearch: (term: string) => void;
  setSearchTerm: (term: string) => void;
  onPageChange: (page: number) => void;
  onMemberUpdate: () => Promise<void>;
}

export default function MemberTable({
  members,
  isLoading,
  searchTerm,
  setSearchTerm,
  onSearch,
  onMemberUpdate,
}: MemberTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UpdateMemberRequestType | null>(null);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<Member | null>(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const onConfirm = () => {
    setIsUpdated(false);
    setIsDelete(false);
    setIsDeleted(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(convertMemberToUpdateRequest(member));
    setIsModalOpen(true);
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(convertMemberToUpdateRequest(member));
    setIsDelete(true);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMemberForDetail(member);
    setIsDetailModalOpen(true);
  };

  const handleSave = async (memberData: UpdateMemberRequestType) => {
    if (selectedMember) {
      const response = await signupApiService.updateMember(memberData);
      if (response.status === 200) {
        await onMemberUpdate();
        setIsModalOpen(false);
        setIsUpdated(true);
      }
    }
  };

  const deleteMember = async (memberId: string) => {
    const response = await signupApiService.deleteMember({"memberId" : memberId});
    if (response.status === 200) {
      await onMemberUpdate();
      setIsDelete(false);
      setIsDeleted(true);
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
            placeholder="업체명, 담당자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="pl-4 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Button
          onClick={() => onSearch(searchTerm)}
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          <div className="sticky top-0 z-10 bg-white">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                  <TableHead className="text-gray-600 font-medium">업체명</TableHead>
                  <TableHead className="text-gray-600 font-medium">담당자</TableHead>
                  <TableHead className="text-gray-600 font-medium">연락처</TableHead>
                  <TableHead className="text-gray-600 font-medium">이메일</TableHead>
                  <TableHead className="text-gray-600 font-medium">상태</TableHead>
                  <TableHead className="w-32 text-right text-gray-600 font-medium">관리</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
            <Table>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      검색 중...
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
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
                      <TableCell className="text-gray-600">{member.bizAdmin}</TableCell>
                      <TableCell className="text-gray-600">{member.bizPhoneNum}</TableCell>
                      <TableCell className="text-gray-600">{member.email}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(member.status)}`}>
                          {getStatusText(member.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-12 h-8 px-3 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                            onClick={() => handleViewDetails(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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
                            onClick={() => handleDelete(member)}
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
        </div>
      </div>

      {selectedMember && (
        <MemberModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          member={selectedMember}
          onSave={handleSave}
        />
      )}

      {selectedMemberForDetail && (
        <MemberDetailModal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          member={selectedMemberForDetail}
        />
      )}

      <Modal open={isUpdated} onClose={onConfirm} title="안내" description="계정 수정 완료!" confirmText="확인" onConfirm={onConfirm} showCancel={false}/>
      <Modal open={isDeleted} onClose={onConfirm} title="안내" description="계정 삭제 완료!" confirmText="확인" onConfirm={onConfirm} showCancel={false}/>

      {selectedMember && isDelete && (
        <Modal
          open={isDelete}
          onClose={() => setIsDelete(false)}
          title="삭제"
          description="계정을 삭제하시겠습니까?"
          confirmText="삭제"
          onConfirm={() => {
            deleteMember(selectedMember.memberId);
            setIsDelete(true);
          }}
        />
      )}
    </div>
  );
} 