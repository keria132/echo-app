import * as Sentry from '@sentry/node';
import { env } from './lib/env.js';

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.2,
});
