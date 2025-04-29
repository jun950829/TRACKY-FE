import { RentCreateTypes, RentUpdateTypes } from "@/constants/types/types";
import api from "./api";

const rentApiRoot = "/rents";

export const rentApiService = {
  getRents: async () => {
    const response = await api.get(`${rentApiRoot}`);
    return response.data;
  },

  getMdns: async () => {
    const response = await api.get(`${rentApiRoot}/mdns`);
    return response.data;
  },

  searchRents: async (
    search: string = "",
    status?: string,
    date?: string,
    size: number = 10,
    page: number = 0
  ) => {
    const params = new URLSearchParams();

    if (search.trim() !== "") {
      params.append("rentUuid", search.trim());
    }
    if (status && status !== "all") {
      params.append("status", status);
    }
    if (date) {
      params.append("rentDate", date);
    }
    params.append("size", String(size));
    params.append("page", String(page));

    const url = `${rentApiRoot}${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("렌트 검색 요청 URL:", url);

    const response = await api.get(url);
    return response;
  },

  searchByRentUuidDetail: async (rentUuid: string) => {
    const response = await api.get(`${rentApiRoot}/${rentUuid}`);
    return response.data;
  },

  createRent: async (data: RentCreateTypes) => {
    const response = await api.post(`${rentApiRoot}`, data);
    return response.data;
  },

  updateRent: async (rentUuid: string, data: RentUpdateTypes) => {
    const response = await api.patch(`${rentApiRoot}/${rentUuid}`, data);
    return response.data;
  },

  deleteRent: async (rentUuid: string) => {
    const response = await api.delete(`${rentApiRoot}/${rentUuid}`);
    return response.data;
  },
};

export default rentApiService;