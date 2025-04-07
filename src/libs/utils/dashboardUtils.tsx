import { CarStatus } from "@/constants/datas/status";
import { Car, Settings, Clock, Ban } from "lucide-react";
import React from "react";

export const getStatusLabel = (status: string): string => {
  // 상태값에 따른 한글 라벨 반환
  return CarStatus.find(opt => opt.value === status)?.label || status;
}


export const getStatusIcon = (status: string): React.ReactNode => {
  // 상태별 아이콘 설정
  switch(status) {
    case 'running':
      return <Car className="text-green-800 w-5 h-5" />;
    case 'fixing':
      return <Settings className="text-yellow-800 w-5 h-5" />;
    case 'waiting':
      return <Clock className="text-blue-800 w-5 h-5" />;
    case 'closed':
      return <Ban className="text-red-800 w-5 h-5" />;
    default:
      return <Car className="text-gray-800 w-5 h-5" />;
  }
}; 