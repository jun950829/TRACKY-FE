import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface StatisticDatePickerProps {
  selectedPeriod: 'month' | 'day';
  onDateChange?: (date: Date) => void;
}

function StatisticDatePicker({ selectedPeriod, onDateChange }: StatisticDatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = () => {
    if (selectedPeriod === 'month') {
      return format(selectedDate, 'yyyy년 M월', { locale: ko });
    }
    return format(selectedDate, 'yyyy년 M월 d일', { locale: ko });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange?.(date);
    setIsDatePickerOpen(false);
  };

  const handleQuickSelect = (daysToSubtract: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - daysToSubtract);
    handleDateSelect(newDate);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{formatDate()}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* 날짜 선택 드롭다운 */}
      {isDatePickerOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-4">
              <button 
                className="p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  handleDateSelect(newDate);
                }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500 rotate-90" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {selectedPeriod === 'month' ? '2024년' : '2024년 3월'}
              </span>
              <button 
                className="p-2 hover:bg-gray-50 rounded-lg"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  handleDateSelect(newDate);
                }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500 -rotate-90" />
              </button>
            </div>
            
            {/* 빠른 선택 */}
            <div className="space-y-1 mb-3">
              <button 
                onClick={() => handleQuickSelect(0)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                이번 {selectedPeriod === 'month' ? '달' : '주'}
              </button>
              <button 
                onClick={() => handleQuickSelect(selectedPeriod === 'month' ? 30 : 7)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                지난 {selectedPeriod === 'month' ? '달' : '주'}
              </button>
              <button 
                onClick={() => handleQuickSelect(selectedPeriod === 'month' ? 90 : 14)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                {selectedPeriod === 'month' ? '3개월' : '2주'} 전
              </button>
            </div>

            <div className="pt-3 border-t">
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
