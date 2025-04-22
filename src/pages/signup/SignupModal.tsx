import React from 'react';

interface SignupModalProps {
  type: 'success' | 'error';
  onClose: () => void;
}

function SignupModal({ type, onClose }: SignupModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h3 className="text-lg font-semibold mb-2">
          {type === 'success' ? '회원가입 성공 ' : '회원가입 실패'}
        </h3>
        <p className="mb-4">
          {type === 'success' ? '환영합니다! 로그인 페이지로 이동해주세요.' : '문제가 발생했어요. 다시 시도해주세요.'}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default SignupModal;
