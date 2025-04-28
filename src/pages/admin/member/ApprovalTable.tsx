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
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ApprovalModal from "./ApprovalModal";
import signupApiService from "@/libs/apis/signupApi";
import { Approves } from "@/constants/types/types";
import { getStatusStyle, getStatusText } from "@/libs/utils/getClassUtils";

export default function ApprovalTable() {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [approves, setApproves] = useState<Approves[]>([]);
  const [filteredApproves, setFilteredApproves] = useState<Approves[]>([]);

  useEffect(() => {
    getApproves();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApproves(approves);
    } else {
      const filtered = approves.filter(
        (member) =>
          member.bizName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.bizAdmin.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApproves(filtered);
    }
  }, [searchTerm, approves]);

  const getApproves = async () => {
    const result = await signupApiService.getApproves();
    setApproves(result.data);
    setFilteredApproves(result.data);
  };

  const handleApprove = (memberId: string) => {
    setSelectedMember(memberId);
    setIsApproveModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await signupApiService.reject({memberId: id, status: "deleted"});
    if(result.status === 200) {
      alert("거절 처리가 완료되었습니다.");
      getApproves();
    } else {
      alert("거절 처리에 실패했습니다.");
    }
  };

  const handleSave = async (memberId: string) => {
    if (selectedMember && memberId !==  "") {
      const result = await signupApiService.approve({memberId: memberId, status: "active"});

      if(result.status === 200) {
        setIsApproveModalOpen(false);
        alert("승인 처리가 완료되었습니다.");
        getApproves();
      } else {
        alert("승인 처리에 실패했습니다.");
      }
    } else {
      alert("승인 요청이 보내지지 않았습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center h-10">
        <h2 className="text-2xl font-semibold text-gray-800">승인 대기</h2>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="업체명, 담당자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          <div className="sticky top-0 z-10 bg-white">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <TableRow className="[&>th]:px-4 [&>th]:py-3 border-b border-gray-200">
                  <TableHead className="text-gray-600 font-medium">업체명</TableHead>
                  <TableHead className="text-gray-600 font-medium">사업자번호</TableHead>
                  <TableHead className="text-gray-600 font-medium">담당자</TableHead>
                  <TableHead className="text-gray-600 font-medium">연락처</TableHead>
                  <TableHead className="text-gray-600 font-medium">이메일</TableHead>
                  <TableHead className="text-gray-600 font-medium">상태</TableHead>
                  <TableHead className="w-24 text-right text-gray-600 font-medium">관리</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
            <Table>
              <TableBody>
                {filteredApproves.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {searchTerm ? "검색 결과가 없습니다." : "승인 대기 목록이 없습니다."}
                    </TableCell>
                  </TableRow>
                )}

                {filteredApproves.map((member) => (
                  <TableRow 
                    key={member.memberId}
                    className="hover:bg-gray-50 transition-colors duration-200 [&>td]:px-4 [&>td]:py-3 border-b border-gray-100"
                  >
                    <TableCell className="text-gray-700">{member.bizName}</TableCell>
                    <TableCell className="text-gray-600">{member.bizRegNum}</TableCell>
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
                          onClick={() => handleApprove(member.memberId)}
                        >
                          승인
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-12 h-8 px-3 border-gray-200 hover:border-red-500 hover:text-red-600 transition-colors duration-200"
                          onClick={() => handleDelete(member.memberId)}
                        >
                          거절
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ApprovalModal
        open={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onSave={() => handleSave(selectedMember)}
      />
    </div>
  );
} 