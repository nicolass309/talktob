import { apiFetch } from './apiClient';
import type { SignWordOut, PaginatedWordsOut } from '../types';

export interface GetWordsParams {
  category?: string;
  q?: string;
  only_priority?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateWordPayload {
  word: string;
  category: string;
  description?: string;
  urgency?: 'alta' | 'media' | 'baja';
}

export const wordsService = {
  async getWords(params: GetWordsParams = {}): Promise<PaginatedWordsOut> {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.q) query.set('q', params.q);
    if (params.only_priority !== undefined) query.set('only_priority', String(params.only_priority));
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.offset !== undefined) query.set('offset', String(params.offset));

    const queryString = query.toString();
    const endpoint = `/api/v1/words${queryString ? `?${queryString}` : ''}`;
    return apiFetch<PaginatedWordsOut>(endpoint, { method: 'GET' });
  },

  async createWord(payload: CreateWordPayload): Promise<SignWordOut> {
    return apiFetch<SignWordOut>('/api/v1/words', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
