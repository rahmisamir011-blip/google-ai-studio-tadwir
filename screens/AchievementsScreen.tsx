import React from 'react';
import { AchievementCard } from '../components/AchievementCard';
import { Header } from '../components/Header';
import { achievementsList, Achievement } from '../data/achievements';
import { signOutUser } from '../services/firebaseService';

interface AchievementsScreenProps {
    unlockedIds: Set<string>;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ unlockedIds }) => {
    return (
        <>
        <Header onSignOut={signOutUser} />
        <div className="container mx-auto p-4 md:p-6 max-w-2xl animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-emerald-800">إنجازاتك</h1>
                <p className="text-gray-600 mt-1">تتبع تقدمك واحتفل بإنجازاتك البيئية. كل خطوة تقوم بها تحدث فرقاً!</p>
            </div>
            
            <div className="bg-emerald-50/50 p-4 rounded-2xl shadow-inner">
                <div className="space-y-5">
                    {achievementsList.map((achievement: Achievement) => (
                        <AchievementCard
                            key={achievement.id}
                            achievement={achievement}
                            isUnlocked={unlockedIds.has(achievement.id)}
                        />
                    ))}
                </div>
            </div>
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
        </>
    );
};