import api from "./api";

const realtimeApiRoot = "/realtime";

export const realtimeApi = {
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
