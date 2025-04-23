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
  
  export const signupApiService = {
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