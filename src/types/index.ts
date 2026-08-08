export type ChileanZone = 'Norte' | 'Centro' | 'Sur' | 'Otra';

export type LearningOrigin = 
  | 'Nativo'
  | 'Escuela' 
  | 'Familia' 
  | 'Asociación' 
  | 'Cursos' 
  | 'Por mi cuenta' 
  | 'Otro';

export type RelationWithLSCH = 
  | 'Persona sorda' 
  | 'CODA' 
  | 'Intérprete' 
  | 'Estudiante' 
  | 'Familiar' 
  | 'Otra';

export type ContributionStatus = 
  | 'pendiente' 
  | 'grabando' 
  | 'listo_para_enviar' 
  | 'subiendo' 
  | 'procesando' 
  | 'completado' 
  | 'guardado_localmente' 
  | 'error';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  regionZone: ChileanZone;
  specificRegion: string;
  learningOrigin: LearningOrigin;
  relationWithLSCH: RelationWithLSCH;
  points: number;
  contributionsCount: number;
  videosCount: number;
  wordsCount: number;
  level: number;
  badges: Badge[];
  isOnboarded: boolean;
}

export interface SignWord {
  id: string;
  word: string;
  category: string;
  urgency: 'alta' | 'media' | 'baja';
  currentVideos: number;
  targetVideos: number;
  description: string;
  isPriority: boolean;
  basePoints: number;
  priorityBonus: number;
}

export interface TakeData {
  takeNumber: 1 | 2 | 3;
  blob: Blob | null;
  videoUrl: string | null;
  duration: number;
  recordedAt: string;
  isSimulated?: boolean;
}

export interface Contribution {
  id: string;
  userId: string;
  wordId: string;
  wordName: string;
  category: string;
  takes: TakeData[];
  status: ContributionStatus;
  pointsEarned: number;
  isPriority: boolean;
  createdAt: string;
  syncedAt?: string;
  errorMessage?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetCount: number;
  currentCount: number;
  bonusPoints: number;
  icon: string;
  requiredWords: string[];
  isCompleted: boolean;
}

export interface RankingUser {
  rank: number;
  name: string;
  avatar: string;
  region: string;
  points: number;
  videos: number;
  contributions: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface CommunityProgress {
  totalContributions: number;
  targetContributions: number;
  activeContributors: number;
  validatedHours: number;
}

export type AppScreen = 
  | 'landing' 
  | 'onboarding' 
  | 'home' 
  | 'capture' 
  | 'review' 
  | 'profile' 
  | 'ranking' 
  | 'challenges' 
  | 'history';
