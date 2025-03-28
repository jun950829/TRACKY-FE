import api from "./api";

// ✅ API 요청 함수들
export const carApiService = {
  getCars: async () => {
    const response = await api.get("/car/all");
    return response.data;
  },
  searchByMdn: async (searchText: string) => {
    // 검색어가 없을 땐 전체 검색
    if(searchText !== '') {
      const response = await api.get(`/car/searchbymdn/${searchText}`);
      return response.data;
    } else {
      const response = await api.get("/car/all");
      return response.data;
    }
  },
  searchById: async (id: number) => {
    const response = await api.get(`/car/searchbyid/detail/${id}`);
    return response.data;
  }
};

export default carApiService;