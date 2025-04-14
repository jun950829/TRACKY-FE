import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CarStatusColorMap } from "@/constants/datas/status";
import { getCarStatusIcon, getStatusLabel } from "@/libs/utils/dashboardUtils";
import { CarStatusTypes } from "@/constants/types/types";

interface VehicleStatusCardsProps {
  carStatus: CarStatusTypes[];
}

const VehicleStatusCards: React.FC<VehicleStatusCardsProps> = ({ carStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Object.entries(carStatus).length !== 0 && Object.entries(carStatus).map(([status, count]) => {
        
        if(status === 'closed') return null;

        // 색상 클래스
        console.log(status);
        const colorClass = CarStatusColorMap[status];
        const StatusIcon = getCarStatusIcon(status);
        
        return (
          <Card 
            key={status} 
            className={`overflow-hidden border-l-4 bg-white ${colorClass.replace('bg-', 'border-')} hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold mb-1">{getStatusLabel(status)}</div>
                <div className="text-2xl font-bold">{count.toString()}</div>
              </div>
              <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shadow-sm`}>
                {StatusIcon}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VehicleStatusCards; 