import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { loginApiService } from "../libs/apis/loginApi";
import { useAuthStore } from "../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";

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

type DecodedToken = {
  sub: string;
  role: string;
  bizName: string;
};

// 공지사항 데이터 타입
type Notice = {
  id: number;
  title: string;
  date: string;
  content: string;
};

// 임시 공지사항 데이터
const notices: Notice[] = [
  {
    id: 1,
    title: "시스템 점검 예정",
    date: "2024-03-20",
    content: "3월 20일 오전 2시부터 4시까지 시스템 점검이 예정되어 있습니다.",
  },
  {
    id: 2,
    title: "새로운 기능 추가",
    date: "2024-03-15",
    content: "차량 위치 추적 기능이 추가되었습니다. 더욱 정확한 위치 정보를 확인하실 수 있습니다.",
  },
  {
    id: 3,
    title: "이용 안내",
    date: "2024-03-10",
    content: "모바일 앱에서도 Tracky 서비스를 이용하실 수 있습니다.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const setMember = useAuthStore((state) => state.setMember);

  const [isShow, setIsShow] = useState(false);

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
    setError(null);
    
    try {
      const response = await loginApiService.login(data);

      if ( response.status === 200 ) {

        const token = response.data;
        const decoded = jwtDecode<DecodedToken>(token);
        const member = {
          memberId: decoded.sub,
          role: decoded.role,
          bizName: decoded.bizName,
        };

        // 로그인 정보 저장
        setToken(token);
        setMember(member);

        // 새로고침 유지용 localStorage 저장
        localStorage.setItem("memberInfo", JSON.stringify(member));
        localStorage.setItem("accessToken", token);

        navigate("/dashboard");

      } else {
        setError(createApiError(response));
      }

      
    } catch (error) {
      console.error("Login error: ", error);
      setError(createApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {error && <ErrorToast error={error} />}
      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
          {/* 로그인 폼 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Card className="border-0 shadow-none">
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
                      className="w-full"
                    />
                    {errors.memberId && (
                      <p className="text-sm text-destructive">{errors.memberId.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pwd">비밀번호</Label>
                    </div>
                    <Input
                      id="pwd"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      {...register("pwd")}
                      autoComplete="current-password"
                      className="w-full"
                    />
                    {errors.pwd && (
                      <p className="text-sm text-destructive">{errors.pwd.message}</p>
                    )}
                  </div>
                  
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error.message}
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
                    <Button type="button" variant="link" size="sm" className="p-0" onClick={() => navigate("/signup")}>
                      회원가입
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>

          {/* 공지사항 */}
          <div className="bg-white rounded-lg shadow-lg p-8 hidden md:block">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">공지사항</h2>
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div key={notice.id} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{notice.title}</h3>
                      <span className="text-sm text-gray-500">{notice.date}</span>
                    </div>
                    <p className="text-gray-600">{notice.content}</p>
                  </div>
                ))}


                  <button onClick={() => {
                      setIsShow(!isShow)
                    }} className="text-xxs text-white rounded-md px-2 py-1">
                    ID 보기
                    </button>

                      {isShow ? 
                      <>
                        <h1>Test 계정</h1>
                        <p>ID : kernel360</p>
                        <p>PWD : 121212</p>
                      </>
                      : <>
                      </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

