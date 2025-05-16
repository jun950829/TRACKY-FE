import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ko } from "date-fns/locale";

interface DayPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DayPicker = ({ selectedDate, onDateSelect }: DayPickerProps) => {
  const [displayMonth, setDisplayMonth] = useState(selectedDate);

  const now = new Date();

  const isFutureDate = (date: Date) => {
    const target = new Date(date);
    return target > now;
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(displayMonth));
    const end = endOfWeek(endOfMonth(displayMonth));
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <>
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-2 hover:bg-gray-50 rounded-lg"
          onClick={() => setDisplayMonth(subMonths(displayMonth, 1))}
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {format(displayMonth, "yyyy년 M월", { locale: ko })}
        </span>
        <button
          className="p-2 hover:bg-gray-50 rounded-lg"
          onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* 달력 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, displayMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const disabled = isFutureDate(day);

          return (
            <button
              key={index}
              onClick={() => !disabled && onDateSelect(day)}
              className={`
                p-1 text-sm rounded-lg flex items-center justify-center
                ${!isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                ${isSelected ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-50"}
                ${isToday && !isSelected ? "border border-blue-200" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={disabled}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default DayPicker;
