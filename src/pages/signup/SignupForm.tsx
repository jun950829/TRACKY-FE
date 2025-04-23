import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SignupRequestType } from '@/libs/apis/signup';


const schema = yup.object().shape({
  bizName: yup.string().required('업체명을 입력해주세요.'),
  bizRegNum: yup.string().required('사업자 등록 번호를 입력해주세요.'),
  bizAdmin: yup.string().required('담당자를 입력해주세요.'),
  bizPhoneNum: yup.string().required('전화번호를 입력해주세요.'),
  memberId: yup.string().required('아이디를 입력해주세요.'),
  pwd: yup.string().min(6, '비밀번호는 6자 이상이어야 합니다.').required('비밀번호를 입력해주세요.'),
  email: yup.string().email('이메일 형식을 확인해주세요.').required('이메일을 입력해주세요.')
});

interface SignupFormProps {
  onSubmit: (data: SignupRequestType) => void;
}

function SignupForm({ onSubmit }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupRequestType>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('bizName')} placeholder="업체명" className="input" />
      <p className="text-red-500 text-sm">{errors.bizName?.message}</p>

      <input {...register('bizRegNum')} placeholder="사업자 등록 번호" className="input" />
      <p className="text-red-500 text-sm">{errors.bizRegNum?.message}</p>

      <input {...register('bizAdmin')} placeholder="담당자" className="input" />
      <p className="text-red-500 text-sm">{errors.bizAdmin?.message}</p>

      <input {...register('bizPhoneNum')} placeholder="전화번호" className="input" />
      <p className="text-red-500 text-sm">{errors.bizPhoneNum?.message}</p>

      <input {...register('memberId')} placeholder="아이디" className="input" />
      <p className="text-red-500 text-sm">{errors.memberId?.message}</p>

      <input type="password" {...register('pwd')} placeholder="비밀번호" className="input" />
      <p className="text-red-500 text-sm">{errors.pwd?.message}</p>

      <input {...register('email')} placeholder="이메일" className="input" />
      <p className="text-red-500 text-sm">{errors.email?.message}</p>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        회원가입
      </button>
    </form>
  );
}

export default SignupForm;