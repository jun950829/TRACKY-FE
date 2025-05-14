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

  const handlePreviousYear = () => setCurrentYear(currentYear - 1);
  const handleNextYear = () => setCurrentYear(currentYear + 1);

  const handleMonthSelect = (month: number) => {
    const newDate = setMonth(new Date(currentYear, 0), month);
    onDateSelect(newDate);
  };

  return (
    <div className="w-[280px]">
      <div className="flex items-center justify-between mb-4">
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

          return (
            <button
              key={month}
              onClick={() => handleMonthSelect(month)}
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
