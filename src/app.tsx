import 'src/global.css';

// ----------------------------------------------------------------------

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

import { store } from './store/store';
import { LocalizationProvider } from './locales';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const queryClient = new QueryClient();
  return (
    <LocalizationProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthProvider>
            <SettingsProvider settings={defaultSettings}>
              <ThemeProvider>
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer />
                  <Router />
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </Provider>
      </QueryClientProvider>
    </LocalizationProvider>
  );
}
