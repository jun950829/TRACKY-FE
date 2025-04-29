import { RentDetailTypes } from "@/constants/types/types";
import { formatDateTime } from "@/libs/utils/utils";
import { RentStatus } from "@/constants/datas/status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CarFront, FileText, MapPin, Phone, User } from "lucide-react";
import React from "react";
import StatusBadge from "@/components/custom/StatusBadge";

interface RentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentData: RentDetailTypes;
}

const RentDetailModal: React.FC<RentDetailModalProps> = ({ isOpen, onClose, rentData }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CarFront className="h-5 w-5 text-primary" />
            렌트 상세 정보 {StatusBadge({ status: rentData.rentStatus.toLowerCase(), type: 'rent' })}
          </DialogTitle> 
        </DialogHeader>

        <div className="space-y-4">
          {/* 예약 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    예약 번호
                  </div>
                  <div className="font-medium">{rentData.rent_uuid}</div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <CarFront className="h-4 w-4" />
                    차량 관리번호
                  </div>
                  <div className="font-medium">{rentData.mdn}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 사용자 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    사용자 이름
                  </div>
                  <div className="font-medium">{rentData.renterName}</div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    사용자 전화번호
                  </div>
                  <div className="font-medium">{rentData.renterPhone}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 대여 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    사용 목적
                  </div>
                  <div className="font-medium text-xs">{rentData.purpose}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    대여 기간
                  </div>
                  <div className="font-medium text-xs">{formatDateTime(rentData.rentStime)} ~ {formatDateTime(rentData.rentEtime)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    대여 위치
                  </div>
                  <div className="font-medium text-xs">{rentData.rentLoc}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    반납 위치
                  </div>
                  <div className="font-medium text-xs">{rentData.returnLoc}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentDetailModal;