import api from "./api";


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
  
  export const signupApiService = {
    searchMembers: async (search: string) => {
      if(search.length === 0) {
        const response = await api.get("/members");
        return response.data;
      } else {
        const response = await api.get(`/members?search=${search}`);
        return response.data;
      }
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

    getApproves: async () => {
      const response = await api.get("/approves");
      return response.data;
    },

    approve: async (data: {memberId: string}) => {
      const response = await api.post("/approves", data);
      return response.data;
    },

    reject: async (data: {memberId: string}) => {
      const response = await api.post("/reject", data);
      return response.data;
    },
  };
  

export default signupApiService;