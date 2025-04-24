import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UpdateMemberRequestType } from "@/libs/apis/signupApi";

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  member: UpdateMemberRequestType;
  onSave: (member: UpdateMemberRequestType) => void;
}

export default function MemberModal({ open, onClose, member, onSave }: MemberModalProps) {
  const [formData, setFormData] = useState<Omit<UpdateMemberRequestType, "memberId">>({
    bizName: member.bizName || "",
    bizRegNum: member.bizRegNum || "",
    bizAdmin: member.bizAdmin || "",
    bizPhoneNum: member.bizPhoneNum || "",
    email: member.email || "",
    role: member.role || "ADMIN",
    status: member.status || "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (member) {
        onSave({
          ...formData,
          memberId: member.memberId,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="">
        <DialogHeader>
          <DialogTitle>{member ? "회원 수정" : "회원 추가"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bizName">회사명</Label>
              <Input
                id="bizName"
                defaultValue={member?.bizName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizRegNum">사업자등록번호</Label>
              <Input
                id="bizRegNum"
                defaultValue={member?.bizRegNum}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizRegNum: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizAdmin">담당자</Label>
              <Input
                id="bizAdmin"
                defaultValue={member?.bizAdmin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizAdmin: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizPhoneNum">전화번호</Label>
              <Input
                id="bizPhoneNum"
                defaultValue={member?.bizPhoneNum}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizPhoneNum: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                defaultValue={member?.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">권한</Label>
              <select
                id="role"
                defaultValue={member?.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="ADMIN">관리자</option>
                <option value="USER">일반 사용자</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">상태</Label>
              <select
                id="status"
                defaultValue={member?.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="active">활성화</option>
                <option value="deactive">비활성화</option>
                <option value="wait">승인대기</option>
                <option value="deleted">삭제됨</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{member ? "수정" : "추가"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 