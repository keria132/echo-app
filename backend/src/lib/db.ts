import mongoose from 'mongoose';
import { ERROR_MESSAGES, PROCESS_EXIT_CODE_FAILED } from '../constants.js';

export const connectDB = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) {
      throw new Error(ERROR_MESSAGES.mongoDbUriFailure);
    }

    const { connection } = await mongoose.connect(mongodbUri);

    console.log('MONGODB Connected: ', connection.host);
  } catch (error) {
    console.error('Error connecting to MONGODB: ', error);
    process.exit(PROCESS_EXIT_CODE_FAILED);
  }
};
