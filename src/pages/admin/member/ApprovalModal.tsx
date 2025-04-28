import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Biz } from "@/constants/mocks/bizMockData";

interface ApprovalModalProps {
  open: boolean;
  onClose: () => void;
  biz?: Biz;
  onSave: () => void;
}

function ApprovalModal({ open, onClose, onSave }: ApprovalModalProps) {
  return (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="p-4 max-w-[200px]">
      <DialogHeader>
        <DialogTitle className="text-md">{"업체 승인"}</DialogTitle>
        <div className="flex flex-row gap-2 justify-center items-center p-2">
          <Button onClick={onSave}>승인</Button>
          <Button onClick={onClose} variant="outline">취소</Button>
        </div>
      </DialogHeader>
    </DialogContent>
  </Dialog> 
  );
}

export default ApprovalModal;