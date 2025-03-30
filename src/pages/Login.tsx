import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { lloginApi } from "../libs/apis/loginApi";

// ✅ 유효성 검사용 스키마
const schema = yup.object().shape({
  memberId: yup.string().required("Id is required"),
  pwd: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

// ✅ 타입 선언
type FormValues = {
  memberId: string;
  pwd: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // ✅ 로그인 요청 함수
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await lloginApi.login(data);
      localStorage.setItem("accessToken", response.token);
      navigate("/main");
    } catch (error: any) {
      console.error("Login error: ", error);
      setErrorMessage("로그인 실패~");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} // 제출 시 onSubmit 호출
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

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Sign Up</button>
    </form>
  );
}