'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CarDetailTypes } from '@/constants/types/types';
import { CarStatus, CarType } from '@/constants/datas/status';
import carApiService from '@/libs/apis/carApi';
import { useState } from 'react';
import Modal from '@/components/custom/Modal';
import { getCarTypeLabel } from '@/libs/utils/getClassUtils';


const schema = yup.object().shape({
  mdn: yup.string().required('식별 키를 입력하세요'),
  carType: yup.string().required('차종을 선택하세요'),
  carName: yup.string().required('모델명을 입력하세요'),
  carPlate: yup.string().required('번호판을 입력하세요'),
  carYear: yup.number().typeError('숫자로 입력해주세요.')
  .min(1900, '유효한 연식을 입력해주세요.')
  .max(new Date().getFullYear(), '미래 연도는 입력할 수 없습니다.').required('연식을 입력하세요'),
  purpose: yup.string().required('목적을 입력하세요'),
  status: yup.string().required('상태를 선택하세요'),
});

type FormValues = yup.InferType<typeof schema>;

type CarUpdateModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  initialData: CarDetailTypes;
  reload: (isReload: boolean) => void;
};

function CarUpdateModal({ isOpen, closeModal, initialData, reload }: CarUpdateModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      mdn: initialData.mdn,
      carType: initialData.carType,
      carName: initialData.carName,
      carPlate: initialData.carPlate,
      carYear: Number(initialData.carYear),
      purpose: initialData.purpose,
      status: initialData.status,
    },
  });

  const submitHandler = (data: FormValues) => {
    sendUpdate(initialData.mdn, {
      ...data,
      mdn: initialData.mdn
    });
  };

  const sendUpdate = async (mdn: string, data: FormValues) => {
    const updateCarObj = {
      mdn: initialData.mdn,
      bizId: initialData.bizId,
      carType: data.carType,
      carName: data.carName,
      carPlate: data.carPlate,
      carYear: data.carYear.toString(),
      purpose: data.purpose,
      status: data.status,
      sum: initialData.sum,
      deviceInfo: initialData.deviceInfo,
    };

    const updatedCarRes = await carApiService.updateCar(updateCarObj);
    if(updatedCarRes.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }

  }

  const onConfirm = () => {
    setIsSuccess(false);
    closeModal();
    reload(true);
  }

  const onClose = () => {
    setIsError(false);
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>차량 정보 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">식별 키 (MDN) <span className="text-xs text-gray-500">(수정 불가)</span></label>
              <Input {...register('mdn')} disabled className="bg-gray-100 text-gray-600" />
              {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">차종</label>
              <Select
                defaultValue={initialData.carType.toLowerCase()}
                onValueChange={(val) => setValue('carType', val)}
              >
                <SelectTrigger>
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  {CarType.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carType && <p className="text-sm text-red-500">{errors.carType.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">차량 모델</label>
              <Input {...register('carName')} />
              {errors.carName && <p className="text-sm text-red-500">{errors.carName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">차량 번호판</label>
              <Input {...register('carPlate')} />
              {errors.carPlate && <p className="text-sm text-red-500">{errors.carPlate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">연식</label>
              <Input {...register('carYear')} />
              {errors.carYear && <p className="text-sm text-red-500">{errors.carYear.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">사용 목적</label>
              <Input {...register('purpose')} />
              {errors.purpose && <p className="text-sm text-red-500">{errors.purpose.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">차량 상태</label>
              <Select
                defaultValue={initialData.status.toLowerCase()}
                onValueChange={(val) => setValue('status', val)}
              >
                <SelectTrigger>
                  <SelectValue  />
                </SelectTrigger>
                <SelectContent>
                  {CarStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
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

      <Modal open={isSuccess} onClose={onConfirm} title="안내" description="차량 수정 완료!" confirmText="확인" onConfirm={onConfirm} showCancel={false}/>
      <Modal open={isError} onClose={onClose} title="에러" description="차량 수정 실패!" confirmText="확인" onConfirm={onClose} showCancel={false}/>
    </> 
  );
}

export default CarUpdateModal;