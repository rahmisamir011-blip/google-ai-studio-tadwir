import React from 'react';

type Screen = 'dashboard' | 'camera' | 'library' | 'achievements';

interface BottomNavProps {
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
    onVoiceClick: () => void;
}

const NavItem: React.FC<{ label: string; icon: JSX.Element; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-emerald-500' : 'text-gray-500 hover:text-emerald-500'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate, onVoiceClick }) => {
    const handleNavigationClick = (screen: Screen) => {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        onNavigate(screen);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.1)] grid grid-cols-5 items-center z-20">
            <NavItem 
                label="الرئيسية" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                isActive={activeScreen === 'dashboard'} 
                onClick={() => handleNavigationClick('dashboard')} 
            />
            <NavItem 
                label="الكاميرا" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                isActive={activeScreen === 'camera'}
                onClick={() => handleNavigationClick('camera')} 
            />
             <NavItem 
                label="المساعد الصوتي" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                isActive={false}
                onClick={onVoiceClick} 
            />
            <NavItem 
                label="الإنجازات" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                isActive={activeScreen === 'achievements'} 
                onClick={() => handleNavigationClick('achievements')} 
            />
            <NavItem 
                label="المكتبة" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
                isActive={activeScreen === 'library'}
                onClick={() => handleNavigationClick('library')} 
            />
        </nav>
    );
};