import Modal from "@/components/custom/Modal";
import PageHeader from "@/components/custom/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RentCreateTypes } from "@/constants/types/types";
import rentApiService from "@/libs/apis/rentsApi";
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AddressSearch } from '@/components/address/AddressSearch';
import { AddressResult } from '@/libs/apis/addressApi';
import { formatCoordinate } from "@/libs/utils/utils";
import { formatPhoneNumber } from "@/libs/utils/phoneFormat";

const schema = yup.object({
    mdn: yup.string().required("차량 관리번호를 선택해주세요."),
    renterName: yup.string().required("사용자 이름을 입력해주세요."),
    renterPhone: yup.string().required("사용자 전화번호를 입력해주세요.")
    .matches(/^010-\d{4}-\d{4}$/, "전화번호 형식은 010-****-****이어야 합니다."),
    rentStime: yup.string().required("대여 시간 입력해주세요."),
    rentEtime: yup.string().required("반납 시간 입력해주세요."),
    rentLoc: yup.string().required("대여 할 위치를 입력해주세요."),
    returnLoc: yup.string().required("반납 할 위치를 입력해주세요."),
    purpose: yup.string().required("사용목적 입력해주세요.")
})

interface MdnStatus {
    mdn: string;
    status: string;
}

function RentRegister() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [mdnList, setMdnList] = useState<MdnStatus[]>([]);
    const navigate = useNavigate();
    const [rentLocation, setRentLocation] = useState<AddressResult | null>(null);
    const [returnLocation, setReturnLocation] = useState<AddressResult | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

    const phoneValue = watch("renterPhone");
    const { onChange, ...rest } = register("renterPhone");

    // 주소 선택 시 폼 값 업데이트
    useEffect(() => {
        if (rentLocation) {
            setValue('rentLoc', rentLocation.address_name + " " + rentLocation.place_name);
        }
    }, [rentLocation, setValue]);

    useEffect(() => {
        if (returnLocation) {
            setValue('returnLoc', returnLocation.address_name + " " + returnLocation.place_name);
        }
    }, [returnLocation, setValue]);

    useEffect(() => {
        const fetchMdns = async () => {
            try {
                const result = await rentApiService.getMdns();
                setMdnList(result.data);
            } catch (e) {
                console.error("mdn 목록을 불러오는 중 오류 발생", e);
            }
        };
        fetchMdns();
    }, []);

    const onClose = () => {
        setIsError(false);
    }

    const onConfirm = () => {
        setIsSuccess(false);
        navigate("/car/rent");
    }

    /**
     * 대여 등록 method
     * @param data
     */
    const onSubmit = async (data: RentCreateTypes) => {
        if (!rentLocation || !returnLocation) {
            setIsError(true);
            return;
        }

        const requestData = {
            ...data,
            rentLat: formatCoordinate(Number(rentLocation.y)),
            rentLon: formatCoordinate(Number(rentLocation.x)),
            returnLat: formatCoordinate(Number(returnLocation.y)),
            returnLon: formatCoordinate(Number(returnLocation.x)),
            rentLoc: rentLocation.address_name + " " + rentLocation.place_name,
            returnLoc: returnLocation.address_name + " " + returnLocation.place_name
        }
        try {
            const rentData = await rentApiService.createRent(requestData);
        
            if (rentData.status === 200) {
                setIsSuccess(true);
                console.log("차량 등록 성공 데이터: ", rentData.data);
            } else {
                alert("대여 등록에 실패했습니다.");
            }
        } catch (error: any) {
            console.error('대여 등록 실패', error);
        
            const errorResponse = error?.response?.data;
            const baseMessage = errorResponse?.message || "대여 등록에 실패했습니다.";
            const detailMessage = errorResponse?.detailMessage;
        
            const fullMessage = detailMessage ? `${detailMessage}` : baseMessage;
        
            alert(fullMessage);
        }
    }
    return (
        <div className="max-w-xl mx-auto py-10">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <PageHeader title="대여 등록" size="2xl" bold={true} />
                    <p className="text-sm text-muted-foreground">
                        대여 정보를 입력해 주세요.
                    </p>

                    <div className="space-y-2">
                        <Label>차량 관리번호</Label>
                        <Select onValueChange={(val) => setValue('mdn', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="차량 관리번호 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {mdnList.map((mdnStatus: MdnStatus, idx: number) => (
                                    <SelectItem key={idx} value={mdnStatus.mdn}>{mdnStatus.mdn} {mdnStatus.status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>사용자 이름</Label>
                        <Input placeholder="예: 구지원" {...register("renterName")} />
                        {errors.renterName && <p className="text-sm text-red-500">{errors.renterName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>사용자 전화번호</Label>
                        <Input placeholder="예: 010-1234-5678" value={phoneValue}
                            onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                setValue("renterPhone", formatted);
                                onChange(e); }}
                            inputMode="numeric"
                            maxLength={13}
                            {...rest}   />
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
                        <AddressSearch
                            onSelect={setRentLocation}
                            placeholder="대여 위치를 검색하세요"
                        />
                        {errors.rentLoc && <p className="text-sm text-red-500">{errors.rentLoc.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>반납 위치</Label>
                        <AddressSearch
                            onSelect={setReturnLocation}
                            placeholder="반납 위치를 검색하세요"
                        />
                        {errors.returnLoc && <p className="text-sm text-red-500">{errors.returnLoc.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>사용 목적</Label>
                        <Input placeholder="예: 출장, 업무용" {...register("purpose")} />
                        {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={() => navigate("/car/rent")}>취소</Button>
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
