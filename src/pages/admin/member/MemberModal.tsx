import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Member } from "@/constants/mocks/memberMockData";
import { useState } from "react";

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  member?: Member;
  onSave: (member: Omit<Member, "id">) => void;
}

export default function MemberModal({ open, onClose, member, onSave }: MemberModalProps) {
  const [formData, setFormData] = useState<Omit<Member, "id">>({
    name: member?.name || "",
    businessNumber: member?.businessNumber || "",
    manager: member?.manager || "",
    phone: member?.phone || "",
    email: member?.email || "",
    address: member?.address || "",
    status: member?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
              <Label htmlFor="name">회원명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessNumber">사업자번호</Label>
              <Input
                id="businessNumber"
                value={formData.businessNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, businessNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager">담당자</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, manager: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">주소</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, status: checked ? "active" : "inactive" })
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