import { useState } from 'react';
import StatisticDatePicker from './StatisticDatePicker';

interface StatisticTopLayerProps {
  selectedPeriod: 'month' | 'day';
  setSelectedPeriod: (period: 'month' | 'day') => void;
  selectedDateRange: {
    start: Date;
    end: Date;
  };
  onDateChange: (dates: { start: Date; end: Date }) => void;
}

function StatisticTopLayer({ 
  selectedPeriod, 
  setSelectedPeriod,
  selectedDateRange,
  onDateChange 
}: StatisticTopLayerProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            월별
          </button>
          <button
            onClick={() => setSelectedPeriod('day')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'day'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            일별
          </button>
        </div>

        <StatisticDatePicker
          selectedPeriod={selectedPeriod}
          selectedDate={selectedDateRange.start}
          onDateChange={onDateChange}
        />
      </div>
    </div>
  );
}

export default StatisticTopLayer;
