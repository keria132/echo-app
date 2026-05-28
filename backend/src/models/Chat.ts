import { model, Schema } from 'mongoose';
import { HydratedDocument, InferSchemaType, Types } from 'mongoose';

const ChatSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: 'User' }],
    lastMessage: {
      text: String,
      senderId: { type: Types.ObjectId, ref: 'User' },
      createdAt: Date,
    },
    unreadCounts: { type: Map, of: Number, default: {} },
  },
  {
    timestamps: true,
    toObject: { flattenMaps: true },
    toJSON: { flattenMaps: true },
  },
);

const Chat = model('Chat', ChatSchema);

export type ChatModelType = HydratedDocument<InferSchemaType<typeof ChatSchema>>;

export default Chat;
