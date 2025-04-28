import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoticeDetailTypes } from "@/constants/types/noticeTypes";

interface NoticeDetailModalProps {
  open: boolean;
  onClose: () => void;
  notice: NoticeDetailTypes;
}

const NoticeDetailModal = ({ open, onClose, notice }: NoticeDetailModalProps) => {

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">{notice.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex gap-4">
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                notice.isImportant 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600 bg-gray-50"
              }`}>
                {notice.isImportant ? "중요" : "일반"}
              </span>
            </div>
            <div>{notice.createdAt}</div>
          </div>

          <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </div>

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">첨부파일</h3>
              <div className="space-y-2">
                {notice.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <a
                      href={attachment.url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeDetailModal;