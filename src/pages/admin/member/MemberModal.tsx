import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
        // 수정 API 호출
        onSave({
          ...formData,
          memberId: member.memberId,
        });
          onClose();
        }
      } catch (error) {
      console.error('Error updating member:', error);
      // TODO: 에러 처리 (토스트 메시지 등)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{member ? "회원 수정" : "회원 추가"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bizName">회사명</Label>
              <Input
                id="bizName"
                value={formData.bizName}
                defaultValue={member?.bizName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizRegNum">사업자등록번호</Label>
              <Input
                id="bizRegNum"
                value={formData.bizRegNum}
                defaultValue={member?.bizRegNum}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizRegNum: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizAdmin">담당자</Label>
              <Input
                id="bizAdmin"
                value={formData.bizAdmin}
                defaultValue={member?.bizAdmin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bizAdmin: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bizPhoneNum">전화번호</Label>
              <Input
                id="bizPhoneNum"
                value={formData.bizPhoneNum}
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
                value={formData.email}
                defaultValue={member?.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">권한</Label>
              <select
                id="role"
                value={formData.role}
                defaultValue={member?.role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="ADMIN">관리자</option>
                <option value="USER">일반 사용자</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "active"}
              defaultValue={member?.status}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, status: checked ? "active" : "deactive" })
              }
            />
            <Label htmlFor="status">활성화</Label>
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