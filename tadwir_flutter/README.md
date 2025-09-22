# Tadwir Flutter

This is a Flutter rewrite of the Tadwir application.

## Getting Started

1.  **Install Flutter:** Make sure you have the Flutter SDK installed.
2.  **Get dependencies:** Run `flutter pub get` in the `tadwir_flutter` directory.
3.  **Configure Firebase:**
    *   Follow the instructions on the [FlutterFire documentation](https://firebase.flutter.dev/docs/cli) to install the Firebase CLI.
    *   Run `flutterfire configure` in the `tadwir_flutter` directory to connect the app to your Firebase project.
4.  **Set up Gemini API Key:** You must provide your Gemini API key as an environment variable when running the app. For example:
    ```bash
    flutter run --dart-define=GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
5.  **Configure Microphone Usage:** The voice assistant feature requires microphone permissions.
    *   **iOS:** Add the `NSSpeechRecognitionUsageDescription` and `NSMicrophoneUsageDescription` keys to your `ios/Runner/Info.plist` file.
    *   **Android:** Ensure your `android/app/src/main/AndroidManifest.xml` includes the `<uses-permission android:name="android.permission.RECORD_AUDIO" />` permission.
6.  **Run the app:** `flutter run --dart-define=GEMINI_API_KEY=YOUR_API_KEY_HERE`
