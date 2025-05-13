import api from "./api";
import { format } from "date-fns";

const driveApiRoot = "/drives";
const driveAdminApiRoot = "/admin/drives";

export const driveService = {
    getCars: async (bizSearch: string, search: string, page?: number, size?: number) => {
        const params = new URLSearchParams();

        if(bizSearch != "" ) {
            params.append('bizSearch', bizSearch);
        }

        if(search != "" ) {
            params.append('search', search);
        }

        if (page !== undefined) {
            params.append('page', String(page)); // API는 0-based 페이지를 사용
            params.append('size', String(size));
        }

        
        const response = await api.get(`${driveAdminApiRoot}/cars?${params.toString()}`);
        return response.data;
    },

    getDriveBySearchFilter: async (search: string, mdn: string, searchDate: {sDate: Date, eDate: Date}, page: number, size: number) => {
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

    // 특정 차량의 운행 이력을 엑셀로 다운로드하는 함수
    extractDriveExcel: async (mdn: string) => {
        const url = `${driveApiRoot}/excel?mdn=${mdn}`;
        const response = await api.get(url, {
            responseType: 'blob', // 중요! 바이너리 데이터를 받기 위한 설정
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        });

        return response;
    }
};

export default driveService;
