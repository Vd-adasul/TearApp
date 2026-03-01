import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { SetupScreen } from '../components/SetupScreen';
import { TodayScreen } from '../components/TodayScreen';

export function TodayPage() {
  const {
    data,
    isSetupRequired,
    setupToday,
    tearSegment,
    undoTearSegment,
    addHours,
    updateTask,
  } = useAppData();

  if (isSetupRequired) {
    return <SetupScreen onSetup={setupToday} />;
  }

  return (
    <TodayScreen
      today={data.today!}
      quoteIndex={data.lastQuoteIndex}
      streak={data.streak}
      onTear={tearSegment}
      onUndoTear={undoTearSegment}
      onAddHours={addHours}
      onTaskChange={updateTask}
    />
  );
}
