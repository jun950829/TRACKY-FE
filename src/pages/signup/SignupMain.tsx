import React, { useState } from 'react';
import SignupForm from './SignupForm';
import SignupModal from './SignupModal';
import signupApiService, { SignupRequestType } from '@/libs/apis/signup';
import { useNavigate } from 'react-router-dom';
function SignupMain() {
  const [modalType, setModalType] = useState<'success' | 'error' | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupRequestType) => {
    try {
      await signupApiService.signup(data);
      setModalType('success');
    } catch (error) {
      console.error(error);
      setModalType('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">회원가입</h2>
        <SignupForm onSubmit={handleSignup} />
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