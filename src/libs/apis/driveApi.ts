import api from "./api";
import { format } from "date-fns";

const driveApiRoot = "/drives";

export const driveService = {
    getCars: async (search: string, page?: number, size?: number) => {
        const params = new URLSearchParams();

        if(search != "" ) {
            params.append('search', search);
        }

        if (page !== undefined) {
            params.append('page', String(page)); // API는 0-based 페이지를 사용
            params.append('size', String(size));
        }
        
        const response = await api.get(`${driveApiRoot}/cars?${params.toString()}`);
        return response.data;
    },

    getDriveBySearchFilter: async (search: string, mdn: string, searchDate: {sDate: Date, eDate: Date}, page?: number, size?: number) => {
        const params = new URLSearchParams();
        
        params.append('mdn', mdn);
        params.append('startDate', searchDate.sDate ? format(searchDate.sDate, 'yyyy-MM-dd') : "");
        params.append('endDate', searchDate.eDate ? format(searchDate.eDate, 'yyyy-MM-dd') : "");

        if(search != "" ) {
            params.append('search', search);
        }
        
        if(page !== undefined) {
            params.append('page', String(page));
            params.append('size', String(size));
        }

        const response = await api.get(`${driveApiRoot}?${params.toString()}`);
        return response.data;
    },

    getDriveById: async (id: number) => {
        const response = await api.get(`${driveApiRoot}/${id}`);
        return response.data;
    },
};

export default driveService;
