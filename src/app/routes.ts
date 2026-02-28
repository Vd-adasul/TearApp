import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { TodayPage } from './pages/TodayPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: TodayPage },
      { path: 'stats', Component: StatsPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
