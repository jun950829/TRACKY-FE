import React, { useEffect } from 'react';
import InfoSearchSection from './InfoSearchSection';
import InfoResultSection from './InfoResultSection';
import { useInfoStore } from '@/stores/useInfoStore';
import { mockRentDetail, mockCarDetail, mockTrips } from '@/constants/mocks/infoMockData';

function InfoMain() {
    const { setInfo } = useInfoStore();
    
    // 개발 환경에서는 처음 렌더링될 때 mock 데이터를 로드
    useEffect(() => {
        // 빌드 환경에서만 mock 데이터 사용 (환경 변수 체크)
        if (true) {
        // if (import.meta.env.DEV) {
            // 초기 상태에 mock 데이터 설정
            setInfo({
                rent: mockRentDetail,
                car: mockCarDetail,
                trips: mockTrips,
                isLoading: false,
                error: null
            });
        }
    }, [setInfo]);

    return (
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6 max-w-6xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-center">예약 조회 서비스</h1>
            <InfoSearchSection />
            <InfoResultSection />
        </div>
    );
}

export default InfoMain;