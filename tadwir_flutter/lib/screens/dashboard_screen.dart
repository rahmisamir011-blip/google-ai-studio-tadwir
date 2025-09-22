import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/firebase_service.dart';
import '../widgets/voice_assistant_modal.dart';
import '../constants.dart';
import '../data/recycling_facts.dart';

class DashboardScreen extends StatefulWidget {
  final Function(int) onNavigate;

  const DashboardScreen({Key? key, required this.onNavigate}) : super(key: key);

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final FirebaseService _firebaseService = FirebaseService();
  String? _username;
  int _itemsScanned = 0;
  int _searchesMade = 0;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user != null) {
      final userProfile = await _firebaseService.getUserProfile(user.uid);
      final itemsScanned = await _firebaseService.getUserStat(user.uid, itemsScannedStat);
      final searchesMade = await _firebaseService.getUserStat(user.uid, searchesMadeStat);
      if (mounted) {
        setState(() {
          _username = userProfile['username'];
          _itemsScanned = itemsScanned;
          _searchesMade = searchesMade;
        });
      }
    }
  }

  void _showFactDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Did you know?'),
        content: Text(getRandomFact()),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Awesome!'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => showVoiceAssistantModal(context),
        child: const Icon(Icons.mic),
      ),
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.exit_to_app),
            onPressed: () {
              _firebaseService.signOut();
            },
          ),
        ],
      ),
      body: _username == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome, $_username!',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Your Stats',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatCard('Items Scanned', _itemsScanned.toString()),
                      _buildStatCard('Searches Made', _searchesMade.toString()),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Categories',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 16),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      _buildCategoryCard('Scan New Item', Icons.camera_alt, () => widget.onNavigate(1)),
                      _buildCategoryCard('Search Library', Icons.search, () => widget.onNavigate(2)),
                      _buildCategoryCard('View Achievements', Icons.star, () => widget.onNavigate(3)),
                      _buildCategoryCard('Recycling Facts', Icons.lightbulb, _showFactDialog),
                    ],
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String title, String value) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(value, style: Theme.of(context).textTheme.headlineMedium),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(String title, IconData icon, VoidCallback onTap) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 48),
            const SizedBox(height: 8),
            Text(title, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
