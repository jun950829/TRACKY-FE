import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { ReservationCardProps, DateFilter } from "@/constants/types/reservation";
import { getFilterDate, formatDate, formatTime, isDateInFilter, getCarModelAndMdn } from "@/libs/utils/reservationUtils";
import StatusBadge from "@/components/custom/StatusBadge";

function ReturnedStatus({ reservations, isLoading, getReservationStatusData }: ReservationCardProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>(DateFilter.TODAY);

  useEffect(() => {
    getReservationStatusData(dateFilter);
  }, [dateFilter]);

  const filteredReservations = reservations.filter((res) => 
    isDateInFilter(new Date(res.rentStime),new Date(res.rentEtime),  dateFilter)
  );
  
  return (
    <Card className="w-1/2 h-full bg-white rounded-lg shadow-sm border border-zinc-100">
      <CardHeader className="p-4 bg-white border-b border-zinc-100">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {/* <Calendar className="h-4 w-4 text-primary" /> */}
            <h2 className="text-lg font-semibold">반납 현황</h2>
          </CardTitle>
          
          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setDateFilter((prev) => 
                prev === DateFilter.YESTERDAY ? DateFilter.TOMORROW : prev - 1
              )}
              className="p-1 rounded hover:bg-zinc-100"
              disabled={dateFilter === DateFilter.YESTERDAY}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            
            <div className="flex font-medium min-w-[60px] justify-center">
              {dateFilter === DateFilter.YESTERDAY && "어제"}
              {dateFilter === DateFilter.TODAY && "오늘"}
              {dateFilter === DateFilter.TOMORROW && "내일"}
            </div>
            
            <button
              onClick={() => setDateFilter((prev) => 
                prev === DateFilter.TOMORROW ? DateFilter.YESTERDAY : prev + 1
              )}
              className="p-1 rounded hover:bg-zinc-100"
              disabled={dateFilter === DateFilter.TOMORROW}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 65px)' }}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 border border-zinc-100 rounded-lg">
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <CalendarIcon className="h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-sm">
              {dateFilter === DateFilter.YESTERDAY && "어제 예약이 없습니다."}
              {dateFilter === DateFilter.TODAY && "오늘 예약이 없습니다."}
              {dateFilter === DateFilter.TOMORROW && "내일 예약이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-zinc-500 font-medium">
              {formatDate(getFilterDate(dateFilter))}  (총 : {filteredReservations.length}건)
            </div>
            
            {filteredReservations.map((reservation, index) => {
              const { mdn } = getCarModelAndMdn(index);
              
              return (
                <div 
                  key={reservation.rentUuid} 
                  className="p-3 bg-white border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  {/* 상단: 차량번호, 대여상태 */}
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-md">{reservation.carPlate}</div>
                    <StatusBadge status={reservation.rentStatus} type="rent" />
                  </div>
                  
                  {/* 중간: 대여자명, 차종, MDN */}
                  <div className="flex justify-between text-xs mt-1">
                    <div className="text-zinc-700">
                      {reservation.renterName} / {reservation.carType}
                    </div>
                    <div className="text-zinc-500">
                      {mdn}
                    </div>
                  </div>
                  
                  {/* 하단: 예약 시작, 예약번호, 예약 종료 */}
                  <div className="mt-2 pt-2 border-t border-zinc-100 text-xs flex justify-between">
                    <div>
                      <div className="text-zinc-500">시작</div>
                      <div>{formatTime(new Date(reservation.rentStime))}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-zinc-500">예약번호</div>
                      <div>{reservation.rentUuid}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-zinc-500">종료</div>
                      <div>{formatTime(new Date(reservation.rentEtime))}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ReturnedStatus;

