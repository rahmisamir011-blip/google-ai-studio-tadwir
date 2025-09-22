import '../models/achievement.dart';
import '../constants.dart';

final List<Achievement> allAchievements = [
  Achievement(
    id: rookieRecyclerId,
    title: 'Rookie Recycler',
    description: 'You scanned your first item!',
    icon: '🌱',
  ),
  Achievement(
    id: seasonedScannerId,
    title: 'Seasoned Scanner',
    description: 'You scanned 5 items. Keep it up!',
    icon: '🌿',
  ),
  Achievement(
    id: curiousExplorerId,
    title: 'Curious Explorer',
    description: 'You made your first library search.',
    icon: '🔍',
  ),
  Achievement(
    id: knowledgeSeekerId,
    title: 'Knowledge Seeker',
    description: 'You\'ve made 10 searches in the library.',
    icon: '📚',
  ),
  // Add more achievements as needed
];
