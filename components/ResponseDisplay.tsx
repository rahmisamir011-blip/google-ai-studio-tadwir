import React from 'react';
import type { AiResponse, Category } from '../types';
import { getCategoryIcon } from './CategoryIcons';

type AccentColor = 'red' | 'emerald' | 'blue' | 'yellow' | 'sky' | 'orange' | 'slate';

const IdentificationCard: React.FC<{ itemName: string, icon: JSX.Element, accentColor: AccentColor }> = ({ itemName, icon, accentColor }) => {
    const accentClasses: Record<AccentColor, { border: string, iconBg: string, textStrong: string }> = {
        red: { border: 'border-red-500', iconBg: 'bg-red-500', textStrong: 'text-red-800' },
        emerald: { border: 'border-emerald-500', iconBg: 'bg-emerald-500', textStrong: 'text-emerald-800' },
        blue: { border: 'border-blue-500', iconBg: 'bg-blue-500', textStrong: 'text-blue-800' },
        yellow: { border: 'border-yellow-500', iconBg: 'bg-yellow-500', textStrong: 'text-yellow-800' },
        sky: { border: 'border-sky-500', iconBg: 'bg-sky-500', textStrong: 'text-sky-800' },
        orange: { border: 'border-orange-500', iconBg: 'bg-orange-500', textStrong: 'text-orange-800' },
        slate: { border: 'border-slate-500', iconBg: 'bg-slate-500', textStrong: 'text-slate-800' }
    };

    const colors = accentClasses[accentColor];

    return (
        <div className={`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 border-l-4 ${colors.border}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.iconBg}`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-sm text-gray-500">تم التعرف على:</h3>
                <p className={`font-bold text-xl ${colors.textStrong}`}>{itemName}</p>
            </div>
        </div>
    );
};


const InfoCard: React.FC<{ content: string; icon: JSX.Element, accentColor: AccentColor }> = ({ content, icon, accentColor }) => {
    const colorClasses: Record<AccentColor, string> = {
        red: 'bg-red-50 border-red-500',
        emerald: 'bg-emerald-50 border-emerald-500',
        blue: 'bg-blue-50 border-blue-500',
        yellow: 'bg-yellow-50 border-yellow-500',
        sky: 'bg-sky-50 border-sky-500',
        orange: 'bg-orange-50 border-orange-500',
        slate: 'bg-slate-100 border-slate-500'
    };
    const iconBgClasses: Record<AccentColor, string> = {
         red: 'bg-red-500',
         emerald: 'bg-emerald-500',
         blue: 'bg-blue-500',
         yellow: 'bg-yellow-500',
         sky: 'bg-sky-500',
         orange: 'bg-orange-500',
         slate: 'bg-slate-500'
    };

    return (
        <div className={`rounded-xl shadow-md p-4 flex items-start gap-4 border-l-4 ${colorClasses[accentColor]}`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBgClasses[accentColor]}`}>
                {icon}
            </div>
            <div className="flex-1 pt-1">
                <p className="text-gray-800 whitespace-pre-line">{content}</p>
            </div>
        </div>
    );
};


const Icons = {
    NotToDo: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Alternatives: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    WhereToBuy: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
};

const MotivationBox: React.FC<{ text: string, accentColor: AccentColor }> = ({ text, accentColor }) => {
    const gradientClasses: Record<AccentColor, string> = {
        red: 'from-red-500 to-rose-500',
        emerald: 'from-emerald-500 to-teal-500',
        blue: 'from-blue-500 to-indigo-500',
        yellow: 'from-yellow-500 to-amber-500',
        sky: 'from-sky-500 to-cyan-500',
        orange: 'from-orange-500 to-amber-500',
        slate: 'from-slate-500 to-slate-600',
    }

    return (
        <div className={`text-center bg-gradient-to-r ${gradientClasses[accentColor]} text-white rounded-xl shadow-lg p-5 font-semibold`}>
            <p>{text}</p>
        </div>
    );
};


export const ResponseDisplay: React.FC<{ response: AiResponse; }> = ({ response }) => {
  const category = response.category || 'general';
  const categoryIcon = getCategoryIcon(category);

  const getCategoryAccentColor = (cat: Category): AccentColor => {
      switch (cat) {
          case 'plastic': return 'sky';
          case 'paper': return 'orange';
          case 'glass': return 'emerald';
          case 'metal': return 'slate';
          case 'general':
          default:
              return 'emerald';
      }
  };

  const accentColor = getCategoryAccentColor(category);

  return (
    <div className="space-y-4 animate-fade-in">
        <IdentificationCard itemName={response.itemName} icon={categoryIcon} accentColor={accentColor} />
        <InfoCard content={response.notToDo} icon={Icons.NotToDo} accentColor="red" />
        <InfoCard content={response.toDo} icon={categoryIcon} accentColor={accentColor} />
        <InfoCard content={response.alternatives} icon={Icons.Alternatives} accentColor="blue" />
        <InfoCard content={response.whereToBuy} icon={Icons.WhereToBuy} accentColor="yellow" />
        <MotivationBox text={response.motivation} accentColor={accentColor} />
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