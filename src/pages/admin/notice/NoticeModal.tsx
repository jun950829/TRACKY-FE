import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/constants/mocks/noticeMockData";
import { useState } from "react";

interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice?: Notice;
  onSave: (notice: Omit<Notice, "id">) => void;
}

export default function NoticeModal({ open, onClose, notice, onSave }: NoticeModalProps) {
  const [formData, setFormData] = useState<Omit<Notice, "id">>({
    title: notice?.title || "",
    content: notice?.content || "",
    author: notice?.author || "",
    createdAt: notice?.createdAt || new Date().toISOString().split("T")[0],
    isImportant: notice?.isImportant || false,
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
          <DialogTitle>{notice ? "공지사항 수정" : "공지사항 추가"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
              required
              className="min-h-[200px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">작성자</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="createdAt">작성일</Label>
            <Input
              id="createdAt"
              type="date"
              value={formData.createdAt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, createdAt: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isImportant"
              checked={formData.isImportant}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, isImportant: checked })
              }
            />
            <Label htmlFor="isImportant">중요 공지</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">{notice ? "수정" : "추가"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 