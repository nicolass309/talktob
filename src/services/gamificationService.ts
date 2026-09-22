import { apiFetch } from './apiClient';
import type {
  Challenge,
  RankingOut,
  CommunityProgress,
  UserProfile,
} from '../types';

export interface UpdateUserPayload {
  name?: string;
  regionZone?: string;
  specificRegion?: string;
  learningOrigin?: string;
  relationWithLSCH?: string;
  isOnboarded?: boolean;
}

export const gamificationService = {
  async getChallenges(): Promise<Challenge[]> {
    return apiFetch<Challenge[]>('/api/v1/challenges', { method: 'GET' });
  },

  async getRanking(scope: 'weekly' | 'all_time' = 'all_time', limit = 50): Promise<RankingOut> {
    return apiFetch<RankingOut>(`/api/v1/ranking?scope=${scope}&limit=${limit}`, { method: 'GET' });
  },

  async getCommunityProgress(): Promise<CommunityProgress> {
    return apiFetch<CommunityProgress>('/api/v1/community/progress', { method: 'GET' });
  },

  async getMe(): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/v1/me', { method: 'GET' });
  },

  async updateMe(payload: UpdateUserPayload): Promise<UserProfile> {
    return apiFetch<UserProfile>('/api/v1/me', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
