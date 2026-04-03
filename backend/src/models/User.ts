import mongoose from 'mongoose';
import { PASSWORD_MIN_LENGTH } from '../constants.js';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: PASSWORD_MIN_LENGTH,
    },
    profileIcon: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export default User;
