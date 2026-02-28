import React from 'react';
import { useNavigate } from 'react-router';
import { useAppData } from '../hooks/useAppData';
import { SetupScreen } from '../components/SetupScreen';
import { TodayScreen } from '../components/TodayScreen';

export function TodayPage() {
  const {
    data,
    isSetupRequired,
    setupToday,
    tearSegment,
    updateTask,
  } = useAppData();

  if (isSetupRequired) {
    return <SetupScreen onSetup={setupToday} />;
  }

  return (
    <TodayScreen
      today={data.today!}
      quoteIndex={data.lastQuoteIndex}
      motivationPhoto={data.motivationPhoto}
      streak={data.streak}
      onTear={tearSegment}
      onTaskChange={updateTask}
    />
  );
}
