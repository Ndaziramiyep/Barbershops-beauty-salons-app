import { apiClient } from '../api';

export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'voice' | 'video' | 'file' | 'location';
  fileUrl?: string;
  duration?: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  contact: {
    _id: string;
    name: string;
    avatar: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    return apiClient.get('/messages/conversations');
  },

  getMessages: async (contactId: string): Promise<Message[]> => {
    return apiClient.get(`/messages/${contactId}`);
  },

  sendMessage: async (receiverId: string, content: string, messageType = 'text'): Promise<Message> => {
    return apiClient.post('/messages', {
      receiver: receiverId,
      content,
      messageType
    });
  },
};