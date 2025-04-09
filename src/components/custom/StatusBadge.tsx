import React from "react";
import { getStatusBadgeClass } from "@/libs/utils/getClassUtils";
import { RentStatus } from "@/constants/datas/status";
import { CarStatus } from "@/constants/datas/status";

type StatusBadgeProps = {
  status: string;
  type: "car" | "rent";
  className?: string;
};

// 상태 한글 라벨 매핑 함수
const getStatusLabel = (type: "car" | "rent", value: string) => {
  const statusList = type === "rent" ? RentStatus : CarStatus;
  const found = statusList.find((item) => item.value === value);
  return found ? found.label : value; // 못 찾으면 원래 값 출력
};

/**
 * 상태 표시를 위한 배지 컴포넌트
 *
 * @param status - 표시할 상태 문자열
 * @param type - 상태 유형 ('car' | 'rent')
 * @param className - 추가 클래스명 (선택사항)
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className }) => {
  return (
    <span className={getStatusBadgeClass(status, type, className)}>
      {getStatusLabel(type, status)}
    </span>
  );
};
export default StatusBadge;
