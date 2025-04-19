import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dailyHourlyOperationData } from '@/constants/mocks/statisticMockData';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import StatisticDatePicker from '../StatisticDatePicker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DailyChartsProps {
  selectedDate: Date;
}

function DailyCharts({ selectedDate }: DailyChartsProps) {
  const [compareDate, setCompareDate] = useState<Date | null>(null);

  // 비교 데이터 (실제로는 API에서 받아와야 함)
  const compareData = {
    ...dailyHourlyOperationData,
    datasets: [
      {
        ...dailyHourlyOperationData.datasets[0],
        label: format(selectedDate, 'M월 d일', { locale: ko }),
      },
      ...(compareDate ? [{
        label: format(compareDate, 'M월 d일', { locale: ko }),
        data: [
          3, 2, 1, 1, 2, 4,   // 0-5시
          6, 9, 13, 14, 12, 11, // 6-11시
          13, 15, 14, 16, 15, 17, // 12-17시
          14, 11, 7, 5, 3, 2    // 18-23시
        ],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }] : [])
    ]
  };

  const handleCompareDate = (dates: { start: Date; end: Date }) => {
    setCompareDate(dates.start);
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">시간별 운행량</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">비교 날짜:</span>
              <StatisticDatePicker
                selectedPeriod="day"
                selectedDate={compareDate || new Date()}
                onDateChange={handleCompareDate}
                placeholder="날짜 선택"
                clearable
                onClear={() => setCompareDate(null)}
              />
            </div>
          </div>
          <div className="h-[300px]">
            <Line
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: '운행 차량 수'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: '시간'
                    }
                  }
                },
                interaction: {
                  mode: 'nearest',
                  axis: 'x',
                  intersect: false
                }
              }}
              data={compareData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCharts; 