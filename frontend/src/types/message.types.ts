export type MessageStatus = 'sending' | 'failed' | 'sent' | 'viewed';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  status: MessageStatus;
}
