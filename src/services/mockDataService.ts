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
  totalContributions: 14280,
  targetContributions: 50000,
  activeContributors: 1650,
  validatedHours: 380
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
  isOnboarded: false // Force first-time onboarding flow if not saved!
};

export const INITIAL_SIGN_WORDS: SignWord[] = [
  {
    id: 'word_hospital',
    word: 'HOSPITAL',
    category: 'Emergencias y Salud',
    urgency: 'alta',
    currentVideos: 7,
    targetVideos: 30,
    description: 'Palabra crítica para la atención en recintos de salud pública y privada.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_emergencia',
    word: 'EMERGENCIA',
    category: 'Emergencias y Salud',
    urgency: 'alta',
    currentVideos: 4,
    targetVideos: 30,
    description: 'Seña de auxilio inmediata para llamadas de rescate y urgencias.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_bomberos',
    word: 'BOMBEROS',
    category: 'Emergencias y Seguridad',
    urgency: 'alta',
    currentVideos: 5,
    targetVideos: 30,
    description: 'Seña clave para reportar incendios y rescates urbanos.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_policia',
    word: 'POLICÍA / CARABINEROS',
    category: 'Emergencias y Seguridad',
    urgency: 'alta',
    currentVideos: 6,
    targetVideos: 30,
    description: 'Seña de asistencia en seguridad ciudadana y emergencias policiales.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_medico',
    word: 'MÉDICO',
    category: 'Emergencias y Salud',
    urgency: 'alta',
    currentVideos: 9,
    targetVideos: 30,
    description: 'Identificación de profesionales de la salud en atención médica.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_temblor',
    word: 'TEMBLOR / TERREMOTO',
    category: 'Emergencias y Naturaleza',
    urgency: 'alta',
    currentVideos: 8,
    targetVideos: 30,
    description: 'Seña de alerta sísmica esencial en el contexto nacional chileno.',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_ambulancia',
    word: 'AMBULANCIA',
    category: 'Emergencias y Salud',
    urgency: 'alta',
    currentVideos: 3,
    targetVideos: 30,
    description: 'Solicitud de transporte médico de urgencia en red pública de salud (SAMU).',
    isPriority: true,
    basePoints: 30,
    priorityBonus: 15
  },
  {
    id: 'word_gracias',
    word: 'GRACIAS',
    category: 'Cotidiano y Cortesía',
    urgency: 'media',
    currentVideos: 14,
    targetVideos: 30,
    description: 'Expresión fundamental de interacción y educación cotidiana.',
    isPriority: false,
    basePoints: 30,
    priorityBonus: 0
  },
  {
    id: 'word_familia',
    word: 'FAMILIA',
    category: 'Relaciones y Personas',
    urgency: 'media',
    currentVideos: 18,
    targetVideos: 30,
    description: 'Seña de uso frecuente en el contexto social y personal.',
    isPriority: false,
    basePoints: 30,
    priorityBonus: 0
  },
  {
    id: 'word_chile',
    word: 'CHILE',
    category: 'Geografía y Lugares',
    urgency: 'baja',
    currentVideos: 28,
    targetVideos: 30,
    description: 'Identificación del país en conversaciones y contexto nacional.',
    isPriority: false,
    basePoints: 30,
    priorityBonus: 0
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chal_emergencias',
    title: 'Desafío: Emergencias y Salud',
    description: 'Graba 5 señas prioritarias para la red de asistencia y urgencias en Chile.',
    category: 'Salud y Seguridad',
    targetCount: 5,
    currentCount: 2,
    bonusPoints: 100,
    icon: 'ShieldAlert',
    requiredWords: ['HOSPITAL', 'EMERGENCIA', 'AYUDA', 'MÉDICO', 'POLICÍA / CARABINEROS'],
    isCompleted: false
  },
  {
    id: 'chal_cotidiano',
    title: 'Desafío: Vocabulario Cotidiano',
    description: 'Aporta 4 señas de uso frecuente en conversaciones diarias de la comunidad.',
    category: 'Cotidiano',
    targetCount: 4,
    currentCount: 3,
    bonusPoints: 80,
    icon: 'MessageSquare',
    requiredWords: ['GRACIAS', 'FAMILIA', 'ESCUELA', 'CHILE'],
    isCompleted: false
  },
  {
    id: 'chal_sismico',
    title: 'Desafío: Prevención y Desastres',
    description: 'Señas vinculadas a alertas sísmicas y emergencias naturales.',
    category: 'Naturaleza',
    targetCount: 3,
    currentCount: 1,
    bonusPoints: 60,
    icon: 'Activity',
    requiredWords: ['TEMBLOR / TERREMOTO', 'BOMBEROS', 'AMBULANCIA'],
    isCompleted: false
  }
];

export const RANKING_WEEKLY: RankingUser[] = [
  {
    rank: 1,
    name: 'Camila Sepúlveda',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    region: 'Valparaíso',
    points: 2450,
    videos: 162,
    contributions: 54,
    badge: 'Oro Semanal'
  },
  {
    rank: 2,
    name: 'Matías Araneda',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    region: 'Biobío',
    points: 1980,
    videos: 132,
    contributions: 44,
    badge: 'Plata'
  },
  {
    rank: 3,
    name: 'Francisca Valenzuela',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    region: 'Metropolitana de Santiago',
    points: 1650,
    videos: 110,
    contributions: 36,
    badge: 'Bronce'
  },
  {
    rank: 4,
    name: 'Rodrigo Morales',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    region: 'Araucanía',
    points: 1420,
    videos: 94,
    contributions: 31,
    badge: 'Destacado'
  }
];

export const RANKING_ALL_TIME: RankingUser[] = [
  {
    rank: 1,
    name: 'Daniela Castro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    region: 'Metropolitana de Santiago',
    points: 8940,
    videos: 596,
    contributions: 198,
    badge: 'Leyenda LSCH'
  },
  {
    rank: 2,
    name: 'Camila Sepúlveda',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    region: 'Valparaíso',
    points: 7320,
    videos: 488,
    contributions: 162,
    badge: 'Maestro'
  },
  {
    rank: 3,
    name: 'Pablo Henríquez',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    region: 'Los Lagos',
    points: 6150,
    videos: 410,
    contributions: 136,
    badge: 'Pionero'
  }
];
