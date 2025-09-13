import React, { useState, useEffect } from 'react';
import { recyclingFacts } from '../data/recyclingFacts';

type Screen = 'dashboard' | 'camera' | 'library' | 'achievements';

interface DashboardScreenProps {
    onNavigate: (screen: Screen) => void;
    onVoiceClick: () => void;
    onSignOut: () => void;
}


const ActionPetal: React.FC<{ description: string; onClick: () => void; icon: JSX.Element; className?: string }> = ({ description, onClick, icon, className = '' }) => {
    return (
        <button 
            onClick={onClick} 
            className={`bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg text-right w-full h-full flex flex-col justify-center items-center hover:bg-white/90 transition-all transform hover:scale-105 ${className}`}
        >
            <div className="mb-2">{icon}</div>
            <p className="text-sm text-center text-gray-700 font-medium">{description}</p>
        </button>
    );
};


export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onVoiceClick, onSignOut }) => {
    const [fact, setFact] = useState<string>('');

    useEffect(() => {
      const randomIndex = Math.floor(Math.random() * recyclingFacts.length);
      setFact(recyclingFacts[randomIndex]);
    }, []);

    const iconClass = "h-8 w-8 text-emerald-600";

    return (
        <div className="container mx-auto p-4 max-w-2xl min-h-[95vh] flex flex-col animate-fade-in">
             {/* Custom Header Section */}
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl" role="img" aria-label="شعار إعادة التدوير">♻️</span>
                    <h1 className="text-lg font-bold text-emerald-800">معا من اجل بيئة نظيفة</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onSignOut}
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                        تسجيل الخروج
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center -mt-8">
                <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-12 w-[320px] h-[320px] md:w-[360px] md:h-[360px] relative">
                     {/* Central Circle */}
                    <div className="absolute w-36 h-36 md:w-40 md:h-40 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <h2 className="text-white text-4xl font-bold">تدوير</h2>
                    </div>
                    
                    {/* Petals */}
                    <ActionPetal 
                        description="صوري وأنا نقولك واش تديري"
                        onClick={() => onNavigate('camera')}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                    <ActionPetal 
                        description="أفتحي المايك وسقسيني"
                        onClick={onVoiceClick}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                    />
                     <ActionPetal 
                        description="كل خطوة هي إنجاز ليك"
                        onClick={() => onNavigate('achievements')}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    />
                    <ActionPetal 
                        description="تعرفي على التدوير والتلوث"
                        onClick={() => onNavigate('library')}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
                    />
                </div>

                <div className="w-full max-w-sm bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-4 mt-12 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        <h3 className="font-bold text-lg text-emerald-700">هل تعلم؟</h3>
                    </div>
                    <p className="text-gray-700 text-sm h-10 flex items-center justify-center">
                        {fact || '...'}
                    </p>
                </div>
            </main>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};