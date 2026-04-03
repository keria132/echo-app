import mongoose from 'mongoose';
import { PROCESS_EXIT_CODE_FAILED } from '../constants.js';

export const connectDB = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      throw new Error('Failed to get Mongo DB URI!');
    }

    const { connection } = await mongoose.connect(mongodbUri);

    console.log('MONGODB Connected: ', connection.host);
  } catch (error) {
    console.error('Error connecting to MONGODB: ', error);
    process.exit(PROCESS_EXIT_CODE_FAILED);
  }
};
