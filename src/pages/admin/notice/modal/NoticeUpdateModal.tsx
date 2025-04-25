import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoticeDetailTypes, NoticeTypes } from "@/constants/types/noticeTypes";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import adminApiService from "@/libs/apis/noticeApi";

interface NoticeUpdateModalProps {
  open: boolean;
  onClose: () => void;
  notice: NoticeDetailTypes;
}

const NoticeUpdateModal = ({ open, onClose, notice }: NoticeUpdateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<NoticeTypes>({
    defaultValues: {
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant,
    }
  });

  // 초기 값 설정
  useEffect(() => {
    setValue("title", notice.title);
    setValue("content", notice.content);
    setValue("isImportant", notice.isImportant);
  }, [notice, setValue]);

  const watchIsImportant = watch("isImportant");

  const onSubmit = async (data: NoticeTypes) => {
    setIsLoading(true);
    try {
      const updatedNotice = {
        ...notice,
        ...data,
      };
      
      const response = await adminApiService.updateNotice(updatedNotice);
      
      if (response.status === 200 || (response.data && response.data.status === 200)) {
        alert("공지사항이 수정되었습니다.");
        onClose();
      } else {
        alert("공지사항 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("공지사항 수정 중 오류 발생:", error);
      alert("공지사항 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">공지사항 수정</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                {...register("title", { required: "제목은 필수입니다." })}
                className="border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                {...register("content", { required: "내용은 필수입니다." })}
                className="min-h-[200px] border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isImportant" 
                checked={watchIsImportant}
                onCheckedChange={(checked) => {
                  setValue("isImportant", checked === true);
                }}
              />
              <Label htmlFor="isImportant" className="cursor-pointer">중요 공지사항으로 표시</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-200 hover:border-gray-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoticeUpdateModal;