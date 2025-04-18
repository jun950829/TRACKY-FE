import StatisticDailySection from './daily/StatisticDailySection';
import StatisticMonthSection from './monthly/StatisticMonthSection';
import StatisticCarTable from './StatisticCarTable';

function StatisticPage() {
  return (
    <div className="space-y-6 p-6">
      <StatisticMonthSection />
      <StatisticDailySection />
      <StatisticCarTable />
    </div>
  );
}

export default StatisticPage; 