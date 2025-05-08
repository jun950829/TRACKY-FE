import api from "./api";

const adminStatisticApiRoot = "/admin/statistic";

export const adminStatisticApiService = {
  getAdminStatistic: async () => {
    const response = await api.get(`${adminStatisticApiRoot}`);
    return response.data;
  },
}

export default adminStatisticApiService;