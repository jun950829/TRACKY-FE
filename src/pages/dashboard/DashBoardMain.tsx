import React, { useRef, useState, useMemo, useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import ReservationCard from "@/pages/dashboard/ReservationCard";
import VehicleMap from "./VehicleMap";
import RecentActivity from "./RecentActivity";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Calendar, Activity, Clock } from "lucide-react";

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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isInitializedRef = useRef(false);
  
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
      id: 'total-usage-time',
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      title: '누적 이용시간',
      value: `${Math.floor(vehicles.length * Math.random() * 24 * 15).toLocaleString()}시간`,
      color: 'bg-amber-50 border-amber-200'
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

  // 무한 스크롤을 위한 표시 아이템 - 3세트 복사
  const displayItems = useMemo(() => {
    // 무한 스크롤 효과를 위해 3개 세트의 반복 아이템 생성
    return [...carouselItems, ...carouselItems, ...carouselItems];
  }, [carouselItems]);

  // 아이템 너비 및 캐러셀 관련 상태
  const itemWidth = 260; // px 기준
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        setContainerWidth(containerRef.current?.offsetWidth || 0);
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  // 캐러셀 애니메이션
  useEffect(() => {
    if (!carouselRef.current || !containerWidth) return;
    
    const carousel = carouselRef.current;
    const singleSetWidth = carouselItems.length * itemWidth;
    
    // 초기 위치 설정 (중간 세트의 시작점) - 최초 한 번만 실행
    if (!isInitializedRef.current) {
      carousel.scrollLeft = singleSetWidth;
      isInitializedRef.current = true;
    }
    
    let lastTimestamp = 0;
    let animationFrameId: number;
    const speed = 0.2; // px per millisecond - 속도 감소
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      if (!isPaused) {
        // 현재 위치에서 속도에 따라 이동
        carousel.scrollLeft += speed * elapsed;
        
        // 세 번째 세트 이후로 넘어가면 첫 번째 세트로 순간 이동 (사용자가 알아채지 못하게)
        if (carousel.scrollLeft >= singleSetWidth * 2) {
          carousel.scrollLeft = singleSetWidth;
        }
        
        // 첫 번째 세트 이전으로 스크롤되면 두 번째 세트로 이동 (역방향 스크롤 지원)
        if (carousel.scrollLeft < singleSetWidth) {
          carousel.scrollLeft = singleSetWidth;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [carouselItems.length, isPaused, containerWidth, itemWidth]);

  // 마우스 이벤트 핸들러 - 위치 초기화 없이 단순히 일시 정지만 처리
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
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
          {/* 지도 컴포넌트 영역 */}
          <div className="lg:col-span-3 flex flex-col">
            {/* 지도 컴포넌트 */}
            <div className="mb-6 relative">
              <VehicleMap 
                vehicles={vehicles} 
                isLoading={isLoading} 
              />
            </div>
            
            {/* Carousel Stats */}
            <div 
              ref={containerRef}
              className="relative overflow-hidden" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                ref={carouselRef} 
                className="flex overflow-x-hidden pb-1 px-1 -mx-1"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none'
                }}
              >
                {displayItems.map((item, index) => (
                  <div 
                    key={`${item.id}-${index}`} 
                    className="min-w-[260px] pr-3 select-none"
                    style={{ flex: '0 0 auto' }}
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