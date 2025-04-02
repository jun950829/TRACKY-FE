import Modal from "@/components/custom/Modal";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RentCreateTypes } from "@/constants/types";
import rentApiService from "@/libs/apis/rentsApi";
import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup"

const schema = yup.object({
    mdn: yup.string().min(10).required("MDN을 입력해주세요."),
    renterName: yup.string().required("사용자 이름을 입력해주세요."),
    renterPhone: yup.string().required("사용자 전화번호를 입력해주세요."),
    rentStime: yup.string().required("대여 시간 입력해주세요."),
    rentEtime: yup.string().required("반납 시간 입력해주세요."),
    rentLoc: yup.string().required("대여 할 위치를 입력해주세요."),
    returnLoc: yup.string().required("반납 할 위치를 입력해주세요."),
    purpose: yup.string().required("사용목적 입력해주세요.")
})

function RentRegister() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

  const onClose = () => {
    setIsError(false);
  }

  const onConfirm = () => {
    setIsSuccess(false);
    navigate("/rents");
  }

  /**
   * 대여 등록 method
   * @param data
   */
  const onSubmit = async (data: RentCreateTypes) => {
    //console.log(data);

    
    const formattedData = {
        ...data,
        rentStime: data.rentStime.replace("T", " "), // 타임스탬프로 바꾸기!
        rentEtime: data.rentEtime.replace("T", " ")
      };
  
      console.log("서버로 보낼 데이터:", formattedData);
    
    // try {
    //   const res = await rentApiService.createRent(data);
    //   if (res.status === 200) {
    //     setIsSuccess(true);
    //   } else {
    //     setIsError(true);
    //   }
    // } catch (err) {
    //   console.error("대여 등록 실패:", err);
    //   setIsError(true);
    // }
  };


  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <PageHeader title="대여 등록" size="2xl" bold={true} />
          <p className="text-sm text-muted-foreground">
            대여 정보를 입력해 주세요.
          </p>

          <div className="space-y-2">
            <Label>차량 식별번호(MDN)</Label>
            <Input placeholder="예: 6066499939" {...register("mdn")} />
            {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>사용자 이름</Label>
            <Input placeholder="예: 구지원" {...register("renterName")} />
            {errors.renterName && <p className="text-sm text-red-500">{errors.renterName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>사용자 전화번호</Label>
            <Input placeholder="예: 010-1234-5678" {...register("renterPhone")} />
            {errors.renterPhone && <p className="text-sm text-red-500">{errors.renterPhone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>대여 시작 시간</Label>
            <Input type="datetime-local" {...register("rentStime")} />
            {errors.rentStime && <p className="text-sm text-red-500">{errors.rentStime.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>대여 종료 시간</Label>
            <Input type="datetime-local" {...register("rentEtime")} />
            {errors.rentEtime && <p className="text-sm text-red-500">{errors.rentEtime.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>대여 위치</Label>
            <Input placeholder="예: 미왕빌딩" {...register("rentLoc")} />
            {errors.rentLoc && <p className="text-sm text-red-500">{errors.rentLoc.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>반납 위치</Label>
            <Input placeholder="예: 미왕빌딩" {...register("returnLoc")} />
            {errors.returnLoc && <p className="text-sm text-red-500">{errors.returnLoc.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>사용 목적</Label>
            <Input placeholder="예: 출장, 업무용" {...register("purpose")} />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => navigate("/rents")}>취소</Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>등록하기</Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={isSuccess}
        onClose={onConfirm}
        title="안내"
        description="대여 등록이 완료되었습니다!"
        confirmText="확인"
        onConfirm={onConfirm}
        showCancel={false}
      />

      <Modal
        open={isError}
        onClose={onClose}
        title="에러"
        description="대여 등록에 실패했습니다!"
        confirmText="확인"
        onConfirm={onClose}
        showCancel={false}
      />
    </div>
  );
}

export default RentRegister;