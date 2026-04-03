import 'dotenv/config';

const requiredEnvVars = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SENTRY_DSN: process.env.SENTRY_DSN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLIENT_URL: process.env.CLIENT_URL,
} as const;

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
}

export const env = requiredEnvVars as { [K in keyof typeof requiredEnvVars]: string };
