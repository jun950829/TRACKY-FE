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
import { Line, Bar } from "react-chartjs-2";
import { TimeSeriesData } from "@/constants/mocks/adminStaticsMockData";

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
  monthlyRentalData: TimeSeriesData[];
  dailyActiveUsersData: TimeSeriesData[];
  vehicleTypeDistribution: { type: string; count: number }[];
  bizRatingDistribution: { rating: string; count: number }[];
}

function StatisticCharts({
  monthlyRentalData,
  dailyActiveUsersData,
  vehicleTypeDistribution,
  bizRatingDistribution,
}: StatisticChartsProps) {
  const monthlyRentalOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "당월 평균 운행률",
      },
    },
  };

  const dailyActiveUsersOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "당월 미운행 차량수",
      },
    },
  };

  const vehicleTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "당월 총 운행량",
      },
    },
  };

  const bizRatingOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "일별 운행수",
      },
    },
  };

  const monthlyRentalChartData = {
    labels: monthlyRentalData.map((item) => item.date),
    datasets: [
      {
        label: "운행 횟수",
        data: monthlyRentalData.map((item) => item.value),
        borderColor: "rgb(136, 132, 216)",
        backgroundColor: "rgba(136, 132, 216, 0.5)",
      },
    ],
  };

  const dailyActiveUsersChartData = {
    labels: dailyActiveUsersData.map((item) => item.date),
    datasets: [
      {
        label: "차량 수",
        data: dailyActiveUsersData.map((item) => item.value),
        borderColor: "rgb(130, 202, 157)",
        backgroundColor: "rgba(130, 202, 157, 0.5)",
      },
    ],
  };

  const vehicleTypeChartData = {
    labels: vehicleTypeDistribution.map((item) => item.type),
    datasets: [
      {
        label: "운행 수",
        data: vehicleTypeDistribution.map((item) => item.count),
        backgroundColor: "rgba(136, 132, 216, 0.5)",
      },
    ],
  };

  const bizRatingChartData = {
    labels: bizRatingDistribution.map((item) => item.rating),
    datasets: [
      {
        label: "운행 수",
        data: bizRatingDistribution.map((item) => item.count),
        backgroundColor: "rgba(130, 202, 157, 0.5)",
      },
    ],
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <Line options={monthlyRentalOptions} data={monthlyRentalChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Line options={dailyActiveUsersOptions} data={dailyActiveUsersChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Bar options={vehicleTypeOptions} data={vehicleTypeChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Bar options={bizRatingOptions} data={bizRatingChartData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default StatisticCharts;
