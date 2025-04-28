import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Member } from "@/constants/types/types";
import { getStatusStyle, getStatusText } from "@/libs/utils/getClassUtils";
import { Building2, User, Shield } from "lucide-react";

interface MemberDetailModalProps {
  open: boolean;
  onClose: () => void;
  member: Member;
}

export default function MemberDetailModal({ open, onClose, member }: MemberDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="" >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">회원 상세 정보</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* 회사 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="h-5 w-5" />
              <h3 className="font-medium">회사 정보</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-2">
                <Label className="text-gray-500">회사명</Label>
                <div className="text-gray-800 font-medium">{member.bizName}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500">사업자등록번호</Label>
                <div className="text-gray-800 font-medium">{member.bizRegNum}</div>
              </div>
            </div>
          </div>

          {/* 담당자 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5" />
              <h3 className="font-medium">담당자 정보</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-2">
                <Label className="text-gray-500">담당자명</Label>
                <div className="text-gray-800 font-medium">{member.bizAdmin}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500">연락처</Label>
                <div className="text-gray-800 font-medium">{member.bizPhoneNum}</div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500">이메일</Label>
                <div className="text-gray-800 font-medium">{member.email}</div>
              </div>
            </div>
          </div>

          {/* 계정 정보 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="h-5 w-5" />
              <h3 className="font-medium">계정 정보</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div className="space-y-2">
                <Label className="text-gray-500">권한</Label>
                <div className="text-gray-800 font-medium">
                  {member.role === "ADMIN" ? "관리자" : "일반 사용자"}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500">상태</Label>
                <div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle(member.status)}`}>
                    {getStatusText(member.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 