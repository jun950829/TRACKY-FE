import { CarCreateTypes, CarUpdateTypes } from "@/constants/types/types";
import api from "./api";

const carApiRoot = "/cars";

// Car API 요청 함수들
export const carApiService = {
  getCars: async () => {
    const response = await api.get(`${carApiRoot}`);
    return response.data;
  },

  checkMdnExists: async (mdn: string) => {
    const response = await api.get(`${carApiRoot}/check/mdn/${mdn}`);
    return response.data;
  },

  searchByFilters: async (
    search: string = "",
    status?: string,
    carType?: string,
    size: number = 10,
    page: number = 0
  ) => {
    // 검색 파라미터 구성
    const params = new URLSearchParams();

    // 검색어가 있을 경우 추가
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    // 상태 필터 추가
    if (status && status !== "all") {
      params.append("status", status);
    }

    // 차량 타입 필터 추가
    if (carType && carType !== "all") {
      params.append("carType", carType);
    }

    // 페이지네이션 파라미터 추가 (백엔드 DTO에 맞춤)
    params.append("size", String(size));
    params.append("page", String(page));

    // API 호출
    const url = `${carApiRoot}${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("API 요청 URL:", url);

    const response = await api.get(url);
    return response;
  },

  searchOneByMdnDetail: async (mdn: string) => {
    const response = await api.get(`${carApiRoot}/${mdn}`);
    return response.data;
  },

  createCar: async (data: CarCreateTypes) => {
    const response = await api.post(`${carApiRoot}`, data);
    return response.data;
  },

  updateCar: async (data: CarUpdateTypes) => {
    const response = await api.patch(`${carApiRoot}`, data);
    return response.data;
  },

  deleteCar: async (data: { mdn: string }) => {
    const response = await api.delete(`${carApiRoot}`, { data });
    return response.data;
  },
};

export default carApiService;
