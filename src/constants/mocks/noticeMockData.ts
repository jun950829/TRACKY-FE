export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isImportant: boolean;
}

export const mockNotices: Notice[] = [
  {
    id: "1",
    title: "시스템 점검 안내",
    content: "2024년 3월 15일 02:00 ~ 04:00 동안 시스템 점검이 진행됩니다.",
    author: "관리자",
    createdAt: "2024-03-10",
    isImportant: true,
  },
  {
    id: "2",
    title: "신규 기능 업데이트",
    content: "차량 관리 기능이 업데이트되었습니다. 자세한 내용은 공지사항을 참고해주세요.",
    author: "관리자",
    createdAt: "2024-03-05",
    isImportant: false,
  },
]; 