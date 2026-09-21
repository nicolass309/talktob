export type ChileanZone = 'Norte' | 'Centro' | 'Sur' | 'Otra';

export type LearningOrigin = 
  | 'Nativo'
  | 'Escuela' 
  | 'Familia' 
  | 'Asociación'
  | 'Asociacion' 
  | 'Cursos' 
  | 'Por mi cuenta' 
  | 'Otro';

export type RelationWithLSCH = 
  | 'Persona sorda' 
  | 'CODA' 
  | 'Intérprete'
  | 'Interprete' 
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

export type ReviewStatus = 'pendiente' | 'aprobado' | 'rechazado';
export type WordStatus = 'aprobada' | 'pendiente' | 'rechazada';
export type UserRole = 'contribuidor' | 'revisor' | 'admin';

export interface Badge {
  id: string;
  code?: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  clerkUserId?: string;
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
  role?: UserRole;
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
  status?: WordStatus;
  createdByUserId?: string;
}

export interface TakeData {
  takeNumber: 1 | 2 | 3;
  blob: Blob | null;
  videoUrl: string | null;
  duration: number;
  recordedAt: string;
  isSimulated?: boolean;
  storageKey?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface Contribution {
  id: string;
  clientId?: string;
  userId: string;
  wordId: string;
  wordName: string;
  category: string;
  takes: TakeData[];
  status: ContributionStatus;
  reviewStatus?: ReviewStatus;
  pointsEarned: number;
  isPriority: boolean;
  createdAt: string;
  submittedAt?: string;
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

// --- Backend API DTO Types ---

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface TakeOut {
  id: string;
  takeNumber: number;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number;
  recordedAt?: string;
  uploadStatus: string;
  width?: number;
  height?: number;
}

export interface UploadPresignedOut {
  url: string;
  method: string;
  headers: Record<string, string>;
  expiresIn: number;
}

export interface TakeCreateOut {
  take: TakeOut;
  upload: UploadPresignedOut;
}

export interface ContributionOut {
  id: string;
  clientId: string;
  userId: string;
  wordId: string;
  status: ContributionStatus;
  reviewStatus: ReviewStatus;
  pointsEarned: number;
  isPriority: boolean;
  takes: TakeOut[];
  createdAt?: string;
  submittedAt?: string;
  syncedAt?: string;
  errorMessage?: string;
}

export interface PaginatedContributionsOut {
  items: ContributionOut[];
  total: number;
  limit: number;
  offset: number;
}

export interface SignWordOut {
  id: string;
  word: string;
  category: string;
  urgency: 'alta' | 'media' | 'baja';
  description?: string;
  isPriority: boolean;
  basePoints: number;
  priorityBonus: number;
  targetVideos: number;
  currentVideos: number;
  status: WordStatus;
  createdByUserId?: string;
}

export interface PaginatedWordsOut {
  items: SignWordOut[];
  total: number;
  limit: number;
  offset: number;
}

export interface SyncTakeIn {
  takeNumber: number;
  storageKey?: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number;
  recordedAt?: string;
  checksum?: string;
  width?: number;
  height?: number;
}

export interface SyncItemIn {
  clientId: string;
  wordId: string;
  takes: SyncTakeIn[];
}

export interface SyncBatchIn {
  items: SyncItemIn[];
}

export interface SyncResultItemOut {
  clientId: string;
  status: 'completado' | 'duplicado' | 'error';
  contributionId?: string;
  pointsEarned?: number;
  error?: string;
}

export interface SyncBatchOut {
  results: SyncResultItemOut[];
}

export interface RankingOut {
  scope: 'weekly' | 'all_time';
  items: RankingUser[];
  currentUserRank?: number;
}
