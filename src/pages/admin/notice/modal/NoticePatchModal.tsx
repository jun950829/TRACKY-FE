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
import { ImportanceLevel } from "@/constants/enums/noticeEnums";


interface NoticeModalProps {
  open: boolean;
  onClose: () => void;
  notice?: NoticeDetailTypes;
  type: "create" | "update";
  reload:(isReload: boolean) => void
}

// 주요 폼 필드 및 유효성 검사
const schema = yup.object({
  title: yup.string().required("제목을 입력해주세요."),
  content: yup.string().required("내용을 입력해주세요."),
  type: yup.string().oneOf(
    [ImportanceLevel.NORMAL, ImportanceLevel.IMPORTANT],
    "중요도를 선택해주세요"
  ).required("중요 공지 여부를 선택해주세요.")
});

export default function NoticePatchModal({ open, onClose, notice, type, reload }: NoticeModalProps) {
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
        type: notice?.type === ImportanceLevel.IMPORTANT ?  
          ImportanceLevel.IMPORTANT : 
          ImportanceLevel.NORMAL
    });
    }
  }, [open, notice, reset]);


    /**
     * 공지사항 등록 method
     */
    const onSubmit = async (data: NoticeTypes) => {
      console.log("data", data);
      let response;

      if (type === "create") {
        const requestData = {
          ...data,
        };
        console.log("공지사항 등록 클릭 ", requestData);  

        response = await adminApiService.createNotice(requestData);
          
        if (response.status === 200) {
          setIsSuccess(true);
    
          // 모달 닫기
          onClose();
          reload(true);
        } else {
          setIsError(true);
        }
      }

      if (type === "update") {
        /**
         * 공지사항 수정 method
         */
        if (!notice || !notice.id) {
          console.error("수정할 공지사항의 ID가 없습니다:", notice);
          setIsError(true);
          return;
        }

        const requestData = {
          ...data,
          id: notice.id
        } as NoticeDetailTypes;
      
        response = await adminApiService.updateNotice(requestData);
      
        if (response.status === 200) {
          setIsSuccess(true);
          // ID를 포함하여 부모 컴포넌트로 전달
          onClose();
          reload(true);
        } else {
          setIsError(true);
        }
      }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{notice ? "공지사항 수정" : "공지사항 추가"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="space-y-2">
            <Label htmlFor="importance">중요도</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                // <select {...field} className="w-full p-2 border rounded">
                //   <option value={ImportanceLevel.NORMAL}>일반</option>
                //   <option value={ImportanceLevel.IMPORTANT}>중요</option>
                // </select>
                <input
                  type="checkbox"
                  id="importance"
                  checked={field.value === ImportanceLevel.IMPORTANT}
                  onChange={(e) => {
                    field.onChange(e.target.checked ? ImportanceLevel.IMPORTANT : ImportanceLevel.NORMAL);
                  }}
                />
              )}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              // type="submit"
              // onClick={handleSubmit(onSubmit)}
              type="submit" >
              {type == "update" ? "수정" : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}