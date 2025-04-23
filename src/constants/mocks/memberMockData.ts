export interface Member {
  bizName: string;
  bizRegName: string;
  bizAdmin: string;
  bizPhoneNumber: string;
  memberId: string;
  email: string;
  role: string;
  status: string;
  createAt: string;
}

export const mockMembers: Member[] = [
  {
    bizName: "회원 1",
    bizRegName: "123-45-67890",
    bizAdmin: "홍길동",
    bizPhoneNumber: "010-1234-5678",
    memberId: "member1@example.com",
    email: "member1@example.com",
    role: "active",
    status: "active",
    createAt: "2021-01-01",
  },
  {
    bizName: "회원 2",
    bizRegName: "987-65-43210",
    bizAdmin: "김철수",
    bizPhoneNumber: "010-8765-4321",
    memberId: "member2@example.com",
    email: "member2@example.com",
    role: "active",
    status: "active",
    createAt: "2021-01-01",
  },
]; 