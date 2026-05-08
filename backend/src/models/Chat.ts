import mongoose, { HydratedDocument, InferSchemaType, Types } from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: Types.ObjectId, ref: 'User' }],
    lastMessage: {
      text: String,
      senderId: { type: Types.ObjectId, ref: 'User' },
      createdAt: Date,
    },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Chat = mongoose.model('Chat', ChatSchema);

export type ChatModelType = HydratedDocument<InferSchemaType<typeof ChatSchema>>;

export default Chat;
