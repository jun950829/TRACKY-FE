import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { lloginApi } from "../libs/apis/loginApi";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// 유효성 검사용 스키마
const schema = yup.object().shape({
  memberId: yup.string().required("아이디를 입력해주세요"),
  pwd: yup
    .string()
    .min(4, "비밀번호는 최소 4자 이상이어야 합니다")
    .required("비밀번호를 입력해주세요"),
});

// 타입 선언
type FormValues = {
  memberId: string;
  pwd: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // 로그인 요청 함수
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const response = await lloginApi.login(data);
      localStorage.setItem("accessToken", response.token);
      navigate("/main");
    } catch (error: unknown) {
      console.error("Login error: ", error);
      setErrorMessage("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>
            차량 관제 시스템에 로그인합니다
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberId">아이디</Label>
              <Input
                id="memberId"
                placeholder="아이디를 입력하세요"
                {...register("memberId")}
                autoComplete="username"
              />
              {errors.memberId && (
                <p className="text-sm text-destructive">{errors.memberId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd">비밀번호</Label>
                <Button type="button" variant="link" size="sm" className="h-auto p-0">
                  비밀번호 찾기
                </Button>
              </div>
              <Input
                id="pwd"
                type="password"
                placeholder="비밀번호를 입력하세요"
                {...register("pwd")}
                autoComplete="current-password"
              />
              {errors.pwd && (
                <p className="text-sm text-destructive">{errors.pwd.message}</p>
              )}
            </div>
            
            {errorMessage && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
            
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <span>계정이 없으신가요? </span>
              <Button type="button" variant="link" size="sm" className="p-0" onClick={() => navigate("/about")}>
                회원가입
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}