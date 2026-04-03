import { configDotenv } from 'dotenv';
import * as Sentry from '@sentry/node';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'node:path';
import { connectDB } from './lib/db.js';

configDotenv();

const app = express();
const __dirname = path.resolve();

const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/auth', authRoutes);
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
