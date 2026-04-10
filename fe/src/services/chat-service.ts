import apiClient from './api-client';
import type { ChatSendResponse, ChatSession } from '../types';

const BASE = '/api/v1/chat';

export const chatService = {
  async sendMessage(message: string, sessionToken?: string): Promise<ChatSendResponse> {
    const { data } = await apiClient.post(`${BASE}/send`, {
      message,
      session_token: sessionToken,
    });
    return data.data;
  },

  async getHistory(sessionToken: string): Promise<ChatSession | null> {
    try {
      const { data } = await apiClient.get(`${BASE}/history/${sessionToken}`);
      return data.data;
    } catch {
      return null;
    }
  },
};
