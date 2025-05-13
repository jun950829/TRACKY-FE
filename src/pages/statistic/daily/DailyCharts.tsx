import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import StatisticDatePicker from "../StatisticDatePicker";
import { DailyStatisticResponse, HourlyStats, statisticApiService } from "@/libs/apis/statisticApi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DailyChartsProps {
  selectedDate: Date;
  dailyData: DailyStatisticResponse | null;
}

function DailyCharts({ selectedDate, dailyData }: DailyChartsProps) {
  const [compareDate, setCompareDate] = useState<Date | null>(null);
  const [compareData, setCompareData] = useState<DailyStatisticResponse | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);

  // 비교 날짜가 변경되면 해당 날짜의 데이터를 가져옴
  const handleCompareDate = async (dates: { start: Date; end: Date }) => {
    const newCompareDate = dates.start;
    setCompareDate(newCompareDate);

    if (newCompareDate) {
      setIsLoadingCompare(true);
      try {
        const data = await statisticApiService.getDailyStatistic(newCompareDate);
        setCompareData(data);
      } catch (error) {
        console.error("비교 통계 데이터 로드 실패:", error);
      } finally {
        setIsLoadingCompare(false);
      }
    }
  };

  // 비교 날짜 선택 취소 시 데이터 초기화
  const handleClearCompare = () => {
    setCompareDate(null);
    setCompareData(null);
  };

  // 차트 데이터 생성
  const getChartData = () => {
    const labels = Array.from({ length: 24 }, (_, i) => `${i}시`);
    const datasets = [];

    // 현재 날짜 데이터 추가
    if (dailyData) {
      const hourlyData = Array(24).fill(0);
      dailyData.hourlyStats.forEach((stat: HourlyStats) => {
        hourlyData[stat.hour] = stat.driveCount;
      });

      datasets.push({
        label: format(selectedDate, "M월 d일", { locale: ko }),
        data: hourlyData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    }

    // 비교 날짜 데이터 추가
    if (compareData && compareDate) {
      const hourlyData = Array(24).fill(0);
      compareData.hourlyStats.forEach((stat: HourlyStats) => {
        hourlyData[stat.hour] = stat.driveCount;
      });

      datasets.push({
        label: format(compareDate, "M월 d일", { locale: ko }),
        data: hourlyData,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    } else if (compareDate) {
      // 비교 데이터 로딩 중이거나 실패 시 목데이터 사용
      datasets.push({
        label: format(compareDate, "M월 d일", { locale: ko }),
        data: [
          3,
          2,
          1,
          1,
          2,
          4, // 0-5시
          6,
          9,
          13,
          14,
          12,
          11, // 6-11시
          13,
          15,
          14,
          16,
          15,
          17, // 12-17시
          14,
          11,
          7,
          5,
          3,
          2, // 18-23시
        ],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      });
    }

    return {
      labels,
      datasets,
    };
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">시간별 운행량</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">비교 날짜:</span>
              {isLoadingCompare && <span className="text-xs text-gray-500">로딩 중...</span>}
              <StatisticDatePicker
                selectedPeriod="day"
                selectedDate={compareDate || new Date()}
                onDateChange={handleCompareDate}
                placeholder="날짜 선택"
                clearable
                onClear={handleClearCompare}
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
                    position: "top" as const,
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "운행 차량 수",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "시간",
                    },
                  },
                },
                interaction: {
                  mode: "nearest",
                  axis: "x",
                  intersect: false,
                },
              }}
              data={getChartData()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyCharts;
