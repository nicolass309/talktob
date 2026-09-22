import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  SignWord,
  Contribution,
  TakeData,
  Challenge,
  AppScreen,
  CommunityProgress,
  ContributionStatus,
  SyncTakeIn
} from '../types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_COMMUNITY_PROGRESS
} from '../services/mockDataService';
import { storageService } from '../services/storageService';
import { ApiError } from '../services/apiClient';
import { wordsService } from '../services/wordsService';
import { contributionsService } from '../services/contributionsService';
import { gamificationService } from '../services/gamificationService';

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
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;

  // Catalogue & Words
  words: SignWord[];
  activeWord: SignWord | null;
  setActiveWord: (word: SignWord | null) => void;
  startContributionForWord: (word: SignWord) => void;
  addNewWord: (word: string, category: string, description: string) => Promise<SignWord>;
  refreshWords: () => Promise<void>;

  // Contribution & 3 Takes Flow
  currentTakes: TakeData[];
  currentTakeIndex: 1 | 2 | 3;
  setCurrentTakeIndex: (idx: 1 | 2 | 3) => void;
  saveTakeData: (takeNumber: 1 | 2 | 3, blob: Blob, videoUrl: string, duration: number) => void;
  retakeSingleTake: (takeNumber: 1 | 2 | 3) => void;
  submitThreeTakes: () => Promise<{ success: boolean; offline: boolean; error?: string }>;
  contributionStatus: ContributionStatus;
  uploadProgress: number;

  // Gamification & Celebration
  communityProgress: CommunityProgress;
  challenges: Challenge[];
  celebration: CelebrationPayload | null;
  closeCelebration: () => void;
  refreshGamificationData: () => Promise<void>;

  // Offline & Synchronization
  isOnline: boolean;
  toggleNetworkSimulation: () => void;
  offlineQueue: Contribution[];
  syncOfflineQueue: () => Promise<void>;
  pastContributions: Contribution[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = storageService.getUserProfile();
    return saved || INITIAL_USER_PROFILE;
  });

  // Current Screen State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const saved = storageService.getUserProfile();
    return saved && saved.isOnboarded ? 'home' : 'landing';
  });

  // Domain Data States
  const [words, setWords] = useState<SignWord[]>([]);
  const [activeWord, setActiveWord] = useState<SignWord | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
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

  // Celebration State
  const [celebration, setCelebration] = useState<CelebrationPayload | null>(null);

  // Offline & Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<Contribution[]>([]);
  const [pastContributions, setPastContributions] = useState<Contribution[]>([]);

  // Function to load all backend data (Words, Challenges, Community Progress, Profile, User Contributions)
  const refreshBackendData = useCallback(async () => {
    // 1. Fetch Words
    try {
      const resWords = await wordsService.getWords({ limit: 100 });
      const signWords: SignWord[] = resWords.items.map((w) => ({
        id: w.id,
        word: w.word,
        category: w.category,
        urgency: w.urgency,
        currentVideos: w.currentVideos,
        targetVideos: w.targetVideos,
        description: w.description || '',
        isPriority: w.isPriority,
        basePoints: w.basePoints,
        priorityBonus: w.priorityBonus,
        status: w.status,
        createdByUserId: w.createdByUserId,
      }));
      setWords(signWords);
      if (signWords.length > 0) {
        setActiveWord((prev) => {
          if (!prev) return signWords[0];
          const found = signWords.find((sw) => sw.id === prev.id);
          return found || signWords[0];
        });
      }
    } catch (e) {
      console.warn('Could not fetch words from backend:', e);
    }

    // 2. Fetch Community Progress
    try {
      const prog = await gamificationService.getCommunityProgress();
      setCommunityProgress(prog);
    } catch (e) {
      console.warn('Could not fetch community progress:', e);
    }

    // 3. Fetch Challenges if authenticated
    try {
      const chals = await gamificationService.getChallenges();
      setChallenges(chals);
    } catch (e) {
      console.warn('Could not fetch challenges:', e);
    }

    // 4. Fetch Profile (/me) if authenticated
    try {
      const meProfile = await gamificationService.getMe();
      const updatedProfile: UserProfile = {
        id: meProfile.id,
        clerkUserId: meProfile.clerkUserId,
        name: meProfile.name || 'Contribuidor',
        email: meProfile.email || 'usuario@talktob.cl',
        avatar: meProfile.avatar || INITIAL_USER_PROFILE.avatar,
        regionZone: meProfile.regionZone || 'Centro',
        specificRegion: meProfile.specificRegion || 'Metropolitana de Santiago',
        learningOrigin: meProfile.learningOrigin || 'Asociación',
        relationWithLSCH: meProfile.relationWithLSCH || 'Persona sorda',
        points: meProfile.points,
        contributionsCount: meProfile.contributionsCount,
        videosCount: meProfile.videosCount,
        wordsCount: meProfile.wordsCount,
        level: meProfile.level,
        badges: meProfile.badges || [],
        isOnboarded: meProfile.isOnboarded,
        role: meProfile.role,
      };
      setUserProfile(updatedProfile);
      storageService.saveUserProfile(updatedProfile);
    } catch (e) {
      console.warn('Could not fetch /me profile:', e);
    }

    // 5. Fetch User Contributions History
    try {
      const userContribsRes = await contributionsService.getUserContributions({ limit: 50 });
      const mappedContribs: Contribution[] = userContribsRes.items.map((c) => ({
        id: c.id,
        clientId: c.clientId,
        userId: c.userId,
        wordId: c.wordId,
        wordName: c.wordId, // Will be resolved or matched
        category: 'LSCH',
        takes: c.takes.map((t) => ({
          takeNumber: t.takeNumber as 1 | 2 | 3,
          blob: null,
          videoUrl: null,
          duration: t.durationMs / 1000,
          recordedAt: t.recordedAt || '',
          storageKey: t.storageKey,
          mimeType: t.mimeType,
          sizeBytes: t.sizeBytes,
        })),
        status: c.status,
        reviewStatus: c.reviewStatus,
        pointsEarned: c.pointsEarned,
        isPriority: c.isPriority,
        createdAt: c.createdAt || new Date().toISOString(),
        submittedAt: c.submittedAt,
        syncedAt: c.syncedAt,
        errorMessage: c.errorMessage,
      }));
      setPastContributions(mappedContribs);
    } catch (e) {
      console.warn('Could not fetch user contributions history:', e);
    }
  }, []);

  // Load initial backend data & setup listeners
  useEffect(() => {
    refreshBackendData();

    const loadLocalQueue = async () => {
      const queue = await storageService.getOfflineQueue();
      setOfflineQueue(queue);
    };
    loadLocalQueue();

    const handleOnline = () => {
      setIsOnline(true);
      refreshBackendData();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshBackendData]);

  const toggleNetworkSimulation = () => {
    setIsOnline((prev) => !prev);
  };

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    try {
      const updatedBackend = await gamificationService.updateMe({
        name: data.name,
        regionZone: data.regionZone,
        specificRegion: data.specificRegion,
        learningOrigin: data.learningOrigin,
        relationWithLSCH: data.relationWithLSCH,
        isOnboarded: data.isOnboarded,
      });

      setUserProfile((prev) => {
        const updated: UserProfile = { ...prev, ...updatedBackend };
        storageService.saveUserProfile(updated);
        return updated;
      });
    } catch (e) {
      console.warn('Local update fallback for user profile:', e);
      setUserProfile((prev) => {
        const updated = { ...prev, ...data };
        storageService.saveUserProfile(updated);
        return updated;
      });
    }
  }, []);

  const completeOnboarding = useCallback(async (data: Partial<UserProfile>) => {
    try {
      const updatedBackend = await gamificationService.updateMe({
        name: data.name,
        regionZone: data.regionZone,
        specificRegion: data.specificRegion,
        learningOrigin: data.learningOrigin,
        relationWithLSCH: data.relationWithLSCH,
        isOnboarded: true,
      });

      setUserProfile((prev) => {
        const updated: UserProfile = { ...prev, ...updatedBackend, isOnboarded: true };
        storageService.saveUserProfile(updated);
        return updated;
      });
    } catch (e) {
      console.warn('Fallback completeOnboarding locally:', e);
      setUserProfile((prev) => {
        const updated: UserProfile = { ...prev, ...data, isOnboarded: true };
        storageService.saveUserProfile(updated);
        return updated;
      });
    }
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
    try {
      const newWordOut = await wordsService.createWord({
        word: wordName,
        category: category || 'Comunidad LSCH',
        description: description || 'Palabra propuesta por la comunidad LSCH.',
        urgency: 'alta'
      });

      const newSignWord: SignWord = {
        id: newWordOut.id,
        word: newWordOut.word,
        category: newWordOut.category,
        urgency: newWordOut.urgency,
        currentVideos: newWordOut.currentVideos,
        targetVideos: newWordOut.targetVideos,
        description: newWordOut.description || '',
        isPriority: newWordOut.isPriority,
        basePoints: newWordOut.basePoints,
        priorityBonus: newWordOut.priorityBonus,
        status: newWordOut.status,
        createdByUserId: newWordOut.createdByUserId,
      };

      setWords((prev) => [newSignWord, ...prev]);
      return newSignWord;
    } catch (e) {
      console.warn('Fallback creating word locally if API fails:', e);
      const fallbackWord: SignWord = {
        id: `word_${Date.now()}`,
        word: wordName.toUpperCase().trim(),
        category: category || 'Comunidad LSCH',
        urgency: 'alta',
        currentVideos: 0,
        targetVideos: 30,
        description: description || 'Palabra agregada localmente.',
        isPriority: true,
        basePoints: 30,
        priorityBonus: 15
      };
      await storageService.saveCustomWord(fallbackWord);
      setWords((prev) => [fallbackWord, ...prev]);
      return fallbackWord;
    }
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    const queue = await storageService.getOfflineQueue();
    if (queue.length === 0) return;

    const syncItems = queue.map((item) => {
      const syncTakes: SyncTakeIn[] = item.takes.map((t) => ({
        takeNumber: t.takeNumber,
        mimeType: t.blob?.type || 'video/webm',
        sizeBytes: t.blob?.size || 100000,
        durationMs: Math.round((t.duration || 4.5) * 1000),
        recordedAt: t.recordedAt || new Date().toISOString(),
      }));

      return {
        clientId: item.clientId || item.id,
        wordId: item.wordId,
        takes: syncTakes,
      };
    });

    try {
      const res = await contributionsService.syncOfflineQueue({ items: syncItems });

      for (const result of res.results) {
        if (result.status === 'completado' || result.status === 'duplicado') {
          const match = queue.find((q) => (q.clientId || q.id) === result.clientId);
          if (match) {
            match.status = 'completado';
            match.syncedAt = new Date().toISOString();
            await storageService.saveContribution(match);
            await storageService.removeFromOfflineQueue(match.id);
          }
        }
      }

      setOfflineQueue([]);
      refreshBackendData();
    } catch (e) {
      console.error('Error flushing offline queue to backend:', e);
    }
  }, [refreshBackendData]);

  // 3-Takes Real Upload Flow
  const submitThreeTakes = useCallback(async (): Promise<{ success: boolean; offline: boolean; error?: string }> => {
    if (!activeWord) return { success: false, offline: false, error: 'Sin seña activa' };

    const pointsBase = activeWord.basePoints || 30;
    const pointsPriority = activeWord.isPriority ? (activeWord.priorityBonus || 15) : 0;
    const totalEarned = pointsBase + pointsPriority;
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newContribution: Contribution = {
      id: `contrib_${Date.now()}`,
      clientId,
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

    // Handle OFFLINE flow
    if (!isOnline || !navigator.onLine) {
      await storageService.addToOfflineQueue(newContribution);
      setOfflineQueue((prev) => [newContribution, ...prev]);
      setPastContributions((prev) => [newContribution, ...prev]);

      const newPoints = userProfile.points + totalEarned;
      setUserProfile((prev) => ({
        ...prev,
        points: newPoints,
        contributionsCount: prev.contributionsCount + 1,
        videosCount: prev.videosCount + 3,
        wordsCount: prev.wordsCount + 1
      }));

      setCelebration({
        pointsEarned: totalEarned,
        wordName: activeWord.word,
        totalPoints: newPoints,
        isPriority: activeWord.isPriority
      });

      return { success: true, offline: true };
    }

    // REAL ONLINE UPLOAD FLOW
    setUploadProgress(5);
    try {
      // 1. Create Contribution on Backend (Idempotent by clientId)
      const contribOut = await contributionsService.createContribution({
        clientId,
        wordId: activeWord.id,
      });

      let totalBytes = currentTakes.reduce((acc, t) => acc + (t.blob?.size || 0), 0);
      if (totalBytes === 0) totalBytes = 1;
      const loadedBytesArr = [0, 0, 0];

      const updateProgress = () => {
        const totalLoaded = loadedBytesArr.reduce((a, b) => a + b, 0);
        const pct = Math.min(85, Math.round(10 + (totalLoaded / totalBytes) * 75));
        setUploadProgress(pct);
      };

      // 2. Upload each of the 3 takes to presigned URLs with XHR upload progress
      for (let i = 1; i <= 3; i++) {
        const takeData = currentTakes[i - 1];
        if (!takeData.blob) {
          throw new Error(`Falta el archivo de la toma ${i}`);
        }

        const mimeType = takeData.blob.type || 'video/webm';
        const sizeBytes = takeData.blob.size;
        const durationMs = Math.round((takeData.duration || 4.5) * 1000);
        const recordedAt = takeData.recordedAt || new Date().toISOString();

        // 2a. Request Presigned Upload URL
        const presignedRes = await contributionsService.requestTakeUpload(contribOut.id, {
          takeNumber: i as 1 | 2 | 3,
          mimeType,
          sizeBytes,
          durationMs,
          recordedAt,
        });

        // 2b. PUT Blob to Presigned URL
        await contributionsService.uploadTakeBlob(
          presignedRes.upload.url,
          takeData.blob,
          mimeType,
          (loaded) => {
            loadedBytesArr[i - 1] = loaded;
            updateProgress();
          }
        );

        // 2c. Complete Take Verification
        await contributionsService.completeTake(contribOut.id, i);
      }

      // 3. Submit Contribution
      setUploadProgress(90);
      setContributionStatus('procesando');
      const submittedOut = await contributionsService.submitContribution(contribOut.id);
      setUploadProgress(100);

      // 4. Update UI State & History
      newContribution.id = submittedOut.id;
      newContribution.status = submittedOut.status;
      newContribution.reviewStatus = submittedOut.reviewStatus;
      newContribution.syncedAt = new Date().toISOString();

      await storageService.saveContribution(newContribution);
      setPastContributions((prev) => [newContribution, ...prev]);

      // Refresh backend profile & gamification metrics
      await refreshBackendData();

      setCelebration({
        pointsEarned: submittedOut.pointsEarned || totalEarned,
        wordName: activeWord.word,
        totalPoints: userProfile.points + (submittedOut.pointsEarned || totalEarned),
        isPriority: activeWord.isPriority
      });

      return { success: true, offline: false };
    } catch (err: any) {
      console.error('Error uploading contribution to backend:', err);

      if (err instanceof ApiError && err.status === 409) {
        // Handle 409 conflict / size mismatch
        setContributionStatus('error');
        setUploadProgress(0);
        return { success: false, offline: false, error: err.message };
      }

      // If network failure occurs, fallback to offline queue
      console.warn('Network error during upload, fallback to offline queue.');
      await storageService.addToOfflineQueue(newContribution);
      setOfflineQueue((prev) => [newContribution, ...prev]);
      setPastContributions((prev) => [newContribution, ...prev]);

      return { success: true, offline: true };
    }
  }, [activeWord, currentTakes, isOnline, userProfile, refreshBackendData]);

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
        refreshWords: refreshBackendData,
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
        refreshGamificationData: refreshBackendData,
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
