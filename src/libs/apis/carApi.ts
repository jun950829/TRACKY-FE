import { CarCreateTypes, CarUpdateTypes } from "@/constants/types/types";
import api from "./api";

const carApiRoot = "/cars";

// Car API 요청 함수들
export const carApiService = {
  getCars: async () => {
    const response = await api.get(`${carApiRoot}/all`);
    return response.data;
  },
  checkMdnExists: async (mdn: string) => {
    const response = await api.get(`${carApiRoot}/check-mdn/${mdn}`);
    return response.data;
  },
  searchByFilters: async (searchText: string, status?: string, purpose?: string) => {
    // 검색 파라미터 구성
    const params = new URLSearchParams();
    
    // searchText가 빈 문자열이 아닐 때만 mdn 파라미터로 추가
    if (searchText && searchText.trim() !== '') {
      params.append('mdn', searchText.trim());
    }
    
    if (status) {
      params.append('status', status);
    }
    if (purpose) {
      params.append('purpose', purpose);
    }

    const searchParams = params.toString();
    console.log('검색 파라미터 문자열:', searchParams);
    
    // 파라미터가 없으면 전체 검색
    if (searchParams === '') {
      const url = `${carApiRoot}/all`;
      console.log('API 요청 URL (전체):', url);
      const response = await api.get(url);
      return response.data;
    } else {
      const url = `${carApiRoot}/search?${searchParams}`;
      console.log('API 요청 URL (검색):', url);
      const response = await api.get(url);
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
  }
};

export default carApiService;