import RealTimeMap from "./RealTimeMap";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import RealTimeMapSearch from "./RealTimeMapSearch";
import { Search } from "lucide-react";

function HistoryRealTime() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVehicleListOpen, setIsVehicleListOpen] = useState(false);

  // Mock data for vehicles
  const vehicles = [
    { id: 1, name: '차량 1', lat: 37.5665, lng: 126.9780 },
    { id: 2, name: '차량 2', lat: 37.5666, lng: 126.9781 },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <RealTimeMap vehicles={vehicles} />

      {/* Search Panel Overlay */}
      <div className={`z-[1000] absolute top-4 left-4 bg-white rounded-lg shadow-lg transition-all duration-300 ${isSearchOpen ? 'w-4/10 p-4 display-block' : 'w-[40px] p-4'}`}>
        <RealTimeMapSearch isOpen={isSearchOpen} onToggle={() => setIsSearchOpen(!isSearchOpen)} />
        <div className="z-[1000] absolute top-4 left-4 flex items-center justify-center">
          <Search className={`h-4 w-4 rounded-lg ${isSearchOpen ? 'display-none' : ''}`} onClick={() => setIsSearchOpen(true)} />
        </div>
      </div>

      {/* Vehicle List Overlay */}
      <div className={`z-[1000] absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg transition-all duration-300 ${isVehicleListOpen ? 'w-80' : 'w-12'}`}>
        <Button
          variant="outline"
          size="icon"
          className="mb-2"
          onClick={() => setIsVehicleListOpen(!isVehicleListOpen)}
        >
          <span className="text-sm">차량</span>
        </Button>
        {isVehicleListOpen && (
          <div className="space-y-2">
            <div className="max-h-60 overflow-y-auto">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                  {vehicle.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryRealTime;
