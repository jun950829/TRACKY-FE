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
import { CarDetailTypes } from '@/constants/types';
import { CarStatus } from '@/constants/status';
import carApiService from '@/libs/apis/carApi';
import { useState } from 'react';
import Modal from '@/components/custom/Modal';


const schema = yup.object().shape({
  mdn: yup.string().required('식별 키를 입력하세요'),
  carType: yup.string().required('모델명을 입력하세요'),
  carPlate: yup.string().required('번호판을 입력하세요'),
  carYear: yup.string().required('연식을 입력하세요'),
  purpose: yup.string().required('목적을 입력하세요'),
  status: yup.string().required('상태를 선택하세요'),
});

type FormValues = yup.InferType<typeof schema>;

type CarUpdateModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  initialData: CarDetailTypes;
};

function CarUpdateModal({ isOpen, closeModal, initialData }: CarUpdateModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      mdn: initialData.mdn,
      carType: initialData.carType,
      carPlate: initialData.carPlate,
      carYear: initialData.carYear,
      purpose: initialData.purpose,
      status: initialData.status,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = (data: FormValues) => {
    sendUpdate(initialData.mdn, data);
  };

  const sendUpdate = async (mdn: string, data: FormValues) => {
    const updateCarObj = {
      mdn: data.mdn,
      bizId: initialData.bizId,
      carType: data.carType,
      carPlate: data.carPlate,
      carYear: data.carYear,
      purpose: data.purpose,
      status: data.status,
      sum: initialData.sum,
      deviceInfo: initialData.deviceInfo,
    };

    const updatedCarRes = await carApiService.updateCar(mdn, updateCarObj);
    if(updatedCarRes.status === 200) {
      setIsSuccess(true);
    } else {
      setIsError(true);
    }

  }

  const onConfirm = () => {
    setIsSuccess(false);
    closeModal();
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
              <label className="block text-sm font-medium">식별 키 (MDN)</label>
              <Input {...register('mdn')} />
              {errors.mdn && <p className="text-sm text-red-500">{errors.mdn.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">차량 모델</label>
              <Input {...register('carType')} />
              {errors.carType && <p className="text-sm text-red-500">{errors.carType.message}</p>}
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
                defaultValue={initialData.status}
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