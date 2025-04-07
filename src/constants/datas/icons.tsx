import { Car, Clock, Settings, Ban } from "lucide-react";

export const getStatusIcon = (status: string): React.JSX.Element => {

  // 상태별 아이콘 설정
  switch(status) {
    case 'running':
      return <Car className="text-green-800 w-5 h-5" />;
    case 'fixing':
      return <Settings className="text-yellow-800 w-5 h-5" />;
    case 'waiting':
      return <Clock className="text-blue-800 w-5 h-5" />;
    case 'closed':
      return <Ban className="text-red-800 w-5 h-5" />;
    default:
      return <Car className="text-gray-800 w-5 h-5" />;
  }
}
