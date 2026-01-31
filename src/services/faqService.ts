import { apiClient } from '../api';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export const faqService = {
  getAllFAQs: async (): Promise<FAQ[]> => {
    return apiClient.get('/faqs');
  },
};