import React from 'react';
import { useAppData } from '../hooks/useAppData';
import { SettingsScreen } from '../components/SettingsScreen';

export function SettingsPage() {
  const { data, setMotivationPhoto, resetToday } = useAppData();

  return (
    <SettingsScreen
      motivationPhoto={data.motivationPhoto}
      onPhotoChange={setMotivationPhoto}
      onResetToday={resetToday}
    />
  );
}
