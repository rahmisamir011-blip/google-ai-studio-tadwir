import React, { useState, useEffect } from 'react';
import { AuthScreen } from './screens/AuthScreen';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { MainScreen } from './screens/MainScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { BottomNav } from './components/BottomNav';
import { LoadingSpinner } from './components/LoadingSpinner';
import { VoiceAssistant } from './components/VoiceAssistant';
import { VoiceResultModal } from './components/VoiceResultModal';
import { Toast } from './components/Toast';
import { useAuth } from './hooks/useAuth';
import { useAchievements } from './hooks/useAchievements';
import { doesUserProfileExist, signOutUser } from './services/firebaseService';
import { getLibraryInfo } from './services/geminiService';
import type { AiResponse } from './types';
import { Tab } from './types';

type Screen = 'dashboard' | 'camera' | 'library' | 'achievements';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  
  const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isVoiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string | null>(null);
  
  const [voiceSearchResult, setVoiceSearchResult] = useState<AiResponse | null>(null);
  const [isVoiceSearchLoading, setVoiceSearchLoading] = useState<boolean>(false);
  const [voiceSearchError, setVoiceSearchError] = useState<string | null>(null);


  const { unlockedAchievements, unlockAchievement, stats, incrementStat, toastMessage, setToastMessage, loading: statsLoading } = useAchievements();

  useEffect(() => {
    const checkProfile = async () => {
        if (user) {
            setCheckingProfile(true);
            const exists = await doesUserProfileExist(user.uid);
            setProfileExists(exists);
            setCheckingProfile(false);
        } else {
            setProfileExists(null);
            setCheckingProfile(false);
        }
    };
    checkProfile();
  }, [user]);

  const handleResponse = (response: AiResponse | null) => {
    setAiResponse(response);
    setError(null);
    if (response) {
      incrementStat('itemsScanned');
      unlockAchievement('rookieRecycler');
      if(stats.itemsScanned + 1 >= 5) unlockAchievement('seasonedScanner');
    }
  };
  
  const handleSearchResponse = (response: AiResponse | null) => {
    handleResponse(response);
     if (response) {
      incrementStat('searchesMade');
      unlockAchievement('curiousExplorer');
    }
  }

  const handleLoading = (loading: boolean) => setIsLoading(loading);
  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
    setAiResponse(null);
  };
  const resetMainState = () => {
    setAiResponse(null);
    setError(null);
    setIsLoading(false);
  };
  const handleNavigate = (screen: Screen) => {
    setActiveScreen(screen);
    if(screen !== 'camera' && screen !== 'library') {
      resetMainState();
    }
  };
  const handleProfileCreated = () => setProfileExists(true);
  
  const handleSearch = (query: string) => {
    setInitialSearchQuery(query);
    handleNavigate('library');
  };

  const handleVoiceSearch = async (query: string) => {
    setVoiceAssistantOpen(false);
    setVoiceSearchLoading(true);
    setVoiceSearchError(null);
    setVoiceSearchResult(null);
    try {
        const result = await getLibraryInfo(query);
        setVoiceSearchResult(result);
        incrementStat('searchesMade');
        unlockAchievement('curiousExplorer');
    } catch (err) {
        setVoiceSearchError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setVoiceSearchLoading(false);
    }
  };


  if (authLoading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50/50 via-teal-50/50 to-emerald-100/50">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!user) return <AuthScreen />;
  if (!profileExists) return <ProfileSetupScreen onProfileCreated={handleProfileCreated} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-teal-50/50 to-emerald-100/50 text-gray-800">
      <div className="pb-20"> {/* Padding at bottom for nav bar */}
        {activeScreen === 'dashboard' && 
            <DashboardScreen 
                onNavigate={handleNavigate}
                onVoiceClick={() => setVoiceAssistantOpen(true)}
                onSignOut={signOutUser}
            />}
        {(activeScreen === 'camera' || activeScreen === 'library') && (
            <MainScreen 
                aiResponse={aiResponse}
                isLoading={isLoading}
                error={error}
                setResponse={handleResponse}
                setSearchResponse={handleSearchResponse}
                setLoading={handleLoading}
                setError={handleError}
                resetState={resetMainState}
                initialSearchQuery={initialSearchQuery}
                clearInitialSearchQuery={() => setInitialSearchQuery(null)}
                initialTab={activeScreen === 'camera' ? Tab.Camera : Tab.Library}
            />
        )}
        {activeScreen === 'achievements' && <AchievementsScreen unlockedIds={unlockedAchievements} />}
      </div>

      <VoiceAssistant isOpen={isVoiceAssistantOpen} onClose={() => setVoiceAssistantOpen(false)} onResult={handleVoiceSearch} />
      <VoiceResultModal 
          response={voiceSearchResult}
          isLoading={isVoiceSearchLoading}
          error={voiceSearchError}
          onClose={() => {
              setVoiceSearchResult(null);
              setVoiceSearchError(null);
          }} 
      />
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} onVoiceClick={() => setVoiceAssistantOpen(true)} />
    </div>
  );
};

export default App;