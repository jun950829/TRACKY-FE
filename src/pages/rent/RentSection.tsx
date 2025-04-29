import { rentApiService } from "@/libs/apis/rentsApi";
import { useEffect, useState } from "react";
import RentTable from "./RentTable";
import RentSearchLayer from "./RentSearchLayer";
import { RentDetailTypes } from "@/constants/types/types";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { ApiError, createApiError } from "@/types/error";

function RentSection() {
    const [rentList, setRentList] = useState<RentDetailTypes[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [searchObj, setSearchObj] = useState<{searchText: string, status?: string, date?: string}>({searchText: ''});

    async function getRents() {
        setIsLoading(true);
        setError(null);
        try {
            const res = await rentApiService.getRents();
            console.log('getRents: ', res.data);
            setRentList(res.data);
        } catch (error) {
            console.error('예약 목록 조회 실패:', error);
            setError(createApiError(error));
        } finally {
            setIsLoading(false);
        }
    }

    async function searchRents(isReload: boolean, searchText: string = "", status?: string, date?: string ) {
        setIsLoading(true);
        setError(null);

        // 새로 고침 일땐 마지막에 검색한 옵션 유지
        if(!isReload) {
            setSearchObj({searchText: searchText, status: status, date: date});
            
            try {
                const res = await rentApiService.searchRents(searchText, status, date);
                setRentList(res.data);
            } catch (error) {
                console.error('예약 검색 실패:', error);
                setError(createApiError(error));
            } finally {
                setIsLoading(false);
            }
        } else {
            // isReload가 true인 경우 이전 검색 옵션 사용
            try {
                const res = await rentApiService.searchRents(searchObj.searchText, searchObj.status, searchObj.date);
                setRentList(res.data);
            } catch (error) {
                console.error('예약 검색 실패:', error);
                setError(createApiError(error));
            } finally {
                setIsLoading(false);
            }
        }
    }

    useEffect(() => {
        getRents();
    }, []);

    return (
        <div className="w-full max-w-[1920px] mx-auto px-6">
            {error && <ErrorToast error={error} />}
            <div className="flex flex-col gap-4">
                {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">예약 관리</h1> */}
                <p className="text-gray-500 text-sm sm:text-base">차량 예약 정보를 관리하고 조회할 수 있습니다.</p>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <RentSearchLayer onSearch={searchRents} />
                    <div className="p-4 sm:p-6">
                        <RentTable 
                            rentList={rentList} 
                            setRentList={setRentList} 
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
    
export default RentSection;