import api from "./api";

const drivehistoryApiRoot = "/drivess";

export const drivehistoryService = {
  driveHistorybyRentUuid: async (rentUuid: string = "") => {
    let response;
    if (rentUuid !== "") {
      response = await api.get(`${drivehistoryApiRoot}/history/rents?rentUuid=${rentUuid}`);
    } else {
      response = await api.get(`${drivehistoryApiRoot}/history/rents`);
    }
    return response.data;
  },
  getDriveDetail: async (driveId: number) => {
    const response = await api.get(`${drivehistoryApiRoot}/history/${driveId}`);
    return response.data;
  },
  getDriveDetailbyCar: async (mdn: string) => {
    console.log("mdn", mdn);
    const response = await api.get(`${drivehistoryApiRoot}/history/cars?mdn=${mdn}`);
    return response.data;
  },
  driveHistorybyBizId: async (bizId?: string) => {
    try {
      const response = await api.get(`/drivehistory/biz${bizId ? `/${bizId}` : ''}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
