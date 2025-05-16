import { useState } from "react";
import { format, setMonth, getYear, getMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MonthPicker({ selectedDate, onDateSelect }: MonthPickerProps) {
  const [currentYear, setCurrentYear] = useState(getYear(selectedDate));
  const months = Array.from({ length: 12 }, (_, i) => i);
  const currentMonth = getMonth(selectedDate);

  const now = new Date();

  const isFutureMonth = (year: number, month: number) => {
    const target = new Date(year, month);
    return target > now;
  };


  const handlePreviousYear = () => setCurrentYear(currentYear - 1);
  const handleNextYear = () => setCurrentYear(currentYear + 1);

  const handleMonthSelect = (month: number) => {
    const newDate = setMonth(new Date(currentYear, 0), month);
    onDateSelect(newDate);
  };

  return (
    <div className="max-w-[280px] w-full">
      <div className="w-full flex items-center justify-between mb-4">
        <button onClick={handlePreviousYear} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">
          {format(new Date(currentYear, 0), "yyyy년", { locale: ko })}
        </div>
        <button onClick={handleNextYear} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {months.map((month) => {
          const isSelected = currentMonth === month && getYear(selectedDate) === currentYear;
          const disabled = isFutureMonth(currentYear, month);

          return (
            <button
              key={month}
              onClick={() => !disabled && handleMonthSelect(month)}
              disabled={disabled}
              className={`
                p-2 rounded-md text-sm text-center
                ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100"}
              `}
            >
              {format(new Date(currentYear, month), "M월", { locale: ko })}
            </button>
          );
        })}
      </div>
    </div>
  );
}
