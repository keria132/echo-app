import mongoose from 'mongoose';
import { PROCESS_EXIT_CODE_FAILED } from '../constants.js';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(env.MONGODB_URI);

    console.log('MONGODB Connected: ', connection.host);
  } catch (error) {
    console.error('Error connecting to MONGODB: ', error);
    process.exit(PROCESS_EXIT_CODE_FAILED);
  }
};
