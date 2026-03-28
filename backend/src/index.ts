import { configDotenv } from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

configDotenv();

const app = express();

const PORT = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
