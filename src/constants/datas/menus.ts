import { 
  Home, 
  Car, 
  FileText, 
  BarChart2,
  UserCog,
  Gamepad
} from "lucide-react";

export const headerMenus = [
  // {
  //   name: "대시보드",
  //   path: "/dashboard",
  //   icon: Home
  // },
  {
    name: "차량",
    path: "/car",
    icon: Car,
    subMenus: [
      {
        name: "차량 관리",
        path: "/car",
        icon: Car
      },
      {
        name: "예약 관리",
        path: "/car/rent",
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
        path: "/history/realtime",
        icon: FileText
      }
    ]
  },
  {
    name: "통계",
    path: "/statistic",
    icon: BarChart2
  },
  {
    name: "관리자",
    path: "/admin",
    icon: UserCog,
    subMenus: [
      {
        name: "공지사항",
        path: "/admin/notice",
        icon: UserCog
      },
      {
        name: "계정 관리",
        path: "/admin/member",
        icon: UserCog
      },
      {
        name: "관리자 통계",
        path: "/admin/statistic",
        icon: UserCog
      }
    ]
  },
  {
    name: "에뮬레이터",
    path: "/emulator",
    icon: Gamepad
  }
];