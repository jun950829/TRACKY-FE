import api from "./api";
import { Member } from "@/constants/types/types";

export interface SignupRequestType {
    bizName: string;
    bizRegNum: string;
    bizAdmin: string;
    bizPhoneNum: string;
    memberId: string;
    pwd: string;
    pwdConfirm: string;
    email: string;
}

export interface UpdateMemberRequestType {
    memberId: string;
    bizName: string;
    bizRegNum: string;
    bizAdmin: string;
    bizPhoneNum: string;
    email: string;
    role: string;
    status: string;
}

export interface PaginationResponse<T> {
    data: T[];
    pageResponse: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }
}

export const signupApiService = {
    searchMembers: async (search: string, page: number = 0, size: number = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (search.length > 0) {
            params.append('search', search);
        }

        const response = await api.get(`/members?${params.toString()}`);
        return response.data as PaginationResponse<Member>;
    },

    updateMember: async (data: UpdateMemberRequestType) => {
        const response = await api.post(`/members`, data);
        return response.data;
    },

    deleteMember: async (data: {memberId: string}) => {
        const response = await api.delete(`/members`, {data});
        return response.data;
    },

    signup: async (data: SignupRequestType) => {
        const response = await api.post("/signup", data);
        return response.data;
    },

    checkIdDuplication: async (memberId: string) => {
        const response = await api.get(`/signup/${memberId}`);
        return response.data;
    },

    getApproves: async () => {
        const response = await api.get("/approves");
        return response.data;
    },

    approve: async (data: {memberId: string, status: string}) => {
        const response = await api.post("/approves", data);
        return response.data;
    },

    reject: async (data: {memberId: string, status: string}) => {
        const response = await api.post("/approves", data);
        return response.data;
    },
};

export default signupApiService;