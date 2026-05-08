import './instrument';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import * as Sentry from '@sentry/react';
import { BrowserRouter } from 'react-router';
import { Toaster } from './components/ui/sonner.tsx';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './lib/query.ts';

const queryClient = getQueryClient();

if (import.meta.env.DEV) {
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

const container = document.getElementById('root');
const root = createRoot(container!, {
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <App />
          <Toaster richColors />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
