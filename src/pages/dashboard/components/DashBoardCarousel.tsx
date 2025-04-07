import React, { useRef, useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatisticsItem } from "@/constants/types/types";

interface DashBoardCarouselProps {
  statisticsItems: StatisticsItem[];
  isLoading: boolean;
}

export default function DashBoardCarousel({ statisticsItems, isLoading }: DashBoardCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentPositionRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // 아이템 너비 및 캐러셀 관련 상태
  const itemWidth = 260; // px 기준
  
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

  // 무한 스크롤을 위한 표시 아이템 - 3세트 복사
  const displayItems = React.useMemo(() => {
    return [...statisticsItems, ...statisticsItems, ...statisticsItems];
  }, [statisticsItems]);

  // 캐러셀 애니메이션 초기화 및 시작
  const initializeCarousel = useCallback(() => {
    if (!carouselRef.current || !containerWidth || statisticsItems.length === 0) return;

    const carousel = carouselRef.current;
    const singleSetWidth = statisticsItems.length * itemWidth;
    const speed = 0.5; // px per millisecond

    // 초기 위치 설정
    currentPositionRef.current = singleSetWidth;
    carousel.scrollLeft = currentPositionRef.current;

    const animate = () => {
      if (!carouselRef.current || isPaused) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // 현재 위치 업데이트
      currentPositionRef.current += speed;
      carousel.scrollLeft = currentPositionRef.current;

      // 세 번째 세트 이후로 넘어가면 첫 번째 세트로 순간 이동
      if (currentPositionRef.current >= singleSetWidth * 2) {
        currentPositionRef.current = singleSetWidth;
        carousel.scrollLeft = currentPositionRef.current;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 이전 애니메이션 프레임 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 애니메이션 시작
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [containerWidth, statisticsItems.length, isPaused]);

  // 통계 데이터가 변경되면 캐러셀 초기화
  useEffect(() => {
    if (!isLoading && statisticsItems.length > 0) {
      initializeCarousel();
    }
  }, [statisticsItems, isLoading, initializeCarousel]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
  );
} 