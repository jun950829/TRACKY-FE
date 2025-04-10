import { RentDetailTypes } from "@/constants/types/types";
import { formatDateTime } from "@/libs/utils/utils";
import React from "react";
import { RentStatus } from "@/constants/datas/status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentData: RentDetailTypes;
}

const RentDetailModal: React.FC<RentDetailModalProps> = ({ isOpen, onClose, rentData}) => {
  if (!isOpen) return null;

  console.log(rentData);

  //렌트 상태 한글로 매칭
  const getStatusLabel = (value: string) => {
    const status = RentStatus.find((s) => s.value === value);
    return status ? status.label : value; // 매칭이 안되면 value 그대로 보여줌
  };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>대여 상세 정보</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 text-sm text-gray-700">
                    <div><strong>예약 번호:</strong> {rentData.rent_uuid}</div>
                    <div><strong>차량 관리번호:</strong> {rentData.mdn}</div>
                    <div><strong>사용자 이름:</strong> {rentData.renterName}</div>
                    <div><strong>사용자 전화번호:</strong> {rentData.renterPhone}</div>
                    <div><strong>차량 사용 목적:</strong> {rentData.purpose}</div>
                    <div><strong>대여 상태:</strong> {getStatusLabel(rentData.rentStatus)}</div>
                    <div><strong>대여 시작 시간:</strong> {formatDateTime(rentData.rentStime)}</div>
                    <div><strong>대여 위치:</strong> {rentData.rentLoc}</div>
                    <div><strong>대여 종료 시간:</strong> {formatDateTime(rentData.rentEtime)}</div>
                    <div><strong>반납 위치:</strong> {rentData.returnLoc}</div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
  
export default RentDetailModal;
