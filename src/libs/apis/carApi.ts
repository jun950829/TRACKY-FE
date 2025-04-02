import { CarCreateTypes, CarUpdateTypes } from "@/constants/types";
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
  searchOneByMdn: async (mdn: string) => {
    const response = await api.get(`${carApiRoot}/search/${mdn}`);
    return response.data;
  },
  searchOneByMdnDetail: async (mdn: string) => {
    const response = await api.get(`${carApiRoot}/search/${mdn}/detail`);
    return response.data;
  },
  createCar: async (data: CarCreateTypes) => {
    const response = await api.post(`${carApiRoot}/create`, data);
    return response.data;
  },
  updateCar: async (mdn: string, data: CarUpdateTypes) => {
    const response = await api.patch(`${carApiRoot}/update/${mdn}`, data);
    return response.data;
  },
  deleteCar: async (mdn: string) => {
    const response = await api.delete(`${carApiRoot}/delete/${mdn}`);
    return response.data;
  },
};

export default carApiService;