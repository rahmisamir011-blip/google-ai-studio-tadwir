import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/firebase_service.dart';
import '../data/achievements_data.dart';
import '../models/achievement.dart';

class AchievementsScreen extends StatefulWidget {
  const AchievementsScreen({Key? key}) : super(key: key);

  @override
  _AchievementsScreenState createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends State<AchievementsScreen> {
  final FirebaseService _firebaseService = FirebaseService();
  Set<String> _unlockedAchievementIds = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUnlockedAchievements();
  }

  Future<void> _loadUnlockedAchievements() async {
    setState(() {
      _isLoading = true;
    });

    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      final querySnapshot = await _firebaseService.getUnlockedAchievements(user.uid);
      final ids = querySnapshot.docs.map((doc) => doc.id).toSet();
      if (mounted) {
        setState(() {
          _unlockedAchievementIds = ids;
          _isLoading = false;
        });
      }
    } else {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadUnlockedAchievements,
              child: ListView.builder(
                itemCount: allAchievements.length,
                itemBuilder: (context, index) {
                  final Achievement achievement = allAchievements[index];
                  final bool isUnlocked = _unlockedAchievementIds.contains(achievement.id);

                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    color: isUnlocked ? Colors.green[100] : Colors.grey[200],
                    child: ListTile(
                      leading: Text(
                        achievement.icon,
                        style: const TextStyle(fontSize: 24),
                      ),
                      title: Text(
                        achievement.title,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: isUnlocked ? Colors.green[800] : Colors.black,
                        ),
                      ),
                      subtitle: Text(achievement.description),
                      trailing: Icon(
                        isUnlocked ? Icons.lock_open : Icons.lock,
                        color: isUnlocked ? Colors.green : Colors.grey,
                      ),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
