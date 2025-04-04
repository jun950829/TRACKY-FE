import React, { useRef, useState, useMemo } from "react";
import DashboardLayout from "./DashboardLayout";
import ReservationCard from "@/pages/dashboard/ReservationCard";
import VehicleMap from "./VehicleMap";
import RecentActivity from "./RecentActivity";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Calendar, Activity } from "lucide-react";

// Define vehicle data interface
interface Vehicle {
  mdn: string;
  carNumber: string;
  status: "운행중" | "정비중" | "대기중";
  location?: {
    lat: number;
    lng: number;
  };
  lastUpdated?: Date;
  driver?: string;
  km?: number;
}

// Define reservation data interface
interface Reservation {
  id: string;
  carNumber: string;
  driver: string;
  startDate: Date;
  endDate: Date;
  status: "예약완료" | "이용중" | "반납완료" | "취소";
}

export default function Dashboard() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLoading] = useState(false);
  
  // 샘플 데이터를 useMemo로 변경하여 한 번만 생성되도록 함
  const vehicles = useMemo<Vehicle[]>(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      mdn: `MDN${100000 + i}`,
      carNumber: `서울 ${String.fromCharCode(65 + i)} ${1000 + i}`,
      status: ["운행중", "대기중", "정비중"][Math.floor(Math.random() * 3)] as "운행중" | "정비중" | "대기중",
      location: {
        lat: 37.5 + (Math.random() * 0.1),
        lng: 127 + (Math.random() * 0.1)
      },
      lastUpdated: new Date(Date.now() - Math.random() * 3600000),
      driver: `드라이버 ${i + 1}`,
      km: Math.floor(Math.random() * 150)
    }));
  }, []);
  
  // 샘플 예약 데이터도 useMemo로 변경
  const reservations = useMemo<Reservation[]>(() => {
    const now = new Date();
    return Array.from({ length: 15 }, (_, i) => {
      const startDate = new Date(now);
      const dateOffset = Math.floor(Math.random() * 3) - 1; // -1, 0, 1 for yesterday, today, tomorrow
      startDate.setDate(now.getDate() + dateOffset);
      
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 24) + 1);
      
      return {
        id: `RES${10000 + i}`,
        carNumber: vehicles[i % vehicles.length].carNumber,
        driver: `고객 ${i + 1}`,
        startDate,
        endDate,
        status: ["예약완료", "이용중", "반납완료", "취소"][Math.floor(Math.random() * 4)] as "예약완료" | "이용중" | "반납완료" | "취소"
      };
    });
  }, [vehicles]);

  const statsItems = useMemo(() => [
    {
      id: 'operation',
      icon: <Car className="h-4 w-4 text-green-500" />,
      title: '운행 중',
      value: vehicles.filter(v => v.status === "운행중").length.toString(),
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'standby',
      icon: <Car className="h-4 w-4 text-blue-500" />,
      title: '대기 중',
      value: vehicles.filter(v => v.status === "대기중").length.toString(),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'maintenance',
      icon: <Car className="h-4 w-4 text-red-500" />,
      title: '정비 중',
      value: vehicles.filter(v => v.status === "정비중").length.toString(),
      color: 'bg-red-50 border-red-200'
    }
  ], [vehicles]);

  const carouselItems = useMemo(() => [
    {
      id: 'total-km',
      icon: <Activity className="h-4 w-4 text-purple-500" />,
      title: '총 운행거리',
      value: `${vehicles.reduce((sum, v) => sum + (v.km || 0), 0).toLocaleString()} km`,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'total-rents',
      icon: <Calendar className="h-4 w-4 text-indigo-500" />,
      title: '총 렌트 수',
      value: reservations.length.toString(),
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      id: 'total-cars',
      icon: <Car className="h-4 w-4 text-cyan-500" />,
      title: '총 차량 수',
      value: vehicles.length.toString(),
      color: 'bg-cyan-50 border-cyan-200'
    }
  ], [vehicles, reservations]);

  // Carousel controls
  const scrollCarousel = (direction: 'left' | 'right' | number) => {
    if (!carouselRef.current) return;
    
    if (typeof direction === 'number') {
      // 인덱스로 직접 이동
      setCarouselIndex(direction);
      carouselRef.current.scrollTo({
        left: direction * 260,
        behavior: 'smooth'
      });
      return;
    }
    
    if (direction === 'left') {
      setCarouselIndex(prev => Math.max(0, prev - 1));
    } else {
      setCarouselIndex(prev => Math.min(carouselItems.length - 1, prev + 1));
    }
    
    carouselRef.current.scrollTo({
      left: direction === 'left' 
        ? Math.max(0, carouselRef.current.scrollLeft - 260) 
        : Math.min(
            carouselRef.current.scrollWidth - carouselRef.current.clientWidth,
            carouselRef.current.scrollLeft + 260
          ),
      behavior: 'smooth'
    });
  };

  // 마우스 드래그로 슬라이딩 처리
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    
    e.stopPropagation(); // 이벤트 전파 중단
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 중단
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    e.stopPropagation(); // 이벤트 전파 중단
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    carouselRef.current.scrollLeft = scrollLeft - walk;
    
    // 현재 인덱스 업데이트
    const itemWidth = 260; // 슬라이드 아이템 너비
    const newIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
    setCarouselIndex(Math.max(0, Math.min(carouselItems.length - 1, newIndex)));
  };

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 space-y-4">
        {/* Vehicle Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {statsItems.map((stat) => (
            <Card 
              key={stat.id} 
              className={`overflow-hidden border-2 ${stat.color} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">{stat.title}</div>
                  <div className="text-2xl font-bold">{isLoading ? '-' : stat.value}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Content - Map and Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* 지도 컴포넌트 */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="mb-6">
              <VehicleMap 
                vehicles={vehicles} 
                isLoading={isLoading} 
              />
            </div>
            
            {/* 지도 아래 UI 영역 - 이벤트 전파 방지 */}
            <div 
              className="relative z-10" 
              onClick={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              {/* Carousel Stats - 지도 밑으로 이동 */}
              <div className="relative">
                <div 
                  ref={carouselRef} 
                  className="flex overflow-x-auto pb-1 px-1 -mx-1 snap-x cursor-grab active:cursor-grabbing hide-scrollbar"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  {carouselItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="min-w-[220px] sm:min-w-[260px] snap-center pr-3 select-none"
                      onClick={(e) => e.stopPropagation()} // 클릭 이벤트 전파 중단
                    >
                      <Card className={`border-2 ${item.color} h-full`}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500">{item.title}</div>
                              <div className="text-lg font-semibold">{isLoading ? '-' : item.value}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
                
                {/* 슬라이드 인디케이터 */}
                <div className="flex justify-center mt-2 gap-1.5">
                  {carouselItems.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation(); // 버튼 클릭 이벤트 전파 중단
                        scrollCarousel(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === carouselIndex ? 'bg-primary' : 'bg-zinc-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 오른쪽 컬럼 - 예약 현황과 최근 활동 세로 배치 */}
          <div className="lg:col-span-2">
            <div className="space-y-5 flex flex-col">
              {/* 예약 현황 */}
              <div className="h-[400px] overflow-hidden">
                <ReservationCard reservations={reservations} isLoading={isLoading} />
              </div>
              
              {/* 최근 활동 */}
              <div className="h-[220px] overflow-hidden">
                <RecentActivity 
                  vehicles={vehicles} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 