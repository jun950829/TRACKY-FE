import { CarStatus } from "@/constants/datas/status";
import { Statistics } from "@/constants/types/types";
import { Activity, Calendar, Car, Settings, Clock, Ban, Bell } from "lucide-react";
import React from "react";

export const getStatusLabel = (status: string): string => {
  // 상태값에 따른 한글 라벨 반환
  return CarStatus.find(opt => opt.value === status)?.label || status;
}


export const getCarStatusIcon = (status: string): React.ReactNode => {
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

export const getReservationStatus = (status: string): { color: string, icon:  React.ReactNode } => {

  switch(status) {
    case 'waiting':
      return { color: 'bg-blue-100 text-blue-600', icon: <Clock className="text-blue-800 w-5 h-5" /> };
    case 'renting':
      return { color: 'bg-green-100 text-green-600', icon: <Car className="text-green-800 w-5 h-5" /> };
    case 'returned':
      return { color: 'bg-purple-100 text-purple-600', icon: <Car className="text-yellow-800 w-5 h-5" /> };
    case 'canceled':
      return { color: 'bg-red-100 text-red-600', icon: <Ban className="text-red-800 w-5 h-5" />};
    default:
      return { color: 'bg-zinc-100 text-zinc-600', icon: <Car className="text-gray-800 w-5 h-5" />};
  }
}

export const makeStatisticsItems = (statistics: Statistics) => {
  const statisticsItems = [
    {
      id: 'total-km',
      icon: <Activity className="h-4 w-4 text-purple-500" />,
      title: '총 운행거리',
      value: `${statistics.totalDriveDistance.toFixed(2)} km`,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'total-usage-time',
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      title: '누적 이용시간',
      value: `${statistics.totalDriveDurationInMinutes}시간`,
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'total-rents',
      icon: <Calendar className="h-4 w-4 text-indigo-500" />,
      title: '총 렌트 수',
      value: `${statistics.totalRentCount} 건`,
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'total-cars',
      icon: <Car className="h-4 w-4 text-cyan-500" />,
      title: '총 차량 수',
      value: `${statistics.totalCarCount} 대`,
      color: 'bg-cyan-50 border-cyan-200'
    }
  ];

  return statisticsItems;
}

export const RecentActivityIcon = (event: string, method: string) => {
  const color = RecentActivityColor(method);

  switch(event) {
    case 'car_event':
      return <Car className={`text-${color}-800 w-5 h-5`} />;
    case 'rent_event':
      return <Calendar className={`text-${color}-800 w-5 h-5`} />;
    case 'alarm_event':
      return <Bell className={`text-${color}-800 w-5 h-5`} />;
    default:
      return <Activity className={`text-${color}-800 w-5 h-5`} />;
  }
}

export const RecentActivityColor = (method: string) => {
  switch(method) {
    case 'create':
      return 'green';
    case 'update':
      return 'blue';
    case 'delete':
      return 'red';
    default:
      return 'zinc';
  }
}