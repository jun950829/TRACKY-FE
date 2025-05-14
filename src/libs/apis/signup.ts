import axios from "axios";
import api from "./api";


export interface SignupRequestType {
    bizName: string;
    bizRegNum: string;
    bizAdmin: string;
    bizPhoneNum: string;
    memberId: string;
    pwd: string;
    email: string;
  }
  
  export const signupApiService = {
    signup: async (data: SignupRequestType) => {
      const response = await axios.post("/api/signup", data);
      return response.data;
    },
  };
  

export default signupApiService;