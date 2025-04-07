import api from "./api";

const dashboardApiRoot = "/dashboard";

export const dashboardApi = {
  getCarStatus: async () => {
    const response = await api.get(`${dashboardApiRoot}/cars/status`);
    return response.data;
  }
};
