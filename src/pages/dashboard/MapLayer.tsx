import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import KoreaMap from "./KoreaMap";



interface MapLayerProps {
  isLoading: boolean;
}

export default function MapLayer({ isLoading }: MapLayerProps) {

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-white border-b border-zinc-100 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          <span>차량 위치 지도</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-[400px] sm:h-[450px] bg-zinc-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-zinc-500">지도를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="h-[400px] sm:h-[450px]">
            <div 
              className="h-full w-full relative isolate"
              style={{ isolation: 'isolate' }}
            >
              <KoreaMap />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 