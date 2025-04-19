import {  } from "@/constants/types/types";
import api from "./api";

const driveApiRoot = "/drives";

export const driveService = {
    getCars: async () => {
        const response = await api.get(`${driveApiRoot}`);
        return response.data;
    },

};

export default driveService;
