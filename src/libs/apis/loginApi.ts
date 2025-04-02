import axios from "axios";
import api from "./api";
import { config } from "process";
import { error } from "console";

const loginApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/login",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export const lloginApi = {
    login: async (data: {memberId: string, pwd: string}) => {
        const response = await api.post("/login", data);
        return response.data;
    }
};

export default loginApi;