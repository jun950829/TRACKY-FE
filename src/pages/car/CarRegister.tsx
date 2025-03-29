import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarStatus } from "@/constants/status"
import PageHeader from "@/components/custom/PageHeader"
import carApiService from "@/libs/apis/carApi"
import { CarCreateTypes } from "@/constants/types"
import Modal from "@/components/custom/Modal"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const schema = yup.object({
  mdn: yup.string().min(10).required("MDN을 입력해주세요."),
  // 추후 추가 예정
  // bizId: yup.string().required("업체를 선택해주세요."),
  carType: yup.string().required("차종을 입력해주세요."),
  carPlate: yup.string().required("차량 번호판을 입력해주세요."),
  carYear: yup.string().required("연식을 입력해주세요."),
  purpose: yup.string().required("차량 용도를 입력해주세요."),
  status: yup.string().required("차량 상태를 입력해주세요."),
  sum: yup.number().required("주행거리를 입력해주세요.").typeError("숫자만 입력 가능합니다.")
})

export default function CarRegister() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    // control,
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
    navigate("/car");
  }

  /**
   * 차량 등록 method
   * @param data 
   */
  const onSubmit = async (data: CarCreateTypes) => {
    // 천승준 - 임시 싱크용 데이터 추가
    const requestData = {
      ...data,
      sum: data.sum.toString(),
      bizId: "1"
    }

    const carData  = await carApiService.createCar(requestData);

    if(carData.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
    console.log("🚗 차량 등록 성공 데이터: ", carData.data);
  
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <PageHeader title="차량 등록" size="2xl" bold={true} />
          <p className="text-sm text-muted-foreground">차량 정보를 입력해 주세요.</p>

          {/* <div className="space-y-2">
            <Label>법인/렌터카 선택</Label>
            <Select onValueChange={(val) => setValue("bizId", val)}>
              <SelectTrigger>
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BIZ001">업체 1</SelectItem>
                <SelectItem value="BIZ002">업체 2</SelectItem>
              </SelectContent>
            </Select>
            {errors.bizId && <p className="text-sm text-red-500">{errors.bizId.message}</p>}
          </div> */}

          <div className="space-y-2">
            <Label>차량 식별번호(MDN) 입력</Label>
            <Input placeholder="예: 0077184075" {...register("mdn")} />
            {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>차종</Label>
            <Input placeholder="예: SUV, 승용차" {...register("carType")} />
            {errors.carType && <p className="text-sm text-red-500">{errors.carType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>차량 번호</Label>
            <Input placeholder="예: 12가 3456" {...register("carPlate")} />
            {errors.carPlate && <p className="text-sm text-red-500">{errors.carPlate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>연식</Label>
            <Input placeholder="예: 2020" {...register("carYear")} />
            {errors.carYear && <p className="text-sm text-red-500">{errors.carYear.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>사용 목적</Label>
            <Input placeholder="예: 렌트, 법인" {...register("purpose")} />
            {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>차량 상태</Label>
            <Select onValueChange={(val) => setValue("status", val)}>
              <SelectTrigger>
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {CarStatus.map((status) => (
                  <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>주행거리</Label>
            <div className="flex items-center gap-2">
              <Input type="number" min={0} {...register("sum")} />
              <span className="text-sm">km</span>
            </div>
            {errors.sum && <p className="text-sm text-red-500">{errors.sum.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button">취소</Button>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>등록하기</Button>
          </div>
        </CardContent>
      </Card>

      <Modal open={isSuccess} onClose={onConfirm} title="안내" description="차량 신규 등록 완료!" confirmText="확인" onConfirm={onConfirm} showCancel={false}/>
      <Modal open={isError} onClose={onClose} title="에러" description="차량 신규 등록 실패!" confirmText="확인" onConfirm={onClose} showCancel={false}/>
    </div>
  )
}