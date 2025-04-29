import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import MonthPicker from "./MonthPicker";
import DayPicker from "./DayPicker";

interface StatisticDatePickerProps {
  selectedPeriod: "month" | "day";
  selectedDate: Date;
  onDateChange?: (dates: { start: Date; end: Date }) => void;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
}

function StatisticDatePicker({
  selectedPeriod,
  selectedDate,
  onDateChange,
  placeholder = "날짜 선택",
  clearable = false,
  onClear,
}: StatisticDatePickerProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatDate = () => {
    if (selectedPeriod === "month") {
      return format(selectedDate, "yyyy년 M월", { locale: ko });
    }
    return format(selectedDate, "yyyy년 M월 d일", { locale: ko });
  };

  const handleDateSelect = (date: Date) => {
    if (onDateChange) {
      onDateChange({ start: date, end: date });
    }
    setIsDatePickerOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {onClear && !selectedDate ? placeholder : formatDate()}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        {clearable && onClear && selectedDate && (
          <button
            onClick={onClear}
            className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {isDatePickerOpen && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-3">
            {selectedPeriod === "month" ? (
              <MonthPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            ) : (
              <DayPicker selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default StatisticDatePicker;
