const API_BASE_URL = __DEV__ ? 'http://10.0.2.2:5000/api' : 'https://your-production-api.com/api';

const authenticatedApiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
};

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
    return authenticatedApiClient.get('/messages/conversations');
  },

  getMessages: async (contactId: string): Promise<Message[]> => {
    return authenticatedApiClient.get(`/messages/${contactId}`);
  },

  sendMessage: async (receiverId: string, content: string, messageType = 'text'): Promise<Message> => {
    return authenticatedApiClient.post('/messages', {
      receiver: receiverId,
      content,
      messageType
    });
  },
};