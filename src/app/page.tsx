'use client';

import { AppProvider, useApp } from '@/components/AppProvider';
import InputScreen from '@/components/input/InputScreen';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ShootingScreen from '@/components/shoot/ShootingScreen';
import SettingsModal from '@/components/settings/SettingsModal';

function AppContent() {
  const { screen } = useApp();

  return (
    <>
      {screen === 'input' && <InputScreen />}
      {screen === 'loading' && <LoadingScreen />}
      {screen === 'shoot' && <ShootingScreen />}
      <SettingsModal />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
