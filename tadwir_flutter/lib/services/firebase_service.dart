import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/app_exception.dart';

class FirebaseService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<void> createUserProfile({required String uid, required String username}) async {
    await _firestore.collection('users').doc(uid).set({
      'username': username,
      'createdAt': Timestamp.now(),
    });
  }

  Future<bool> doesUserProfileExist(String uid) async {
    final doc = await _firestore.collection('users').doc(uid).get();
    return doc.exists;
  }

  Future<DocumentSnapshot> getUserProfile(String uid) async {
    return await _firestore.collection('users').doc(uid).get();
  }

  Future<void> incrementStat(String uid, String statName) async {
    final statRef = _firestore.collection('users').doc(uid).collection('stats').doc(statName);
    await statRef.set({'value': FieldValue.increment(1)}, SetOptions(merge: true));
  }

  Future<void> unlockAchievement(String uid, String achievementId) async {
    final achievementRef = _firestore.collection('users').doc(uid).collection('achievements').doc(achievementId);
    await achievementRef.set({'unlockedAt': Timestamp.now()});
  }

  Future<DocumentSnapshot> getUserStats(String uid) async {
    // This is a simplified version. In a real app, you might get all stats in one go.
    // For this implementation, we'll fetch stats as needed.
    // This function can be expanded if we need to get all stats at once.
    // For now, let's get the whole user document which might contain stats.
    return await _firestore.collection('users').doc(uid).get();
  }

  Future<int> getUserStat(String uid, String statName) async {
    final statDoc = await _firestore.collection('users').doc(uid).collection('stats').doc(statName).get();
    if (statDoc.exists) {
      return statDoc.data()?['value'] ?? 0;
    }
    return 0;
  }

  Future<QuerySnapshot> getUnlockedAchievements(String uid) async {
    return await _firestore.collection('users').doc(uid).collection('achievements').get();
  }

  Future<bool> isAchievementUnlocked(String uid, String achievementId) async {
    final doc = await _firestore.collection('users').doc(uid).collection('achievements').doc(achievementId).get();
    return doc.exists;
  }

  Future<UserCredential> signInWithEmailAndPassword(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw AppException(e.message ?? 'An unknown authentication error occurred.');
    }
  }

  Future<UserCredential> createUserWithEmailAndPassword(String email, String password) async {
    try {
      return await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
    } on FirebaseAuthException catch (e) {
      throw AppException(e.message ?? 'An unknown authentication error occurred.');
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
