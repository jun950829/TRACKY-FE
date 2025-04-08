import api from "./api";

export const infoApiService = {
  getReservationWithCar: async (uuid: string) => {
    const res = await api.get(`/reservation/${uuid}`);
    return res.data;
  },
  getDrivings: async (uuid: string) => {
    const res = await api.get(`/reservation/${uuid}/drivings`);
    return res.data;
  },
};

export default infoApiService;
