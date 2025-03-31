import { CarCreateTypes } from "@/constants/types";
import api from "./api";

const carApiRoot = "/cars";

// ✅ API 요청 함수들
export const carApiService = {
  getCars: async () => {
    const response = await api.get(`${carApiRoot}/all`);
    return response.data;
  },
  searchByMdn: async (searchText: string) => {
    // 검색어가 없을 땐 전체 검색
    if(searchText !== '') {
      const response = await api.get(`/cars/search?mdn=${searchText}`);
      return response.data;
    } else {
      const response = await api.get(`${carApiRoot}/all`);
      return response.data;
    }
  },
  searchById: async (id: number) => {
    const response = await api.get(`${carApiRoot}/search/${id}`);
    return response.data;
  },
  searchByIdDetail: async (id: number) => {
    const response = await api.get(`${carApiRoot}/search/${id}/detail`);
    return response.data;
  },
  createCar: async (data: CarCreateTypes) => {
    const response = await api.post(`${carApiRoot}/create`, data);
    return response.data;
  },
};

export default carApiService;