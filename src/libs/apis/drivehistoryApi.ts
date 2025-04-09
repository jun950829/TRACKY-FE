import api from "./api";

const drivehistoryApiRoot = "/drives";

export const drivehistoryService = {
  driveHistorybyRentUuid: async () => {
    const response = await api.get(`${drivehistoryApiRoot}/history`);
    return response.data;
  },
  getDriveDetail: async (driveId: number) => {
    const response = await api.get(`${drivehistoryApiRoot}/history/${driveId}`);
    return response.data;
  },
  getDriveDetailbyCar: async (mdn: string) => {
    const response = await api.get(`${drivehistoryApiRoot}/history/cars/${mdn}`);
    return response.data;
  },
};
