import { RentCreateTypes } from "@/constants/types";
import api from "./api";

export const rentApiService = {
    getRents: async () => {
        const response = await api.get("/rents/all");
        return response.data;
    },
    searchByUuid: async (searchText: string) => {
        if(searchText != '') {
            const response = await api.get(`/rents/searchbyuuid/${searchText}`);
            return response.data;
        }else {
            const response = await api.get("/rents/all");
            return response.data;
        }
    },
    
    createRent: async (data: RentCreateTypes) => {
        const response = await api.post("/rents/register", data);
        return response.data;
    }
};
 export default rentApiService;
