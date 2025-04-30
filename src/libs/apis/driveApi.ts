import api from "./api";

const driveApiRoot = "/drives";

export const driveService = {
    getCars: async (search: string, page?: number, pageSize: number = 20) => {
        const params = new URLSearchParams();
        params.append('search', search ? search : "");
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
