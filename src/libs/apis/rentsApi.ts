import api from "./api";

export const rentApiService = {
    getRents: async () => {
        const response = await api.get("/rent/all");
        return response.data;
    },
    searchByUuid: async (searchText: string) => {
        if(searchText != '') {
            const response = await api.get(`/rent/searchbyuuid/${searchText}`);
            return response.data;
        }else {
            const response = await api.get("/car/all");
            return response.data;
        }
    },
    // 다른걸로 검색 추가하기~~
}