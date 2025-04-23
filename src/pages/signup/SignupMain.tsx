import React, { useState } from 'react';
import SignupForm from './SignupForm';
import SignupModal from './SignupModal';
import signupApiService, { SignupRequestType } from '@/libs/apis/signupApi';
import { useNavigate } from 'react-router-dom';

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SignupMain() {
  const [modalType, setModalType] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupRequestType) => {
    try {
      setIsLoading(true);
      await signupApiService.signup(data);
      setModalType('success');
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
      setModalType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen bg-stone-50">
    <div className="w-full flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 px-4 md:px-6">
      <Card className="w-full max-w-[600px] shadow-lg">
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
          <div className="w-full max-h-[550px] overflow-y-auto">
            <SignupForm onSubmit={handleSignup} isLoading={isLoading} errorMessage={errorMessage} />
          </div>
        )}
      </Card>
    </div>

      {modalType && (
        <SignupModal
          type={modalType}
          onClose={() => {
            if (modalType === 'success') navigate('/login'); 
            else setModalType(null);                     
          }}
        />
      )}
    </div>
  );
}

export default SignupMain;