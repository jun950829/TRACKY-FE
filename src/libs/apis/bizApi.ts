import api from "./api";

// ✅ API 요청 함수들
export const bizApiService = {
  getBizs: async () => {
    const response = await api.get("/biz/all");
    return response.data;
  },
};

export default bizApiService;