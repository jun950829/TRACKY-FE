export interface Member {
  id: string;
  name: string;
  businessNumber: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "회원 1",
    businessNumber: "123-45-67890",
    manager: "홍길동",
    phone: "010-1234-5678",
    email: "member1@example.com",
    address: "서울시 강남구",
    status: "active",
  },
  {
    id: "2",
    name: "회원 2",
    businessNumber: "987-65-43210",
    manager: "김철수",
    phone: "010-8765-4321",
    email: "member2@example.com",
    address: "서울시 서초구",
    status: "inactive",
  },
]; 