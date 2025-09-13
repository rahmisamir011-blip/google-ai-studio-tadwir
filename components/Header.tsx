import React from 'react';

interface HeaderProps {
    onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
  return (
    <header className="bg-white/60 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 max-w-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
            <span className="text-4xl" role="img" aria-label="شعار إعادة التدوير">♻️</span>
            <h1 className="text-2xl font-bold text-emerald-800">تدوير</h1>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={onSignOut}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
                تسجيل الخروج
            </button>
        </div>
      </div>
    </header>
  );
};