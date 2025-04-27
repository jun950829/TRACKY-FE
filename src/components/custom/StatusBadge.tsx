import { cn } from "@/libs/utils/utils";
import { getStatusBadgeClass, getStatusLabel } from "@/libs/utils/getClassUtils";

interface StatusBadgeProps {
  status: string;
  type: 'car' | 'rent';
}

/**
 * 상태 표시를 위한 배지 컴포넌트
 * @param status - 표시할 상태 문자열
 * @param type - 상태 유형 ('car' | 'rent')
 */
export default function StatusBadge({ status, type }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusBadgeClass(status, type)
    )}>
      {getStatusLabel(type, status)}
    </span>
  );
}
