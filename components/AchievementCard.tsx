import React from 'react';
import type { Achievement } from '../data/achievements';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isUnlocked }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                <span className="text-3xl">{achievement.icon}</span>
            </div>
            <div className="flex-1">
                 <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">{achievement.title}</h3>
                    {isUnlocked && (
                        <div className="text-yellow-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <p className="text-gray-600">{achievement.description}</p>
            </div>
        </div>
    );
};