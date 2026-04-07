import * as Sentry from '@sentry/node';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'node:path';
import { connectDB } from './lib/db.js';
import { DEFAULT_PORT, EXPRESS_JSON_LIMIT } from './constants.js';
import cookieParser from 'cookie-parser';

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT || DEFAULT_PORT;

app.use(express.json({ limit: EXPRESS_JSON_LIMIT }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/.*/, (_, response) => {
    response.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

Sentry.setupExpressErrorHandler(app);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
