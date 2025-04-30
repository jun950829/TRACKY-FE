import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/custom/PageHeader";
import carApiService from "@/libs/apis/carApi";
import { CarCreateTypes } from "@/constants/types/types";
import Modal from "@/components/custom/Modal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Select, SelectTrigger } from "@/components/ui/select";
import { CarType } from "@/constants/datas/status";

const schema = yup.object({
  mdn: yup.string().min(10).max(11).required("차량 관리번호를 입력해주세요."),
  carType: yup.string().required("차종을 선택해주세요."),
  carName: yup.string().required("차량 모델명을 입력해주세요."),
  carPlate: yup.string().required("차량 번호를 입력해주세요."),
  carYear: yup
    .number()
    .typeError("숫자로 입력해주세요.")
    .min(1900, "유효한 연식을 입력해주세요.")
    .max(new Date().getFullYear(), "미래 연도는 입력할 수 없습니다.")
    .required("연식을 입력하세요"),
  purpose: yup.string().required("차량 용도를 입력해주세요."),
  sum: yup.number().required("주행거리를 입력해주세요.").typeError("숫자만 입력 가능합니다."),
});

type MdnCheckResult = {
  checked: boolean;
  exists: boolean;
  message: string;
  lastCheckedMdn?: string;
};


export default function CarRegister() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [checkingMdn, setCheckingMdn] = useState(false);
  const [mdnCheckResult, setMdnCheckResult] = useState<MdnCheckResult>({
    checked: false,
    exists: false,
    message: "",
    lastCheckedMdn: undefined,
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

  const mdnValue = watch("mdn");

  useEffect(() => {
    if (mdnCheckResult.checked && mdnValue !== mdnCheckResult.lastCheckedMdn) {
      setMdnCheckResult({
        checked: false,
        exists: false,
        message: "",
        lastCheckedMdn: undefined,
      });
    }
  }, [mdnValue, mdnCheckResult.checked, mdnCheckResult.lastCheckedMdn]);

  const checkMdnExists = async () => {
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

      setMdnCheckResult({
        checked: true,
        exists: response.data,
        message: response.data ? "이미 등록된 MDN입니다." : "사용 가능한 MDN입니다.",
        lastCheckedMdn: mdnValue,
      });
    } catch (error) {
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

  const onClose = () => setIsError(false);
  const onConfirm = () => {
    setIsSuccess(false);
    navigate("/car");
  };

  const onSubmit = async (data: CarCreateTypes) => {
    if (!mdnCheckResult.checked || mdnCheckResult.exists) {
      setIsError(true);
      return;
    }

    const requestData = {
      ...data,
      sum: data.sum,
      bizId: 1,
      status: "waiting",
      carYear: data.carYear.toString(),
    };

    const carData = await carApiService.createCar(requestData);

    if (carData.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <PageHeader title="차량 등록" size="2xl" bold />
            <p className="text-sm text-muted-foreground">차량 정보를 입력해 주세요.</p>

            {/* 차량 관리번호 */}
            <div className="space-y-2">
              <Label>차량 관리번호</Label>
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
              {mdnCheckResult.checked && (
                <div
                  className={`flex items-center text-sm ${
                    mdnCheckResult.exists ? "text-red-500" : "text-green-500"
                  }`}
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

            {/* 차종 */}
            <div className="space-y-2">
              <Label>차종</Label>
              <Select onValueChange={(val) => setValue("carType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="차종을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {CarType.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carType && <p className="text-sm text-red-500">{errors.carType.message}</p>}
            </div>

            {/* 차량 모델명 */}
            <div className="space-y-2">
              <Label>차량 모델명</Label>
              <Input placeholder="예: 카니발, 아반떼" {...register("carName")} />
              {errors.carName && <p className="text-sm text-red-500">{errors.carName.message}</p>}
            </div>

            {/* 차량 번호 */}
            <div className="space-y-2">
              <Label>차량 번호</Label>
              <Input placeholder="예: 12가 3456" {...register("carPlate")} />
              {errors.carPlate && <p className="text-sm text-red-500">{errors.carPlate.message}</p>}
            </div>

            {/* 연식 */}
            <div className="space-y-2">
              <Label>연식</Label>
              <Input placeholder="예: 2020" {...register("carYear")} />
              {errors.carYear && <p className="text-sm text-red-500">{errors.carYear.message}</p>}
            </div>

            {/* 사용 목적 */}
            <div className="space-y-2">
              <Label>사용 목적</Label>
              <Input placeholder="예: 렌트, 법인" {...register("purpose")} />
              {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
            </div>

            {/* 주행 거리 */}
            <div className="space-y-2">
              <Label>주행거리</Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={0} {...register("sum")} />
                <span className="text-sm">km</span>
              </div>
              {errors.sum && <p className="text-sm text-red-500">{errors.sum.message}</p>}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                취소
              </Button>
              <Button type="submit" disabled={!mdnCheckResult.checked || mdnCheckResult.exists}>
                등록하기
              </Button>
            </div>
          </form>
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
        description={
          mdnCheckResult.exists ? "이미 등록된 MDN입니다." : "차량 신규 등록 실패!"
        }
        confirmText="확인"
        onConfirm={onClose}
        showCancel={false}
      />
    </div>
  );
}