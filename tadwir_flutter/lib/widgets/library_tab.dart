import 'package:flutter/material.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/gemini_service.dart';
import '../services/firebase_service.dart';
import '../utils/toast_util.dart';
import '../constants.dart';
import '../models/app_exception.dart';

class LibraryTab extends StatefulWidget {
  const LibraryTab({Key? key}) : super(key: key);

  @override
  _LibraryTabState createState() => _LibraryTabState();
}

class _LibraryTabState extends State<LibraryTab> {
  final _textController = TextEditingController();
  final GeminiService _geminiService = GeminiService();
  final FirebaseService _firebaseService = FirebaseService();
  String? _result;
  bool _isLoading = false;

  Future<void> _search() async {
    if (_textController.text.isEmpty) {
      return;
    }

    setState(() {
      _isLoading = true;
      _result = null;
    });

    try {
      final result = await _geminiService.generateContentFromText(_textController.text);
      setState(() => _result = result);

      // Handle achievement logic
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await _firebaseService.incrementStat(user.uid, searchesMadeStat);

        final isCuriousUnlocked = await _firebaseService.isAchievementUnlocked(user.uid, curiousExplorerId);
        if (!isCuriousUnlocked) {
          await _firebaseService.unlockAchievement(user.uid, curiousExplorerId);
          ToastUtil.showToast('Achievement Unlocked: Curious Explorer!');
        }

        final searchesMade = await _firebaseService.getUserStat(user.uid, searchesMadeStat);
        if (searchesMade >= 10) {
          final isKnowledgeSeekerUnlocked = await _firebaseService.isAchievementUnlocked(user.uid, knowledgeSeekerId);
          if (!isKnowledgeSeekerUnlocked) {
            await _firebaseService.unlockAchievement(user.uid, knowledgeSeekerId);
            ToastUtil.showToast('Achievement Unlocked: Knowledge Seeker!');
          }
        }
      }
    } on AppException catch (e) {
      setState(() => _result = e.message);
    } catch (e) {
      setState(() => _result = 'An unexpected error occurred.');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          TextField(
            controller: _textController,
            decoration: InputDecoration(
              labelText: 'Search for an item (e.g., "plastic bottle")',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              suffixIcon: IconButton(
                icon: const Icon(Icons.clear),
                onPressed: () => _textController.clear(),
              ),
            ),
            onSubmitted: (_) => _search(),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _isLoading ? null : _search,
            icon: const Icon(Icons.search),
            label: const Text('Search'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
              textStyle: const TextStyle(fontSize: 16),
            ),
          ),
          const SizedBox(height: 20),
          if (_isLoading)
            const CircularProgressIndicator()
          else if (_result != null)
            Text(
              _result!,
              textAlign: TextAlign.center,
            ),
        ],
      ),
    );
  }
}
