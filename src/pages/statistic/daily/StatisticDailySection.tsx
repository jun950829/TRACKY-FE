import DailyCards from './DailyCards';
import DailyCharts from './DailyCharts';

interface StatisticDailySectionProps {
  selectedDate: Date;
}

function StatisticDailySection({ selectedDate }: StatisticDailySectionProps) {
  return (
    <div className="space-y-6">
      <DailyCards />
      <DailyCharts selectedDate={selectedDate} />
    </div>
  );
}

export default StatisticDailySection; 