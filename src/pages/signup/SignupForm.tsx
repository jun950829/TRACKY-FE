import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SignupRequestType } from '@/libs/apis/signupApi';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
  bizName: yup.string().required('업체명을 입력해주세요.'),
  bizRegNum: yup.string().required('사업자 등록 번호를 입력해주세요.'),
  bizAdmin: yup.string().required('담당자를 입력해주세요.'),
  bizPhoneNum: yup.string().required('전화번호를 입력해주세요.'),
  memberId: yup.string()
  .min(4, "아이디는 최소 4자 이상이어야 합니다")
  .matches(/^[a-zA-Z0-9]+$/, "영문자와 숫자만 사용 가능합니다")
  .required("아이디를 입력해주세요"),
  pwd: yup.string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
  .matches(
    /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/,
    "비밀번호는 소문자, 숫자, 특수문자를 포함해야 합니다"
  )
  .required("비밀번호를 입력해주세요"),
  pwdConfirm: yup.string()
  .oneOf([yup.ref('pwd')], "비밀번호가 일치하지 않습니다")
  .required("비밀번호 확인을 입력해주세요"),
  email: yup.string().email('이메일 형식을 확인해주세요.').required('이메일을 입력해주세요.')
});

interface SignupFormProps {
  onSubmit: (data: SignupRequestType) => void;
  isLoading: boolean;
  errorMessage: string;
}

function SignupForm({ onSubmit, isLoading, errorMessage }: SignupFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupRequestType>({
    resolver: yupResolver(schema),
  });

  // 취소 처리
  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="pt-4 flex flex-row gap-4 justify-between">
        <div className='flex flex-col gap-4 min-w-[250px]'>
          <p className='text-md font-bold'>업체 정보</p>
          <div className="space-y-2">
              <Label htmlFor="memberId">업체명</Label>
              <Input
                id="bizName"
                placeholder="업체명을 입력하세요"
                {...register("bizName")}
              />
              {errors.memberId && (
                <p className="text-sm text-destructive">{errors.memberId.message}</p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bizRegNum">사업자 등록 번호</Label>
            <Input
              id="bizRegNum"
              placeholder="사업자 등록 번호를 입력하세요"
              {...register("bizRegNum")}
            />
            {errors.bizRegNum && (
              <p className="text-sm text-destructive">{errors.bizRegNum.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bizAdmin">담당자</Label>
            <Input
              id="bizAdmin"
              placeholder="담당자를 입력하세요"
              {...register("bizAdmin")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bizPhoneNum">전화번호</Label>
            <Input
              id="bizPhoneNum"
              placeholder="전화번호를 입력하세요"
              {...register("bizPhoneNum")}
            />
          </div>
        </div>

        <div className='flex flex-col gap-4 min-w-[250px]'>
          <p className='text-md font-bold'>계정 정보</p>
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
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              placeholder="이메일을 입력하세요"
              {...register("email")}
            />
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
      
      {/* <div className="text-center text-sm text-muted-foreground">
        <span>이미 계정이 있으신가요? </span>
        <Button type="button" variant="link" size="sm" className="p-0" onClick={() => navigate("/login")}>
          로그인
        </Button>
      </div> */}
    </CardFooter>
  </form>
  );
}

export default SignupForm;