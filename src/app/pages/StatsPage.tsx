import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { StatsScreen } from '../components/StatsScreen';

export function StatsPage() {
  const { data, getWeeklyTotal } = useAppData();

  return (
    <StatsScreen
      today={data.today}
      history={data.history}
      streak={data.streak}
      weeklyTotal={getWeeklyTotal()}
    />
  );
}
