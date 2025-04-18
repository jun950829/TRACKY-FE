import { useState } from 'react';
import StatisticDatePicker from './StatisticDatePicker';

interface StatisticTopLayerProps {
  selectedPeriod: 'month' | 'day';
  setSelectedPeriod: (period: 'month' | 'day') => void;
}

function StatisticTopLayer({ selectedPeriod, setSelectedPeriod }: StatisticTopLayerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="bg-white border-b border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === 'month'
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              월별
            </button>
            <button
              onClick={() => setSelectedPeriod('day')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === 'day'
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              일별
            </button>
          </div>

          <StatisticDatePicker
            selectedPeriod={selectedPeriod}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticTopLayer;
