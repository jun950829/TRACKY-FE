import React from 'react';
import { getStatusBadgeClass } from '@/libs/utils/getClassUtils';

type StatusBadgeProps = {
  status: string;
  type: 'car' | 'rent';
  className?: string;
};

/**
 * 상태 표시를 위한 배지 컴포넌트
 * 
 * @param status - 표시할 상태 문자열
 * @param type - 상태 유형 ('car' | 'rent')
 * @param className - 추가 클래스명 (선택사항)
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type, 
  className 
}) => {
  return (
    <span className={getStatusBadgeClass(status, type, className)}>
      {status}
    </span>
  );
};

export default StatusBadge; 