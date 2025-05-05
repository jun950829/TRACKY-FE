import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRentStore } from "@/stores/rentStore";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/libs/utils/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ko } from "date-fns/locale";
import rentApiService from "@/libs/apis/rentsApi";

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
}

// Mock 데이터 생성 함수
const generateMockTimeSlots = (startDate: Date, endDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const currentDate = new Date(startDate);
  
  // 시작 날짜부터 종료 날짜까지 1시간 간격으로 슬롯 생성
  while (currentDate < endDate) {
    const slotStart = new Date(currentDate);
    const slotEnd = new Date(currentDate);
    slotEnd.setHours(slotEnd.getHours() + 1);
    
    // 현재 시간보다 이전 시간대는 모두 불가능으로 설정
    const isAvailable = slotStart > new Date();
    
    slots.push({
      start: slotStart.toISOString(),
      end: slotEnd.toISOString(),
      isAvailable
    });
    
    currentDate.setHours(currentDate.getHours() + 1);
  }
  
  return slots;
};

// 10분 간격의 시간 옵션 생성
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 10) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export function Step2Form() {
  const { setStep2Data, setCurrentStep, rentStime, rentEtime, selectedVehicle } = useRentStore();
  const [startDate, setStartDate] = useState<Date | undefined>(rentStime ? new Date(rentStime) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(rentEtime ? new Date(rentEtime) : undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const checkAvailability = async () => {
    if (!selectedVehicle || !startDate || !endDate) return;

    setIsLoading(true);
    try {
      // Mock 데이터 사용
      const mockTimeSlots = generateMockTimeSlots(startDate, endDate);
      setTimeSlots(mockTimeSlots);
      
      // 실제 API 호출은 주석 처리
      // const response = await rentApiService.checkAvailability({
      //   mdn: selectedVehicle,
      //   startDate: startDate.toISOString(),
      //   endDate: endDate.toISOString(),
      // });
      // setTimeSlots(response.data);
    } catch (error) {
      console.error("가용성 확인 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (time: string, isStart: boolean) => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = isStart ? startDate : endDate;
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      if (isStart) {
        setStartDate(newDate);
      } else {
        setEndDate(newDate);
      }
    }
  };

  const handleNext = () => {
    if (!startDate || !endDate) {
      alert("대여 시작 및 종료 시간을 선택해주세요.");
      return;
    }

    const selectedSlot = timeSlots.find(
      (slot) => slot.start === startDate.toISOString() && slot.end === endDate.toISOString()
    );

    if (!selectedSlot?.isAvailable) {
    //   alert("선택하신 시간대는 예약이 불가능합니다.");
    //   return;
    }

    setStep2Data({
      rentStime: startDate.toISOString(),
      rentEtime: endDate.toISOString(),
    });
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>대여 시작 시간</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ko }) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select
              value={startDate ? format(startDate, "HH:mm") : ""}
              onValueChange={(value) => handleTimeChange(value, true)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="시간 선택" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>대여 종료 시간</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ko }) : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select
              value={endDate ? format(endDate, "HH:mm") : ""}
              onValueChange={(value) => handleTimeChange(value, false)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="시간 선택" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">가용성 확인 중...</div>
      ) : timeSlots.length > 0 ? (
        <div className="space-y-4">
          <Label>예약 불가능 시간대</Label>
          <div className="space-y-3">
            {timeSlots
              .filter(slot => !slot.isAvailable)
              .map((slot, index) => {
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const isSameDay = startDate.toDateString() === endDate.toDateString();
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-600"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-red-900">
                        {format(startDate, "yyyy년 MM월 dd일", { locale: ko })}
                      </div>
                      <div className="text-sm text-red-700">
                        {format(startDate, "HH:mm", { locale: ko })} - {format(endDate, "HH:mm", { locale: ko })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {timeSlots.every(slot => !slot.isAvailable) && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              선택하신 기간 내 예약 가능한 시간대가 없습니다.
            </div>
          )}
        </div>
      ) : null}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleBack}>
          이전
        </Button>
        <Button onClick={handleNext}>다음</Button>
      </div>
    </div>
  );
} 