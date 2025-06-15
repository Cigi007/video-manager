import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initErrorTracking = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
};

export const captureError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, 'Context:', context);
  }
};

export const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
  }
}; 