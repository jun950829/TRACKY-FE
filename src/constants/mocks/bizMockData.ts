export interface Biz {
  id: string;
  name: string;
  businessNumber: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

export const mockBizs: Biz[] = [
  {
    id: "1",
    name: "서울렌트카",
    businessNumber: "123-45-67890",
    manager: "김철수",
    phone: "02-1234-5678",
    email: "seoul@rent.com",
    address: "서울시 강남구",
    status: "active",
  },
  {
    id: "2",
    name: "부산렌트카",
    businessNumber: "987-65-43210",
    manager: "이영희",
    phone: "051-1234-5678",
    email: "busan@rent.com",
    address: "부산시 해운대구",
    status: "active",
  },
]; 