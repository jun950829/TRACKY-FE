import MonthlyCards from './MonthlyCards';
import MonthlyCharts from './MonthlyCharts';

function StatisticMonthSection() {
  return (
    <div className="space-y-8">
      <MonthlyCards />
      <MonthlyCharts />
    </div>
  );
}

export default StatisticMonthSection;