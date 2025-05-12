import { Card, CardContent } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { GraphStats, TimeSeriesData } from "@/constants/mocks/adminStaticsMockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticChartsProps {
  graphStats: GraphStats;
}

function StatisticCharts({graphStats}: StatisticChartsProps) {

  const carCountOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "전체 차량 수",
      },
    },
  };

  const carTypeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "전체 차종 분포",
      },
    },
  };

  const operationRateOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "월 가동률 순위",
      },
    },
  };

  const nonOperatedCarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "월 미운행 차량 수",
      },
    },
  };

  const carCountChartData = {
    labels: graphStats.carCountWithBizName.map((item) => item.bizName),
    datasets: [
      {
        label: "차량 수",
        data: graphStats.carCountWithBizName.map((item) => item.carCount),
        backgroundColor: [
          "#E57373", // 소프트 레드
          "#FFB74D", // 머스터드 오렌지
          "#FFF176", // 라이트 옐로우
          "#AED581", // 소프트 그린
          "#64B5F6", // 스카이 블루
          "#BA68C8", // 라벤더 퍼플
        ],
      },
    ],
  };

  const carTypeChartData = {
    labels: graphStats.carTypeCounts.map((item) => item.carType),
    datasets: [
      {
        label: "",
        data: graphStats.carTypeCounts.map((item) => item.carTypeCount),
        backgroundColor: [
          "#E57373", // 소프트 레드
          "#FFB74D", // 머스터드 오렌지
          "#FFF176", // 라이트 옐로우
          "#AED581", // 소프트 그린
          "#64B5F6", // 스카이 블루
          "#BA68C8", // 라벤더 퍼플
        ],
      },
    ],
  };

  const operationRateChartData = {
    labels: graphStats.operationRateWithBizName.map((item) => item.bizName),
    datasets: [
      {
        label: "가동률",
        data: graphStats.operationRateWithBizName.map((item) => item.rate),
        borderColor: "rgb(130, 202, 157)",
        backgroundColor: "rgba(130, 202, 157, 0.5)",
      },
    ],
  };

  const nonOperatedCarChartData = {
    labels: graphStats.nonOperatedCarWithBizName.map((item) => item.bizName),
    datasets: [
      {
        label: "차량 수",
        data: graphStats.nonOperatedCarWithBizName.map((item) => item.nonOperatedCarCount),
        backgroundColor: "rgba(136, 132, 216, 0.5)",
      },
    ],
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6 flex justify-center items-center">
          <div className="w-[280px] h-[280px]">
            <Doughnut options={carCountOptions} data={carCountChartData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex justify-center items-center">
          <div className="w-[280px] h-[280px]">
            <Doughnut options={carTypeOptions} data={carTypeChartData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Bar options={operationRateOptions} data={operationRateChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Bar options={nonOperatedCarOptions} data={nonOperatedCarChartData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default StatisticCharts;
