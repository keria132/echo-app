import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';
import { NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../constants.js';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: NAME_MAX_LENGTH,
      lowercase: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    handleChangedAt: Date,
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
    isPrivate: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export type UserModelType = HydratedDocument<InferSchemaType<typeof UserSchema>>;

export default User;
