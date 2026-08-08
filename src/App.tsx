import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { CapturePage } from './pages/CapturePage';
import { ProfilePage } from './pages/ProfilePage';
import { RankingPage } from './pages/RankingPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { CelebrationModal } from './components/gamification/CelebrationModal';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    setScreen,
    celebration,
    closeCelebration,
    words,
    startContributionForWord
  } = useApp();

  const handleMakeAnotherFromCelebration = () => {
    closeCelebration();
    const nextPriority = words.find((w) => w.isPriority && w.currentVideos < w.targetVideos) || words[0];
    if (nextPriority) {
      startContributionForWord(nextPriority);
    } else {
      setScreen('capture');
    }
  };

  const handleViewProgressFromCelebration = () => {
    closeCelebration();
    setScreen('profile');
  };

  const showHeader = currentScreen !== 'capture';
  const showBottomNav = ['home', 'profile', 'ranking', 'challenges'].includes(currentScreen);

  return (
    <div className="app-viewport">
      {showHeader && <Header />}

      <main className="main-content-area">
        {currentScreen === 'landing' && <LandingPage />}
        {currentScreen === 'onboarding' && <OnboardingPage />}
        {currentScreen === 'home' && <HomePage />}
        {currentScreen === 'capture' && <CapturePage />}
        {currentScreen === 'profile' && <ProfilePage />}
        {currentScreen === 'ranking' && <RankingPage />}
        {currentScreen === 'challenges' && <ChallengesPage />}
      </main>

      {showBottomNav && <BottomNav />}

      {/* Global Celebration Modal */}
      {celebration && (
        <CelebrationModal
          pointsEarned={celebration.pointsEarned}
          wordName={celebration.wordName}
          totalPoints={celebration.totalPoints}
          isPriority={celebration.isPriority}
          onMakeAnother={handleMakeAnotherFromCelebration}
          onViewProgress={handleViewProgressFromCelebration}
        />
      )}

      <style>{`
        .main-content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
