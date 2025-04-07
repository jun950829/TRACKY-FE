import api from "./api";

const dashboardApiRoot = "/dashboard";

export const dashboardApi = {

  getCarStatus: async () => {
    const response = await api.get(`${dashboardApiRoot}/cars/status`);
    return response.data;
  },

  getReservationStatus: async (datefilter : number = 0) => {
    let response;
    switch(datefilter) {
      case -1:
        response = await api.get(`${dashboardApiRoot}/rents/status?date=yesterday`);
        break;
      case 1:
        response = await api.get(`${dashboardApiRoot}/rents/status?date=tomorrow`);
        break;
      default: 
        response = await api.get(`${dashboardApiRoot}/rents/status`);
    }
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get(`${dashboardApiRoot}/statistics`);
    return response.data;
  }
};
