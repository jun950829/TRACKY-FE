import api from "./api";

const drivehistoryApiRoot = "/drives";

export const drivehistoryService = {
  driveHistory: async () => {
    const response = await api.get(`${drivehistoryApiRoot}/history`);
    return response.data;
  },
  driveHistoryDetail: async (rentUuid: string) => {
    const response = await api.get(`${drivehistoryApiRoot}/history/${rentUuid}`);
    return response.data;
  },
};
