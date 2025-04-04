import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { lloginApi } from "../libs/apis/loginApi";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 유효성 검사용 스키마
const schema = yup.object().shape({
  memberId: yup.string()
    .min(4, "아이디는 최소 4자 이상이어야 합니다")
    .matches(/^[a-zA-Z0-9]+$/, "영문자와 숫자만 사용 가능합니다")
    .required("아이디를 입력해주세요"),
  pwd: yup.string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다"
    )
    .required("비밀번호를 입력해주세요"),
  pwdConfirm: yup.string()
    .oneOf([yup.ref('pwd')], "비밀번호가 일치하지 않습니다")
    .required("비밀번호 확인을 입력해주세요"),
  bizName: yup.string()
    .required("사업자명을 입력해주세요"),
  bizRole: yup.string()
    .required("회원 유형을 선택해주세요"),
});

// 타입 선언
type FormValues = {
  memberId: string;
  pwd: string;
  pwdConfirm: string;
  bizName: string;
  bizRole: string;
};

// 회원가입 API 타입
type RegisterData = Omit<FormValues, 'pwdConfirm'>;

// API 응답 오류 타입
interface ApiError {
  response?: {
    data?: {
      message?: string;
    }
  };
  message: string;
}

// 임시 API 서비스 (실제 구현 필요)
const authService = {
  register: async (data: RegisterData): Promise<{ success: boolean }> => {
    // 실제 API 연동 구현 필요
    console.log('Register data:', data);
    // 성공 시나리오를 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }
};

export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  // 회원가입 요청 함수
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // 비밀번호 확인 필드는 API에 전송하지 않기 위해 제외
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pwdConfirm, ...registerData } = data;
      
      // 회원가입 API 호출
      await authService.register(registerData);
      
      // 성공 상태로 변경
      setIsSuccess(true);
      
      // 5초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      
    } catch (error: unknown) {
      console.error("Register error: ", error);
      const apiError = error as ApiError;
      setErrorMessage(apiError.response?.data?.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 px-4 md:px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>
            차량 관제 시스템 계정을 생성합니다
          </CardDescription>
        </CardHeader>
        
        {isSuccess ? (
          <CardContent className="space-y-4 pt-4">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">회원가입 성공</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>회원가입이 성공적으로 완료되었습니다. 5초 후 로그인 페이지로 이동합니다.</p>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              type="button" 
              className="w-full" 
              onClick={() => navigate("/login")}
            >
              로그인 페이지로 이동
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
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
                <Label htmlFor="pwd">비밀번호</Label>
                <Input
                  id="pwd"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  {...register("pwd")}
                  autoComplete="new-password"
                />
                {errors.pwd && (
                  <p className="text-sm text-destructive">{errors.pwd.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pwdConfirm">비밀번호 확인</Label>
                <Input
                  id="pwdConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  {...register("pwdConfirm")}
                  autoComplete="new-password"
                />
                {errors.pwdConfirm && (
                  <p className="text-sm text-destructive">{errors.pwdConfirm.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bizName">사업자명</Label>
                <Input
                  id="bizName"
                  placeholder="사업자명을 입력하세요"
                  {...register("bizName")}
                />
                {errors.bizName && (
                  <p className="text-sm text-destructive">{errors.bizName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bizRole">회원 유형</Label>
                <Select onValueChange={(value) => setValue("bizRole", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="회원 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                    <SelectItem value="USER">일반 사용자</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bizRole && (
                  <p className="text-sm text-destructive">{errors.bizRole.message}</p>
                )}
              </div>
              
              {errorMessage && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "처리 중..." : "가입하기"}
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <span>이미 계정이 있으신가요? </span>
                <Button type="button" variant="link" size="sm" className="p-0" onClick={() => navigate("/login")}>
                  로그인
                </Button>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
} 