import api from "./api";

const drivehistoryApiRoot = "/drivess";

export const drivehistoryService = {
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
    //
  },
};
