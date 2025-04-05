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
        const response = await api.post(`${rentApiRoot}/register`, data);
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
