import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Mascot } from '../components/Mascot';
import { ImageUploader } from '../components/ImageUploader';
import { LibraryQuery } from '../components/LibraryQuery';
import { ResponseDisplay } from '../components/ResponseDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { signOutUser } from '../services/firebaseService';
import type { AiResponse } from '../types';
import { Tab } from '../types';
import { SuccessAnimation } from '../components/SuccessAnimation';

interface MainScreenProps {
    aiResponse: AiResponse | null;
    isLoading: boolean;
    error: string | null;
    setResponse: (response: AiResponse | null) => void;
    setSearchResponse: (response: AiResponse | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetState: () => void;
    initialSearchQuery: string | null;
    clearInitialSearchQuery: () => void;
    initialTab: Tab;
}

export const MainScreen: React.FC<MainScreenProps> = (props) => {
    const { 
        aiResponse, isLoading, error, 
        setResponse, setSearchResponse, setLoading, setError, resetState,
        initialSearchQuery, clearInitialSearchQuery, initialTab
    } = props;
  
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    
    useEffect(() => {
        // When the screen/mode changes, reset the state
        resetState();
    }, [initialTab]);
    
    useEffect(() => {
        if (aiResponse && !isLoading && !error) {
            setShowSuccessAnimation(true);
            const timer = setTimeout(() => {
                setShowSuccessAnimation(false);
            }, 1500); // Animation is ~1.2s, so we show it for 1.5s total.
            return () => clearTimeout(timer);
        }
    }, [aiResponse, isLoading, error]);

    const screenConfig = {
        [Tab.Camera]: {
            title: "الكاميرا الذكية",
            description: "التقط صورة لأي غرض، وسأخبرك بكيفية إعادة تدويره بالطريقة الصحيحة والمستدامة."
        },
        [Tab.Library]: {
            title: "مكتبة التدوير",
            description: "ابحث في مكتبتنا الشاملة عن معلومات حول إعادة تدوير أي مادة تخطر ببالك."
        }
    };

    const currentConfig = screenConfig[initialTab];


    return (
        <>
            <Header onSignOut={signOutUser} />
            {showSuccessAnimation && <SuccessAnimation />}
            <main className="container mx-auto p-4 md:p-6 max-w-2xl">
                <div className="text-center mb-6">
                    <div className="inline-block p-2 bg-white/60 rounded-full shadow-sm">
                        <Mascot />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-800 mt-4">{currentConfig.title}</h2>
                    <p className="text-gray-600">{currentConfig.description}</p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
                    <div>
                        {initialTab === Tab.Camera ? (
                            <ImageUploader setResponse={setResponse} setLoading={setLoading} setError={setError} />
                        ) : (
                            <LibraryQuery 
                                setResponse={setSearchResponse} 
                                setLoading={setLoading} 
                                setError={setError} 
                                initialQuery={initialSearchQuery}
                                onSearchComplete={clearInitialSearchQuery}
                            />
                        )}
                    </div>
                </div>

                {isLoading && <LoadingSpinner />}
                
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                        <p className="font-bold">حدث خطأ</p>
                        <p>{error}</p>
                    </div>
                )}

                {aiResponse && !isLoading && <ResponseDisplay response={aiResponse} />}

            </main>
        </>
    );
};