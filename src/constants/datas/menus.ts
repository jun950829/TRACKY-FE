import { 
  Home, 
  Users, 
  Settings, 
  Car, 
  FileText, 
  BarChart2,
  UserCog
} from "lucide-react";

export const headerMenus = [
  {
    name: "대시보드",
    path: "/dashboard",
    icon: Home
  },
  {
    name: "차량",
    path: "/cars",
    icon: Car,
    subMenus: [
      {
        name: "차량 관리",
        path: "/cars",
        icon: Car
      },
      {
        name: "예약 관리",
        path: "/rents",
        icon: Car
      }
    ]
  },
  {
    name: "운행 기록",
    path: "/history",
    icon: FileText,
    subMenus: [
      {
        name: "운행 일지",
        path: "/history",
        icon: FileText
      },
      {
        name: "실시간",
        path: "/history",
        icon: FileText
      }
    ]
  },
  {
    name: "통계",
    path: "/statistics",
    icon: BarChart2
  },
  {
    name: "관리자",
    path: "/admin",
    icon: UserCog
  },
  {
    name: "에뮬레이터",
    path: "/emulator",
    icon: Car
  }
];