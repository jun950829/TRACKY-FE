import { RentCreateTypes, RentUpdateTypes } from "@/constants/types/types";
import api from "./api";

const rentApiRoot = "/rents";

export const rentApiService = {
    getRents: async () => {
        const response = await api.get(`${rentApiRoot}/all`);
        return response.data;
    },

    searchByRentUuid: async (searchText: string) => {
        if(searchText != '') {
            const response = await api.get(`/rents/search?rentUuid=${searchText}`);
            return response.data;
        }else {
            const response = await api.get(`${rentApiRoot}/all`);
            return response.data;
        }
    },
    
    searchRents: async (searchText: string, status?: string, date?: string) => {
        // 쿼리 매개변수 객체 구성
        const params = new URLSearchParams();
        
        if (searchText && searchText.trim() !== '') {
            params.append('rentUuid', searchText.trim());
        }
        
        if (status) {
            params.append('status', status);
        }
        
        if (date) {
            params.append('date', date);
        }
        
        // 쿼리 매개변수가 있으면 검색 API 호출, 없으면 전체 목록 조회
        const searchParams = params.toString();
        console.log('검색 파라미터 문자열:', searchParams);
        
        if (searchParams === "") {
            const response = await api.get(`${rentApiRoot}/all`);
            return response.data;
        } else {
            const response = await api.get(`${rentApiRoot}/search?${searchParams}`);
            return response.data;
        }
    },

    searchOneByRentUuid: async (rentUuid: string) => {
        const response = await api.get(`${rentApiRoot}/search/${rentUuid}`);
        return response.data;
    },

    searchByRentUuidDetail: async (rentUuid: string) => {
        console.log('searchByRentUuidDetail rentUuid :', rentUuid);
        const response = await api.get(`${rentApiRoot}/search/${rentUuid}/detail`);
        return response.data;
    },

    createRent: async (data: RentCreateTypes) => {
        const response = await api.post(`${rentApiRoot}/create`, data);
        return response.data;
    },

    updateRent: async ( rentUuid: string, data: RentUpdateTypes) => {
        const response = await api.patch(`${rentApiRoot}/update/${rentUuid}`, data);
        return response.data;
    },

    deleteRent: async (rentUuid: string) => {
        const response = await api.delete(`${rentApiRoot}/delete/${rentUuid}`);
        return response.data;
    }
};

export default rentApiService;
