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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DailyCharts() {
  return (
    <div className="p-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시간별 운행량</h3>
          <div className="h-[300px]">
            <Line
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
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
                }
              }}
              data={dailyHourlyOperationData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCharts; 