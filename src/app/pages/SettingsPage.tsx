import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { SettingsScreen } from '../components/SettingsScreen';

export function SettingsPage() {
  const { resetToday } = useAppData();

  return (
    <SettingsScreen
      onResetToday={resetToday}
    />
  );
}
