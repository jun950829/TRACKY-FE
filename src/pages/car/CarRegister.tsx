import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarStatus } from "@/constants/datas/status";
import PageHeader from "@/components/custom/PageHeader";
import carApiService from "@/libs/apis/carApi";
import { CarCreateTypes } from "@/constants/types/types";
import Modal from "@/components/custom/Modal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const schema = yup.object({
  mdn: yup.string().min(10).max(11).required("차량 관리번호(MDN)을 입력해주세요."),
  // 추후 추가 예정
  // bizId: yup.string().required("업체를 선택해주세요."),
  carType: yup.string().required("차종을 입력해주세요."),
  carPlate: yup.string().required("차량 번호을 입력해주세요."),
  carYear: yup
    .number()
    .typeError("숫자로 입력해주세요.")
    .min(1900, "유효한 연식을 입력해주세요.")
    .max(new Date().getFullYear(), "미래 연도는 입력할 수 없습니다.")
    .required("연식을 입력하세요"),
  purpose: yup.string().required("차량 용도를 입력해주세요."),
  status: yup.string().required("차량 상태를 입력해주세요."),
  sum: yup.number().required("주행거리를 입력해주세요.").typeError("숫자만 입력 가능합니다."),
});

export default function CarRegister() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [checkingMdn, setCheckingMdn] = useState(false);
  const [mdnCheckResult, setMdnCheckResult] = useState<{
    checked: boolean;
    exists: boolean;
    message: string;
    lastCheckedMdn?: string;
  }>({
    checked: false,
    exists: false,
    message: "",
  });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // MDN 값 감시
  const mdnValue = watch("mdn");

  // MDN 입력값이 변경될 때마다 중복 체크 상태 초기화
  useEffect(() => {
    // 이미 중복 체크된 MDN과 현재 입력값이 다르면 체크 상태 초기화
    if (mdnCheckResult.checked && mdnValue !== mdnCheckResult.lastCheckedMdn) {
      setMdnCheckResult({
        checked: false,
        exists: false,
        message: "",
        lastCheckedMdn: undefined,
      });
    }
  }, [mdnValue, mdnCheckResult.checked, mdnCheckResult.lastCheckedMdn]);

  // MDN 중복 체크 함수
  const checkMdnExists = async () => {
    // MDN 값이 없거나 10자 미만이면 체크하지 않음
    if (!mdnValue || mdnValue.length < 10) {
      setMdnCheckResult({
        checked: false,
        exists: false,
        message: "MDN은 최소 10자 이상이어야 합니다.",
        lastCheckedMdn: undefined,
      });
      return;
    }

    try {
      setCheckingMdn(true);
      const response = await carApiService.checkMdnExists(mdnValue);

      if (response.data) {
        // MDN이 이미 존재함
        setMdnCheckResult({
          checked: true,
          exists: response.data,
          message: "이미 등록된 MDN입니다.",
          lastCheckedMdn: mdnValue,
        });
      } else {
        // MDN이 존재하지 않음 (사용 가능)
        setMdnCheckResult({
          checked: true,
          exists: response.data,
          message: "사용 가능한 MDN입니다.",
          lastCheckedMdn: mdnValue,
        });
      }
    } catch (error) {
      console.error("MDN 중복 체크 오류:", error);
      setMdnCheckResult({
        checked: true,
        exists: true,
        message: "중복 체크 중 오류가 발생했습니다.",
        lastCheckedMdn: mdnValue,
      });
    } finally {
      setCheckingMdn(false);
    }
  };

  const onClose = () => {
    setIsError(false);
  };

  const onConfirm = () => {
    setIsSuccess(false);
    navigate("/cars");
  };

  /**
   * 차량 등록 method
   */
  const onSubmit = async (data: CarCreateTypes) => {
    // MDN 체크를 하지 않았거나, 중복된 MDN인 경우 등록 불가
    if (!mdnCheckResult.checked) {
      setIsError(true);
      return;
    }

    if (mdnCheckResult.exists) {
      setIsError(true);
      return;
    }

    // 천승준 - 임시 싱크용 데이터 추가
    const requestData = {
      ...data,
      sum: data.sum,
      bizId: 1,
    };
    requestData.carYear = requestData.carYear.toString();

    const carData = await carApiService.createCar(requestData);

    if (carData.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
    console.log("차량 등록 성공 데이터: ", carData.data);
  };

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
            <Label>차량 관리번호(MDN)</Label>
            <div className="flex items-center gap-2">
              <Input placeholder="최소 10자 이상 (예: 0123456789)" {...register("mdn")} />
              <Button
                type="button"
                onClick={checkMdnExists}
                variant="outline"
                size="sm"
                disabled={checkingMdn || !mdnValue || mdnValue.length < 10}
                className="whitespace-nowrap px-3 h-10"
              >
                {checkingMdn ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "중복 확인"}
              </Button>
            </div>
            {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}

            {/* MDN 중복 체크 결과 메시지 */}
            {mdnCheckResult.checked && (
              <div
                className={`flex items-center text-sm ${mdnCheckResult.exists ? "text-red-500" : "text-green-500"}`}
              >
                {mdnCheckResult.exists ? (
                  <AlertCircle className="h-4 w-4 mr-1" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                )}
                {mdnCheckResult.message}
              </div>
            )}
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
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
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
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={!mdnCheckResult.checked || mdnCheckResult.exists}
            >
              등록하기
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={isSuccess}
        onClose={onConfirm}
        title="안내"
        description="차량 신규 등록 완료!"
        confirmText="확인"
        onConfirm={onConfirm}
        showCancel={false}
      />
      <Modal
        open={isError}
        onClose={onClose}
        title="에러"
        description={mdnCheckResult.exists ? "이미 등록된 MDN입니다." : "차량 신규 등록 실패!"}
        confirmText="확인"
        onConfirm={onClose}
        showCancel={false}
      />
    </div>
  );
}
