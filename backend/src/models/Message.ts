import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model('Message', MessageSchema);

export type MessageModelType = HydratedDocument<InferSchemaType<typeof MessageSchema>>;

export default Message;
