import { CarDetailTypes } from '@/constants/types/types';
import React from 'react';
import { CarStatus } from "@/constants/datas/status";
import { Car, Phone, Building2, User, Calendar, FileText, CarFront } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface CarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  carData: CarDetailTypes;
}

const CarDetailModal: React.FC<CarDetailModalProps> = ({ isOpen, onClose, carData }) => {
  if (!isOpen) return null;

  const getStatusLabel = (value: string) => {
    const status = CarStatus.find((s) => s.value === value);
    return status ? status.label : value; // 매칭이 안되면 value 그대로 보여줌
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CarFront className="h-5 w-5 text-primary" />
            차량 상세 정보
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 차량 기본 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Car className="h-4 w-4" />
                    차량 번호
                  </div>
                  <div className="font-medium">{carData.carPlate}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Car className="h-4 w-4" />
                    차종
                  </div>
                  <div className="font-medium">{carData.carType}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    연식
                  </div>
                  <div className="font-medium">{carData.carYear}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FileText className="h-4 w-4" />
                    용도
                  </div>
                  <div className="font-medium">{carData.purpose}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 업체 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-3">
                <Building2 className="h-4 w-4" />
                업체 정보
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Building2 className="h-4 w-4" />
                    업체명
                  </div>
                  <div className="font-medium">{'-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Phone className="h-4 w-4" />
                    전화번호
                  </div>
                  <div className="font-medium">{'-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FileText className="h-4 w-4" />
                    사업자 번호
                  </div>
                  <div className="font-medium">{'-'}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <User className="h-4 w-4" />
                    관리자
                  </div>
                  <div className="font-medium">{'-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 디바이스 정보 */}
          <Card className="border-zinc-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-3">
                <Car className="h-4 w-4" />
                디바이스 정보
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FileText className="h-4 w-4" />
                    MID
                  </div>
                  <div className="font-medium">{carData.deviceInfo.mid}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FileText className="h-4 w-4" />
                    DID
                  </div>
                  <div className="font-medium">{carData.deviceInfo.did}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FileText className="h-4 w-4" />
                    PV
                  </div>
                  <div className="font-medium">{carData.deviceInfo.pv}</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    등록일
                  </div>
                  <div className="font-medium">
                    {new Date(carData.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailModal;
