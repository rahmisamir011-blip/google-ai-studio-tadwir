import { useState, useCallback, useEffect } from 'react';
import { achievementsList } from '../data/achievements';

const STATS_STORAGE_KEY = 'recycling_stats';

// FIX: Define a strict type for the stats state to ensure type safety.
interface StatsState {
    itemsScanned: number;
    searchesMade: number;
    achievementsUnlocked: Set<string>;
}

const getInitialStats = (): StatsState => {
    try {
        const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
        if (storedStats) {
            const parsed = JSON.parse(storedStats);
            return {
                itemsScanned: parsed.itemsScanned || 0,
                searchesMade: parsed.searchesMade || 0,
                // FIX: Explicitly create a Set<string> to avoid it being inferred as Set<unknown>.
                achievementsUnlocked: new Set<string>(parsed.achievementsUnlocked || []),
            };
        }
    } catch (error) {
        console.error("Failed to parse stats from localStorage", error);
    }
    return {
        itemsScanned: 0,
        searchesMade: 0,
        achievementsUnlocked: new Set<string>(),
    };
};

const emptyStats: StatsState = {
    itemsScanned: 0,
    searchesMade: 0,
    achievementsUnlocked: new Set<string>(),
};


export const useAchievements = () => {
    // FIX: Use the StatsState interface for the useState hook.
    const [stats, setStats] = useState<StatsState>(emptyStats);
    const [loading, setLoading] = useState<boolean>(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const unlockedAchievements = stats.achievementsUnlocked;

     useEffect(() => {
        const timer = setTimeout(() => {
            const loadedStats = getInitialStats();
            setStats(loadedStats);
            setLoading(false);
        }, 1500); // Simulate a 1.5 second loading time for skeleton loaders

        return () => clearTimeout(timer);
    }, []); // Run only once on mount

    useEffect(() => {
        // Do not save to localStorage while loading initial empty stats
        if (loading) return;
        try {
             const statsToStore = {
                itemsScanned: stats.itemsScanned,
                searchesMade: stats.searchesMade,
                // Convert Set to Array for JSON serialization
                achievementsUnlocked: Array.from(stats.achievementsUnlocked),
            };
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(statsToStore));
        } catch (error) {
            console.error("Failed to save stats to localStorage", error);
        }
    }, [stats, loading]);

    const unlockAchievement = useCallback((achievementId: string) => {
        if (!unlockedAchievements.has(achievementId)) {
            const achievement = achievementsList.find(a => a.id === achievementId);
            if (achievement) {
                setStats(prev => {
                    const newAchievements = new Set(prev.achievementsUnlocked);
                    newAchievements.add(achievementId);
                    return { ...prev, achievementsUnlocked: newAchievements };
                });
                setToastMessage(`إنجاز جديد: ${achievement.title}`);
            }
        }
    }, [unlockedAchievements]);

    const incrementStat = useCallback((statName: 'itemsScanned' | 'searchesMade') => {
        setStats(prev => ({
            ...prev,
            [statName]: prev[statName] + 1,
        }));
    }, []);

    const processedStats = {
        itemsScanned: stats.itemsScanned,
        searchesMade: stats.searchesMade,
        achievementsUnlocked: stats.achievementsUnlocked.size,
    };
    
    return { unlockedAchievements, unlockAchievement, stats: processedStats, incrementStat, toastMessage, setToastMessage, loading };
};