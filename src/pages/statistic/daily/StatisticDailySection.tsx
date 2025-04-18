import DailyCards from './DailyCards';
import DailyCharts from './DailyCharts';

function StatisticDailySection() {
  return (
    <div className="space-y-8">
      <DailyCards />
      <DailyCharts />
    </div>
  );
}

export default StatisticDailySection; 