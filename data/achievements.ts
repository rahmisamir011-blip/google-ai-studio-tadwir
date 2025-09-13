export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export const achievementsList: Achievement[] = [
    {
        id: 'rookieRecycler',
        title: 'مُستجد التدوير',
        description: 'امسح أول مادة لك باستخدام الكاميرا.',
        icon: '🥇',
    },
    {
        id: 'curiousExplorer',
        title: 'مستكشف فضولي',
        description: 'ابحث عن أول مادة لك في المكتبة.',
        icon: '📚',
    },
    {
        id: 'seasonedScanner',
        title: 'ماسح ضوئي متمرس',
        description: 'امسح 5 مواد مختلفة بنجاح.',
        icon: '📸',
    },
    {
        id: 'ecoWarrior',
        title: 'محارب البيئة',
        description: 'حقق 3 إنجازات.',
        icon: '🏆',
    },
];
