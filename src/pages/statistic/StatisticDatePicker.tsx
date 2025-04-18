import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface StatisticDatePickerProps {
  selectedPeriod: 'month' | 'day';
  selectedDate: Date;
  onDateChange?: (dates: { start: Date; end: Date }) => void;
}

function StatisticDatePicker({ selectedPeriod, selectedDate, onDateChange }: StatisticDatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(selectedDate);

  const formatDate = () => {
    if (selectedPeriod === 'month') {
      return format(selectedDate, 'yyyy년 M월', { locale: ko });
    }
    return format(selectedDate, 'yyyy년 M월 d일', { locale: ko });
  };

  const handleDateSelect = (date: Date) => {
    if (selectedPeriod === 'month') {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      onDateChange?.({ start, end });
    } else {
      onDateChange?.({ start: date, end: date });
    }
    setIsDatePickerOpen(false);
  };

  const getDaysInMonth = () => {
    const start = startOfWeek(startOfMonth(displayMonth));
    const end = endOfWeek(endOfMonth(displayMonth));
    return eachDayOfInterval({ start, end });
  };

  const days = getDaysInMonth();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <CalendarIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{formatDate()}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isDatePickerOpen && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-3">
            {/* 달력 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <button 
                className="p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => setDisplayMonth(subMonths(displayMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {format(displayMonth, 'yyyy년 M월', { locale: ko })}
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
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* 달력 날짜 */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, displayMonth);
                const isSelected = isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      p-1 text-sm rounded-lg flex items-center justify-center
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}
                      ${isToday && !isSelected ? 'border border-blue-200' : ''}
                    `}
                    disabled={selectedPeriod === 'month' && !isCurrentMonth}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatisticDatePicker;
