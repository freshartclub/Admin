import 'src/global.css';

// ----------------------------------------------------------------------

import { Toaster } from 'sonner';
import { Provider } from 'react-redux';
import { useLoadScript } from '@react-google-maps/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';

import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { AuthProvider } from 'src/auth/context/jwt';
import { store } from './store/store';
import { I18nProvider, LocalizationProvider } from './locales';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const queryClient = new QueryClient();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ['places', 'marker'],
    version: 'beta',
    mapIds: ['DEMO_MAP_ID'],
  });

  return (
    <LocalizationProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Toaster position="top-right" />
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
          <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
      </I18nProvider>
    </LocalizationProvider>
  );
}
