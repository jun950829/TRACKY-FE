import {  } from "@/constants/types/types";
import api from "./api";

const driveApiRoot = "/drives";

export const driveService = {
    getCars: async (search: string) => {
        let response;
        if (search === "") {
            response = await api.get(`${driveApiRoot}/cars`);
        } else {
            response = await api.get(`${driveApiRoot}/cars?search=${search}`);
        }
        return response.data;
    },

    getDriveBySearchFilter: async (search: string) => {
        let response;
        console.log("search: ", search);
        if(search === "") {
            response = await api.get(`${driveApiRoot}`);
        } else {
            response = await api.get(`${driveApiRoot}?search=${search}`);
        }
        return response.data;
    },

    getDriveById: async (id: number) => {
        const response = await api.get(`${driveApiRoot}/${id}`);
        return response.data;
    },
};

export default driveService;
