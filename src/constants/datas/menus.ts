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
    name: "차량 관리",
    path: "/vehicles",
    icon: Car
  },
  {
    name: "운행 관리",
    path: "/trips",
    icon: FileText
  },
  {
    name: "통계",
    path: "/statistics",
    icon: BarChart2
  },
  {
    name: "회원 관리",
    path: "/members",
    icon: Users
  },
  {
    name: "설정",
    path: "/settings",
    icon: Settings
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