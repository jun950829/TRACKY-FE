import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/constants/mocks/noticeMockData";
import { useState, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { NoticeDetailTypes, NoticeTypes } from "@/constants/types/noticeTypes";
import adminApiService from "@/libs/apis/noticeApi";


interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice?: NoticeDetailTypes;
  onSave: (notice: NoticeDetailTypes) => void;
}

// 주요 폼 필드 및 유효성 검사
const schema = yup.object({
  title: yup.string().required("제목을 입력해주세요."),
  content: yup.string().required("내용을 입력해주세요."),
  isImportant: yup.boolean().required("중요 공지 여부를 선택해주세요.")
});

export default function NoticeModal({ open, onClose, notice, onSave }: NoticeModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      reset({
        title: notice?.title || "",
        content: notice?.content || "",
        // createdAt: notice?.createdAt || new Date().toISOString().split("T")[0],
        isImportant: notice?.isImportant || false
      });
    }
  }, [open, notice, reset]);

    /**
     * 공지사항 등록 method
     */
    const onSubmit = async (data: NoticeTypes) => {
      // console.log("공지사항 등록 클릭 ", data);

      const requestData = {
        ...data,
      };
      
      // 서버 응답(data에 id값 포함)
      const response = await adminApiService.createNotice(requestData);
  
      if (response.status === 200) {
        setIsSuccess(true);
        // 성공 시 부모 컴포넌트의 onSave 콜백 호출 -> 응답값(입력값+id) 전달
        onSave(response.data);
        // 모달 닫기
        onClose();
      } else {
        setIsError(true);
      }
    };

    /**
     * 공지사항 수정 method
     */
    const onUpdate = async (data: NoticeTypes) => {
      console.log("공지사항 수정 클릭 ", data);
      
      if (!notice || !notice.id) {
        console.error("수정할 공지사항의 ID가 없습니다:", notice);
        setIsError(true);
        return;
      }
    
      try {
        // ID를 포함한 요청 데이터 구성
        const requestData = {
          ...data,
          id: notice.id
        } as NoticeDetailTypes;
        
        console.log("수정 요청 데이터:", requestData);
    
        const noticeData = await adminApiService.updateNotice(requestData);
    
        if (noticeData.status === 200) {
          setIsSuccess(true);
          // ID를 포함하여 부모 컴포넌트로 전달
          onSave(requestData);
          onClose();
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("공지사항 수정 중 오류 발생:", error);
        setIsError(true);
      }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{notice ? "공지사항 수정" : "공지사항 추가"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              placeholder="제목을 입력해주세요."
              {...register("title")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              placeholder="내용을 입력해주세요."
              className="h-[30vh] resize-none"
              {...register("content")}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="isImportant"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isImportant"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isImportant">중요 공지</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              // type="submit"
              // onClick={handleSubmit(onSubmit)}
              onClick={handleSubmit(notice ? onUpdate : onSubmit)}>
              {notice ? "수정" : "추가"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}