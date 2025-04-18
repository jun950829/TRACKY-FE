import PageHeader from "@/components/custom/PageHeader";
import StatisticTopLayer from "./StatisticTopLayer";
import { useState } from "react";
import StatisticMonthSection from "./monthly/StatisticMonthSection";
import StatisticDailySection from "./daily/StatisticDailySection";
import StatisticCarSection from "./StatisticCarSection";

function StatisticMain() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'day'>('month');



  return (
  <div className="w-full h-full flex flex-col p-10">
    <PageHeader title={"관제 통계 분석"} size="2xl"/>
    <StatisticTopLayer selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />

    {selectedPeriod === 'month' && <StatisticMonthSection />}
    {selectedPeriod === 'day' && <StatisticDailySection />}

    <StatisticCarSection />

  </div>
  );
}

export default StatisticMain;
