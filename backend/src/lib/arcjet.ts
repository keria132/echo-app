import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/node';
import { env } from './env.js';

const isDev = process.env.NODE_ENV !== 'production';

const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    detectBot({
      mode: isDev ? 'DRY_RUN' : 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:MONITOR', 'CATEGORY:PREVIEW'],
    }),
    slidingWindow({
      mode: 'LIVE',
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
