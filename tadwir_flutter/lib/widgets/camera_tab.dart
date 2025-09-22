import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/gemini_service.dart';
import '../services/firebase_service.dart';
import '../utils/toast_util.dart';
import '../constants.dart';
import '../models/app_exception.dart';

class CameraTab extends StatefulWidget {
  const CameraTab({Key? key}) : super(key: key);

  @override
  _CameraTabState createState() => _CameraTabState();
}

class _CameraTabState extends State<CameraTab> {
  final ImagePicker _picker = ImagePicker();
  final GeminiService _geminiService = GeminiService();
  final FirebaseService _firebaseService = FirebaseService();
  File? _image;
  String? _result;
  bool _isLoading = false;

  Future<void> _pickImage() async {
    setState(() {
      _isLoading = true;
      _result = null;
      _image = null;
    });

    try {
      final XFile? pickedFile = await _picker.pickImage(source: ImageSource.camera);

      if (pickedFile != null) {
        final imageFile = File(pickedFile.path);
        setState(() => _image = imageFile);

        final result = await _geminiService.generateContentFromImage(imageFile);
        setState(() => _result = result);

        // Handle achievement logic
        final user = FirebaseAuth.instance.currentUser;
        if (user != null) {
          await _firebaseService.incrementStat(user.uid, itemsScannedStat);

          final isRookieUnlocked = await _firebaseService.isAchievementUnlocked(user.uid, rookieRecyclerId);
          if (!isRookieUnlocked) {
            await _firebaseService.unlockAchievement(user.uid, rookieRecyclerId);
            ToastUtil.showToast('Achievement Unlocked: Rookie Recycler!');
          }

          final itemsScanned = await _firebaseService.getUserStat(user.uid, itemsScannedStat);
          if (itemsScanned >= 5) {
            final isSeasonedUnlocked = await _firebaseService.isAchievementUnlocked(user.uid, seasonedScannerId);
            if (!isSeasonedUnlocked) {
              await _firebaseService.unlockAchievement(user.uid, seasonedScannerId);
              ToastUtil.showToast('Achievement Unlocked: Seasoned Scanner!');
            }
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
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Container(
            height: 250,
            width: double.infinity,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(12),
            ),
            child: _image != null
                ? Image.file(_image!, fit: BoxFit.cover)
                : const Center(child: Text('Take a picture to scan')),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _isLoading ? null : _pickImage,
            icon: const Icon(Icons.camera_alt),
            label: const Text('Scan with Camera'),
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
