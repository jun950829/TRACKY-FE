"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RentDetailTypes } from '@/constants/types/types';
import { useEffect, useState } from 'react';
import Modal from '@/components/custom/Modal';
import rentApiService from '@/libs/apis/rentsApi';
import { RentStatus } from '@/constants/datas/status';
import { AddressSearch } from '@/components/address/AddressSearch';
import { AddressResult } from '@/libs/apis/addressApi';
import { formatCoordinate } from "@/libs/utils/utils";

const schema = yup.object().shape({
  mdn: yup.string().required("차량 관리번호를 입력하세요"),
  renterName: yup.string().required("대여자을 입력하세요"),
  renterPhone: yup.string().required("대여자 전화번호를 입력하세요").matches(/^010-\d{4}-\d{4}$/, "전화번호 형식은 010-0000-0000이어야 합니다."),
  purpose: yup.string().required("사용 목적을 입력하세요"),
  rentStatus: yup.string().required("대여 상태를 입력하세요"),
  rentStime: yup.string().required("대여 시작 시간을 선택하세요"),
  rentLoc: yup.string().required("대여 시작 위치를 선택하세요"),
  rentEtime: yup.string().required("반납 시간를 선택하세요"),
  returnLoc: yup.string().required("반납 위치를 선택하세요"),
  rentLat: yup.number().optional(),
  rentLon: yup.number().optional(),
  returnLat: yup.number().optional(),
  returnLon: yup.number().optional(),
});

type FormValues = yup.InferType<typeof schema>;

type RentUpdateModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  initialData: RentDetailTypes;
};

function RentUpdateModal({ isOpen, closeModal, initialData }: RentUpdateModalProps) {
  // 상태 관련
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isTimeError, setIsTimeError] = useState(false);
  const [mdnList, setMdnList] = useState<string[]>([]);
  const [rentLocation, setRentLocation] = useState<AddressResult | null>(null);
  const [returnLocation, setReturnLocation] = useState<AddressResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      mdn: initialData.mdn,
      renterName: initialData.renterName,
      renterPhone: initialData.renterPhone,
      purpose: initialData.purpose,
      rentStatus: initialData.rentStatus,
      rentStime: initialData.rentStime,
      rentLoc: initialData.rentLoc,
      rentEtime: initialData.rentEtime,
      returnLoc: initialData.returnLoc,
    },
  });

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

  const submitHandler = (data: FormValues) => {
    if (!rentLocation || !returnLocation) {
      setIsError(true);
      return;
    }

    if(new Date(data.rentStime) >= new Date(data.rentEtime)) {
      setIsTimeError(true);
      return;
    }

    const updateData = {
      ...data,
      rentLat: formatCoordinate(Number(rentLocation.y)),
      rentLon: formatCoordinate(Number(rentLocation.x)),
      returnLat: formatCoordinate(Number(returnLocation.y)),
      returnLon: formatCoordinate(Number(returnLocation.x)),
      rentLoc: rentLocation.address_name + " " + rentLocation.place_name,
      returnLoc: returnLocation.address_name + " " + returnLocation.place_name
    };

    sendUpdate(initialData.rent_uuid, updateData);
  };

  const sendUpdate = async (rent_uuid: string, data: FormValues) => {
    console.log("data", data);
    const updateRentObj = {
      mdn: data.mdn,
      renterName: data.renterName,
      renterPhone: data.renterPhone,
      purpose: data.purpose,
      rentStatus: data.rentStatus,
      rentStime: data.rentStime,
      rentLoc: data.rentLoc,
      rentEtime: data.rentEtime,
      returnLoc: data.returnLoc,
      rentLat: data.rentLat,
      rentLon: data.rentLon,
      returnLat: data.returnLat,
      returnLon: data.returnLon,
    };

    const updatedRentRes = await rentApiService.updateRent(rent_uuid, updateRentObj);
    if (updatedRentRes.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }
  };

  const onConfirm = () => {
    setIsSuccess(false);
    closeModal();
    // 천승준 - 임시 새로 고침
    window.location.reload();
  };

  const onClose = () => {
    setIsError(false);
    setIsTimeError(false);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>렌트 정보 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">차량 관리번호</label>
              <Select defaultValue={initialData.mdn} onValueChange={(val) => setValue('mdn', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="차량 관리번호를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {mdnList.map((mdn: string, idx: number) => (
                    <SelectItem key={idx} value={mdn}>{mdn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">대여자 이름</label>
              <Input {...register("renterName")} />
              {errors.renterName && (
                <p className="text-sm text-red-500">{errors.renterName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">대여자 전화번호</label>
              <Input {...register("renterPhone")} />
              {errors.renterPhone && (
                <p className="text-sm text-red-500">{errors.renterPhone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">사용 목적</label>
              <Input {...register("purpose")} />
              {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">대여 상태</label>
              <Select
                defaultValue={initialData.rentStatus?.toLowerCase()}
                onValueChange={(val) => setValue('rentStatus', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="대여 상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {RentStatus
                    .filter(status => status.value !== 'all')
                    .map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rentStatus && <p className="text-sm text-red-500">{errors.rentStatus.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">대여 시작 시간</label>
              <Input 
                type="datetime-local" 
                {...register('rentStime')} 
                defaultValue={initialData.rentStime}
              />
              {errors.rentStime && <p className="text-sm text-red-500">{errors.rentStime.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">대여 시작 위치</label>
              <AddressSearch
                onSelect={setRentLocation}
                placeholder="대여 위치를 검색하세요"
                defaultValue={initialData.rentLoc}
              />
              {errors.rentLoc && <p className="text-sm text-red-500">{errors.rentLoc.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">대여 종료 시간</label>
              <Input 
                type="datetime-local" 
                {...register('rentEtime')} 
                defaultValue={initialData.rentEtime}
              />
              {errors.rentEtime && <p className="text-sm text-red-500">{errors.rentEtime.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">반납 위치</label>
              <AddressSearch
                onSelect={setReturnLocation}
                placeholder="반납 위치를 검색하세요"
                defaultValue={initialData.returnLoc}
              />
              {errors.returnLoc && (
                <p className="text-sm text-red-500">{errors.returnLoc.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">수정</Button>
              <Button type="button" variant="ghost" onClick={closeModal}>
                취소
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Modal open={isSuccess} onClose={onConfirm} title="안내" description="렌트 수정 완료!" confirmText="확인" onConfirm={onConfirm} showCancel={false}/>
      <Modal open={isError} onClose={onClose} title="에러" description="렌트 수정 실패!" confirmText="확인" onConfirm={onClose} showCancel={false}/>
      <Modal open={isTimeError} onClose={onClose} title="에러" description="반납 시간은 대여 시간 이후여야 합니다!" confirmText="확인" onConfirm={onClose} showCancel={false}/>
    </>
  );
}

export default RentUpdateModal;
