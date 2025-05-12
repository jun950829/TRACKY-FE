import api from "./api";

const realtimeApiRoot = "/realtime";
const realtimeAdminApiRoot = "/admin/realtime";

export const realtimeApi = {
  getRealtimeAdminData: async (bizSearch: string, search: string) => {
    // 검색 파라미터 구성
    const params = new URLSearchParams();

    // 검색어가 있을 경우 추가
    if (bizSearch && bizSearch.trim() !== "") {
      params.append("bizSearch", bizSearch.trim());
    }
    
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    const response = await api.get(`${realtimeAdminApiRoot}?${params.toString()}`);

    return response.data;
  },

  getRealtimeData: async (search: string) => {
    let response;
    if (search == "") {
      response = await api.get(`${realtimeApiRoot}`);
    } else {
      response = await api.get(`${realtimeApiRoot}?search=${search}`);
    }
    return response.data;
  },

  getRealtimeDetailData: async (id: number) => {
    const response = await api.get(`${realtimeApiRoot}/${id}`);
    return response.data;
  },

  getRealtimeBeforePath: async (driveId: number, nowTime: string) => {
    const response = await api.get(`${realtimeApiRoot}/gps/beforepath/${driveId}?nowTime=${nowTime}`);
    return response.data;
  },
};

export default realtimeApi;
