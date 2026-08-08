import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  SignWord,
  Contribution,
  TakeData,
  Challenge,
  AppScreen,
  CommunityProgress,
  ContributionStatus
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_SIGN_WORDS,
  INITIAL_CHALLENGES,
  INITIAL_COMMUNITY_PROGRESS
} from '../services/mockDataService';
import { storageService } from '../services/storageService';
import { useUser } from '@clerk/clerk-react';

interface CelebrationPayload {
  pointsEarned: number;
  wordName: string;
  totalPoints: number;
  isPriority: boolean;
  challengeBonus?: number;
}

interface AppContextType {
  // Navigation & Screen State
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;

  // Catalogue & Words
  words: SignWord[];
  activeWord: SignWord | null;
  setActiveWord: (word: SignWord | null) => void;
  startContributionForWord: (word: SignWord) => void;
  addNewWord: (word: string, category: string, description: string) => Promise<SignWord>;

  // Contribution & 3 Takes Flow
  currentTakes: TakeData[];
  currentTakeIndex: 1 | 2 | 3;
  setCurrentTakeIndex: (idx: 1 | 2 | 3) => void;
  saveTakeData: (takeNumber: 1 | 2 | 3, blob: Blob, videoUrl: string, duration: number) => void;
  retakeSingleTake: (takeNumber: 1 | 2 | 3) => void;
  submitThreeTakes: () => Promise<{ success: boolean; offline: boolean }>;
  contributionStatus: ContributionStatus;
  uploadProgress: number;

  // Gamification & Celebration
  communityProgress: CommunityProgress;
  challenges: Challenge[];
  celebration: CelebrationPayload | null;
  closeCelebration: () => void;

  // Offline & Synchronization
  isOnline: boolean;
  toggleNetworkSimulation: () => void;
  offlineQueue: Contribution[];
  syncOfflineQueue: () => Promise<void>;
  pastContributions: Contribution[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isSignedIn } = useUser();

  // Initialize Profile from storage or initial data
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = storageService.getUserProfile();
    return saved || INITIAL_USER_PROFILE;
  });

  // Ensure first-time users land on onboarding
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const saved = storageService.getUserProfile();
    return saved && saved.isOnboarded ? 'home' : 'landing';
  });

  const [words, setWords] = useState<SignWord[]>(INITIAL_SIGN_WORDS);
  const [activeWord, setActiveWord] = useState<SignWord | null>(INITIAL_SIGN_WORDS[0]);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [communityProgress, setCommunityProgress] = useState<CommunityProgress>(INITIAL_COMMUNITY_PROGRESS);

  // 3-Takes Contribution State
  const [currentTakes, setCurrentTakes] = useState<TakeData[]>([
    { takeNumber: 1, blob: null, videoUrl: null, duration: 0, recordedAt: '' },
    { takeNumber: 2, blob: null, videoUrl: null, duration: 0, recordedAt: '' },
    { takeNumber: 3, blob: null, videoUrl: null, duration: 0, recordedAt: '' }
  ]);
  const [currentTakeIndex, setCurrentTakeIndex] = useState<1 | 2 | 3>(1);
  const [contributionStatus, setContributionStatus] = useState<ContributionStatus>('pendiente');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Celebration state
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);

  // Offline & Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<Contribution[]>([]);
  const [pastContributions, setPastContributions] = useState<Contribution[]>([]);

  // Sync Clerk profile when signed in
  useEffect(() => {
    if (isSignedIn && user) {
      setUserProfile((prev) => {
        const updated = {
          ...prev,
          name: user.fullName || user.firstName || prev.name,
          email: user.primaryEmailAddress?.emailAddress || prev.email,
          avatar: user.imageUrl || prev.avatar
        };
        storageService.saveUserProfile(updated);
        return updated;
      });
    }
  }, [isSignedIn, user]);

  // Load custom words and offline queue on mount
  useEffect(() => {
    const loadInitialStorage = async () => {
      const customWords = await storageService.getCustomWords();
      if (customWords.length > 0) {
        setWords((prev) => [...customWords, ...prev]);
      }
      const queue = await storageService.getOfflineQueue();
      setOfflineQueue(queue);
      const history = await storageService.getContributions();
      setPastContributions(history);
    };

    loadInitialStorage();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleNetworkSimulation = () => {
    setIsOnline((prev) => !prev);
  };

  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...data };
      storageService.saveUserProfile(updated);
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback((data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        ...data,
        isOnboarded: true
      };
      storageService.saveUserProfile(updated);
      return updated;
    });
    setCurrentScreen('home');
  }, []);

  const startContributionForWord = useCallback((word: SignWord) => {
    setActiveWord(word);
    setCurrentTakes([
      { takeNumber: 1, blob: null, videoUrl: null, duration: 0, recordedAt: '' },
      { takeNumber: 2, blob: null, videoUrl: null, duration: 0, recordedAt: '' },
      { takeNumber: 3, blob: null, videoUrl: null, duration: 0, recordedAt: '' }
    ]);
    setCurrentTakeIndex(1);
    setContributionStatus('grabando');
    setCurrentScreen('capture');
  }, []);

  const saveTakeData = useCallback((takeNumber: 1 | 2 | 3, blob: Blob, videoUrl: string, duration: number) => {
    setCurrentTakes((prev) => {
      const newTakes = [...prev];
      newTakes[takeNumber - 1] = {
        takeNumber,
        blob,
        videoUrl,
        duration,
        recordedAt: new Date().toISOString()
      };
      return newTakes;
    });
  }, []);

  const retakeSingleTake = useCallback((takeNumber: 1 | 2 | 3) => {
    setCurrentTakeIndex(takeNumber);
    setCurrentScreen('capture');
  }, []);

  const addNewWord = useCallback(async (wordName: string, category: string, description: string): Promise<SignWord> => {
    const newWordItem: SignWord = {
      id: `word_${Date.now()}`,
      word: wordName.toUpperCase().trim(),
      category: category || 'Comunidad LSCH',
      urgency: 'alta',
      currentVideos: 0,
      targetVideos: 30,
      description: description || 'Palabra agregada por la comunidad para expandir el dataset.',
      isPriority: true,
      basePoints: 30,
      priorityBonus: 15
    };

    await storageService.saveCustomWord(newWordItem);
    setWords((prev) => [newWordItem, ...prev]);
    return newWordItem;
  }, []);

  const submitThreeTakes = useCallback(async (): Promise<{ success: boolean; offline: boolean }> => {
    if (!activeWord) return { success: false, offline: false };

    const pointsBase = activeWord.basePoints || 30;
    const pointsPriority = activeWord.isPriority ? (activeWord.priorityBonus || 15) : 0;
    const totalEarned = pointsBase + pointsPriority;

    const newContribution: Contribution = {
      id: `contrib_${Date.now()}`,
      userId: userProfile.id,
      wordId: activeWord.id,
      wordName: activeWord.word,
      category: activeWord.category,
      takes: currentTakes,
      status: isOnline ? 'subiendo' : 'guardado_localmente',
      pointsEarned: totalEarned,
      isPriority: activeWord.isPriority,
      createdAt: new Date().toISOString()
    };

    setContributionStatus(isOnline ? 'subiendo' : 'guardado_localmente');

    if (!isOnline) {
      await storageService.addToOfflineQueue(newContribution);
      setOfflineQueue((prev) => [newContribution, ...prev]);
      setPastContributions((prev) => [newContribution, ...prev]);

      const newPoints = userProfile.points + totalEarned;
      updateUserProfile({
        points: newPoints,
        contributionsCount: userProfile.contributionsCount + 1,
        videosCount: userProfile.videosCount + 3,
        wordsCount: userProfile.wordsCount + 1
      });

      setCelebration({
        pointsEarned: totalEarned,
        wordName: activeWord.word,
        totalPoints: newPoints,
        isPriority: activeWord.isPriority
      });

      return { success: true, offline: true };
    }

    setUploadProgress(15);
    await new Promise((r) => setTimeout(r, 400));
    setUploadProgress(50);
    await new Promise((r) => setTimeout(r, 450));
    setUploadProgress(85);
    await new Promise((r) => setTimeout(r, 350));
    setUploadProgress(100);

    newContribution.status = 'completado';
    newContribution.syncedAt = new Date().toISOString();

    await storageService.saveContribution(newContribution);
    setPastContributions((prev) => [newContribution, ...prev]);

    setCommunityProgress((prev) => ({
      ...prev,
      totalContributions: prev.totalContributions + 3
    }));

    setWords((prev) =>
      prev.map((w) => (w.id === activeWord.id ? { ...w, currentVideos: w.currentVideos + 3 } : w))
    );

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.requiredWords.includes(activeWord.word) && !ch.isCompleted) {
          const nextCount = ch.currentCount + 1;
          return {
            ...ch,
            currentCount: nextCount,
            isCompleted: nextCount >= ch.targetCount
          };
        }
        return ch;
      })
    );

    const newPoints = userProfile.points + totalEarned;
    updateUserProfile({
      points: newPoints,
      contributionsCount: userProfile.contributionsCount + 1,
      videosCount: userProfile.videosCount + 3,
      wordsCount: userProfile.wordsCount + 1
    });

    setCelebration({
      pointsEarned: totalEarned,
      wordName: activeWord.word,
      totalPoints: newPoints,
      isPriority: activeWord.isPriority
    });

    return { success: true, offline: false };
  }, [activeWord, currentTakes, isOnline, userProfile, updateUserProfile]);

  const syncOfflineQueue = useCallback(async () => {
    const queue = await storageService.getOfflineQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      item.status = 'completado';
      item.syncedAt = new Date().toISOString();
      await storageService.saveContribution(item);
      await storageService.removeFromOfflineQueue(item.id);
    }

    setOfflineQueue([]);
    const updatedHistory = await storageService.getContributions();
    setPastContributions(updatedHistory);
  }, []);

  const closeCelebration = () => {
    setCelebration(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setScreen: setCurrentScreen,
        userProfile,
        updateUserProfile,
        completeOnboarding,
        words,
        activeWord,
        setActiveWord,
        startContributionForWord,
        addNewWord,
        currentTakes,
        currentTakeIndex,
        setCurrentTakeIndex,
        saveTakeData,
        retakeSingleTake,
        submitThreeTakes,
        contributionStatus,
        uploadProgress,
        communityProgress,
        challenges,
        celebration,
        closeCelebration,
        isOnline,
        toggleNetworkSimulation,
        offlineQueue,
        syncOfflineQueue,
        pastContributions
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
