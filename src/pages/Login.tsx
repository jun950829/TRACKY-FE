import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { lloginApi } from "../libs/apis/loginApi";
import { useAuthStore } from "../stores/useAuthStore";
import {jwtDecode} from "jwt-decode";

// 유효성 검사용 스키마
const schema = yup.object().shape({
  memberId: yup.string().required("Id is required"),
  pwd: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

// 타입 선언
type FormValues = {
  memberId: string;
  pwd: string;
};

type DecodedToken = {
  sub: string;
  role: string;
  bizName: string;
};


export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const setMember = useAuthStore((state) => state.setMember);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // 로그인 요청 함수
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await lloginApi.login(data);
      const token = response.token;
      const decoded = jwtDecode<DecodedToken>(token);

      // 로그인 정보 저장
      setToken(token);
      setMember({
        memberId: decoded.sub,
        role: decoded.role,
        bizName: decoded.bizName,
      });

      // 새로고침 유지용 localStorage 저장
      localStorage.setItem("accessToken", token);
      
      navigate("/main");
    } catch (error: any) {
      console.error("Login error: ", error);
      setErrorMessage("로그인 실패~");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 border rounded shadow"
    >
      <div>
        <label className="block font-bold">ID</label>
        <input {...register("memberId")} className="w-full p-2 border rounded" />
        {errors.memberId && <p className="text-red-500">{errors.memberId.message}</p>}
      </div>

      <div>
        <label className="block font-bold">Password</label>
        <input type="password" {...register("pwd")} className="w-full p-2 border rounded" />
        {errors.pwd && <p className="text-red-500">{errors.pwd.message}</p>}
      </div>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
}
