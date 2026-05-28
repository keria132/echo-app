import * as Sentry from '@sentry/node';
import express, { json } from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import messageRoutes from './routes/message.route.js';
import chatRoutes from './routes/chat.route.js';
import path from 'node:path';
import { connectDB } from './lib/db.js';
import { DEFAULT_PORT, EXPRESS_JSON_LIMIT } from './constants.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { env } from './lib/env.js';
import { createServer } from 'node:http';
import { initSocket } from './lib/socket.js';

const app = express();
const httpServer = createServer(app);
const __dirname = path.resolve();

const PORT = process.env.PORT || DEFAULT_PORT;

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(json({ limit: EXPRESS_JSON_LIMIT }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/.*/, (_, response) => {
    response.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

Sentry.setupExpressErrorHandler(app);

await connectDB();
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
