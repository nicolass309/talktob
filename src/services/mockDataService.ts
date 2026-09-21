import type { SignWord, Challenge, RankingUser, CommunityProgress, UserProfile } from '../types';

export const CHILEAN_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén del General Carlos Ibáñez del Campo',
  'Magallanes y de la Antártica Chilena'
];

export const INITIAL_COMMUNITY_PROGRESS: CommunityProgress = {
  totalContributions: 0,
  targetContributions: 50000,
  activeContributors: 0,
  validatedHours: 0
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_new_user',
  name: 'Nuevo Contribuidor',
  email: 'usuario@talktob.cl',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  regionZone: 'Centro',
  specificRegion: 'Metropolitana de Santiago',
  learningOrigin: 'Asociación',
  relationWithLSCH: 'Persona sorda',
  points: 0,
  contributionsCount: 0,
  videosCount: 0,
  wordsCount: 0,
  level: 1,
  badges: [],
  isOnboarded: false
};

export const INITIAL_SIGN_WORDS: SignWord[] = [];
export const INITIAL_CHALLENGES: Challenge[] = [];
export const RANKING_WEEKLY: RankingUser[] = [];
export const RANKING_ALL_TIME: RankingUser[] = [];
