import api from "./api";

const driveApiRoot = "/drives";

export const driveService = {
    getCars: async (search: string, page?: number, pageSize: number = 20) => {
        const params = new URLSearchParams();
        params.append('searchText', search ? search : "");
        if (page !== undefined) {
            params.append('page', String(page)); // API는 0-based 페이지를 사용
            params.append('size', String(pageSize));
        }
        
        const response = await api.get(`${driveApiRoot}/cars?${params.toString()}`);
        return response.data;
    },

    getDriveBySearchFilter: async (search: string) => {
        let response;
        console.log("search: ", search);
        if(search === "") {
            response = await api.get(`${driveApiRoot}`);
        } else {
            response = await api.get(`${driveApiRoot}?search=${search}`);
        }
        return response.data;
    },

    getDriveById: async (id: number) => {
        const response = await api.get(`${driveApiRoot}/${id}`);
        return response.data;
    },
};

export default driveService;
