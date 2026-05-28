import { HydratedDocument, InferSchemaType, model, Schema } from 'mongoose';

const MessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
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
    status: {
      type: String,
      enum: ['sent', 'viewed'],
      default: 'sent',
    },
    viewedAt: Date,
  },
  { timestamps: true },
);

const Message = model('Message', MessageSchema);

export type MessageModelType = HydratedDocument<InferSchemaType<typeof MessageSchema>>;

export default Message;
